'use server';

import { LinkedAccountProvider } from '@prisma/client';
import axios from 'axios';

import { auth } from '@/auth';
import { EXTERNAL_ROUTES } from '@/constants/routes.constants';
import { db } from '@/lib/db';
import { ErrorResponseOutput, SuccessResponseOutput } from '@/lib/types/response.types';
import { createAniListErrorReturn, createErrorReturn, createSuccessReturn } from '@/lib/utils/createResponse.utils';
import { safeAwait } from '@/lib/utils/safeAwait.utils';

export const removeLinkedAccount = async (provider: LinkedAccountProvider) => {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return createErrorReturn('User not found');

    const [error] = await safeAwait(
        db.linkedAccount.delete({
            where: { userId_provider: { userId, provider } },
        })
    );

    return error ? createErrorReturn(`Failed to disconnect ${provider}`, error) : createSuccessReturn(`Successfully disconnected ${provider}`);
};

export const refreshToken = async (
    userId: string,
    refreshToken: string,
    provider: LinkedAccountProvider
): Promise<
    | ErrorResponseOutput<{ retryAfterSeconds: number; remainingRateLimit: number } | undefined>
    | SuccessResponseOutput<{
          accessToken: string;
          refreshToken: string;
          expiresAt: number;
      }>
> => {
    if (!refreshToken) return createErrorReturn('Unauthorized: Please log in again.');

    try {
        const requestConfig = getProviderConfig(provider, refreshToken);
        if (!requestConfig) return createErrorReturn('Unauthorized: Please log in again.');

        const response = await axios.post(requestConfig.url, requestConfig.data, { headers: requestConfig.headers });

        const { access_token, refresh_token: newRefreshToken, expires_in } = response.data;
        const updatedRefreshToken = newRefreshToken || refreshToken;
        const expiresAt = Math.floor(Date.now()) + expires_in * (provider === 'anilist' ? 1 : 1000);

        await safeAwait(
            db.linkedAccount.update({
                where: { userId_provider: { userId, provider } },
                data: { access_token, refresh_token: updatedRefreshToken, expires_at: expiresAt },
            })
        );

        return createSuccessReturn(`Successfully refreshed ${provider} token`, {
            accessToken: access_token,
            refreshToken: updatedRefreshToken,
            expiresAt,
        });
    } catch (error) {
        switch (provider) {
            case 'anilist':
                return createAniListErrorReturn('Failed to refresh AniList token', error);
            default:
                return createErrorReturn('Unauthorized: Please log in again.');
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
                url: EXTERNAL_ROUTES.ANILIST.EXCHANGE_TOKEN,
                data: {
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                    client_id: process.env.AUTH_ANILIST_ID!,
                    client_secret: process.env.AUTH_ANILIST_SECRET!,
                },
            };
        case 'spotify':
            return {
                url: EXTERNAL_ROUTES.SPOTIFY.EXCHANGE_TOKEN,
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
