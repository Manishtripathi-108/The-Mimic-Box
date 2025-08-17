'use server';

import { LinkedAccountProvider } from '@prisma/client';
import axios from 'axios';

import { auth } from '@/auth';
import ANILIST_ROUTES from '@/constants/external-routes/anilist.routes';
import spotifyApiRoutes from '@/constants/external-routes/spotify.routes';
import { db } from '@/lib/db';
import { T_ErrorResponseOutput, T_RateLimitInfo, T_SuccessResponseOutput } from '@/lib/types/response.types';
import { createAniListError, createError, createSuccess, createUnauthorized } from '@/lib/utils/createResponse.utils';
import { safeAwait } from '@/lib/utils/safeAwait.utils';

export const removeLinkedAccount = async (provider: LinkedAccountProvider) => {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return createError('User not found');

    const [error] = await safeAwait(
        db.linkedAccount.delete({
            where: { userId_provider: { userId, provider } },
        })
    );

    return error ? createError(`Failed to disconnect ${provider}`, { error }) : createSuccess(`Successfully disconnected ${provider}`);
};

/**
 * Refreshes the token for a linked account.
 */
export const refreshToken = async (
    userId: string,
    refreshToken: string,
    provider: LinkedAccountProvider
): Promise<
    | T_ErrorResponseOutput<T_RateLimitInfo | undefined>
    | T_SuccessResponseOutput<{
          accessToken: string;
          refreshToken: string;
          expiresAt: number;
      }>
> => {
    // If there is no refresh token, return an unauthorized error.
    if (!refreshToken) return createUnauthorized('Unauthorized: Please log in again.');

    try {
        // Check if the token is still valid in the database.
        const dbProvider = await db.linkedAccount.findUnique({
            where: { userId_provider: { userId, provider } },
        });

        if (dbProvider && dbProvider.expires_at > Date.now()) {
            // If the token is valid, return the token data.
            return createSuccess('Token is still valid', {
                accessToken: dbProvider.access_token,
                refreshToken: dbProvider.refresh_token,
                expiresAt: dbProvider.expires_at,
            });
        }

        // Get the request configuration for the provider.
        const requestConfig = getProviderConfig(provider, refreshToken);

        // If there is no request configuration, return an unauthorized error.
        if (!requestConfig) {
            return createUnauthorized('Unauthorized: Please log in again.');
        }

        // Send a POST request to refresh the token.
        const response = await axios.post(requestConfig.url, requestConfig.data, {
            headers: requestConfig.headers,
        });

        const { access_token, refresh_token: newRefreshToken, expires_in } = response.data;

        // If there is no access token, return an unauthorized error.
        if (!access_token) {
            return createUnauthorized('Unauthorized: Please log in again.');
        }

        const updatedRefreshToken = newRefreshToken || refreshToken;
        const expiresAt = Math.floor(Date.now()) + expires_in * (provider === 'anilist' ? 1 : 1000);

        // Update the token in the database.
        await safeAwait(
            db.linkedAccount.update({
                where: { userId_provider: { userId, provider } },
                data: { access_token, refresh_token: updatedRefreshToken, expires_at: expiresAt },
            })
        );

        // Return the success response with the new token data.
        return createSuccess(`Successfully refreshed ${provider} token`, {
            accessToken: access_token,
            refreshToken: updatedRefreshToken,
            expiresAt,
        });
    } catch (error) {
        // Handle different types of errors based on the provider.
        switch (provider) {
            case 'anilist':
                return createAniListError('Failed to refresh AniList token', { error });
            case 'spotify':
                return createError('Failed to refresh Spotify token', { error });
            default:
                return createError('Unauthorized: Please log in again.');
        }
    }
};

/**
 * Returns API configuration based on provider.
 */
const getProviderConfig = (
    provider: LinkedAccountProvider,
    refreshToken: string
): {
    url: string;
    data: Record<string, string> | string;
    headers?: Record<string, string>;
} | null => {
    switch (provider) {
        case 'anilist':
            return {
                url: ANILIST_ROUTES.TOKEN,
                data: {
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                    client_id: process.env.AUTH_ANILIST_ID!,
                    client_secret: process.env.AUTH_ANILIST_SECRET!,
                },
            };
        case 'spotify':
            return {
                url: spotifyApiRoutes.exchangeToken,
                data: new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                }).toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${Buffer.from(`${process.env.AUTH_SPOTIFY_ID}:${process.env.AUTH_SPOTIFY_SECRET}`).toString('base64')}`,
                },
            };
        default:
            return null;
    }
};
