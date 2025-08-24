import { LinkedAccountProvider } from '@prisma/client';
import axios from 'axios';

import ANILIST_ROUTES from '@/constants/external-routes/anilist.routes';
import spotifyApiRoutes from '@/constants/external-routes/spotify.routes';
import API_ROUTES from '@/constants/routes/api.routes';
import { db } from '@/lib/db';
import { LinkedAccountsByProvider } from '@/lib/types/next-auth';
import { T_ErrorResponseOutput, T_RateLimitInfo, T_SuccessResponseOutput } from '@/lib/types/response.types';
import { createAniListError, createError, createSuccess, createUnauthorized } from '@/lib/utils/createResponse.utils';
import { safeAwait } from '@/lib/utils/safeAwait.utils';

type TokenResponse = {
    scope: string | null;
    tokenType: string | null;
    accessToken: string;
    refreshToken: string;
    expires: Date;
};

type RequestConfig = {
    url: string;
    data: URLSearchParams | Record<string, string>;
    headers?: Record<string, string>;
};

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

/**
 * Build Spotify-specific authorization headers
 */
const buildSpotifyAuthHeaders = (): Record<string, string> => {
    const credentials = `${process.env.AUTH_SPOTIFY_ID}:${process.env.AUTH_SPOTIFY_SECRET}`;
    const encodedCredentials = Buffer.from(credentials).toString('base64');

    return {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${encodedCredentials}`,
    };
};

/**
 * Calculate token expiry date based on provider-specific logic
 */
const calculateExpiryDate = (provider: LinkedAccountProvider, expiresIn: number): Date => {
    const multiplier = provider === 'anilist' ? 1 : 1000; // Anilist uses seconds, Spotify uses milliseconds
    return new Date(Date.now() + expiresIn * multiplier);
};

/**
 * Get callback route for provider
 */
const getCallbackRoute = (provider: LinkedAccountProvider): string => {
    return provider === 'spotify' ? API_ROUTES.AUTH_LA_SPOTIFY_CALLBACK : API_ROUTES.AUTH_LA_ANILIST_CALLBACK;
};

/**
 * Build request configuration for code exchange
 */
const buildExchangeConfig = (provider: LinkedAccountProvider, code: string): RequestConfig => {
    const baseParams = {
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_URL}${getCallbackRoute(provider)}`,
    };

    switch (provider) {
        case 'spotify':
            return {
                url: spotifyApiRoutes.exchangeToken,
                data: new URLSearchParams(baseParams),
                headers: buildSpotifyAuthHeaders(),
            };

        case 'anilist':
            return {
                url: ANILIST_ROUTES.TOKEN,
                data: {
                    ...baseParams,
                    client_id: process.env.AUTH_ANILIST_ID!,
                    client_secret: process.env.AUTH_ANILIST_SECRET!,
                },
            };

        default:
            throw new Error(`Unsupported provider: ${provider}`);
    }
};

/**
 * Build request configuration for token refresh
 */
const buildRefreshConfig = (provider: LinkedAccountProvider, refreshToken: string): RequestConfig | null => {
    const baseParams = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
    };

    switch (provider) {
        case 'spotify':
            return {
                url: spotifyApiRoutes.exchangeToken,
                data: new URLSearchParams(baseParams),
                headers: buildSpotifyAuthHeaders(),
            };

        case 'anilist':
            return {
                url: ANILIST_ROUTES.TOKEN,
                data: {
                    ...baseParams,
                    client_id: process.env.AUTH_ANILIST_ID!,
                    client_secret: process.env.AUTH_ANILIST_SECRET!,
                },
            };

        default:
            return null;
    }
};

/**
 * Execute token request and normalize response
 */
const executeTokenRequest = async (provider: LinkedAccountProvider, config: RequestConfig): Promise<TokenResponse | null> => {
    try {
        const response = await axios.post(config.url, config.data, {
            headers: config.headers,
        });

        const { access_token, refresh_token, expires_in, scope = null, token_type = null } = response.data;

        if (!access_token) return null;

        return {
            scope,
            tokenType: token_type,
            accessToken: access_token,
            refreshToken: refresh_token,
            expires: calculateExpiryDate(provider, expires_in),
        };
    } catch (error) {
        console.error(`OAuth token request failed for ${provider}:`, error);
        return null;
    }
};

/**
 * Exchange authorization code for access and refresh tokens
 */
export const exchangeCodeForTokens = async (provider: LinkedAccountProvider, code: string): Promise<TokenResponse | null> => {
    const config = buildExchangeConfig(provider, code);
    return executeTokenRequest(provider, config);
};

/**
 * Refresh access token using refresh token
 */
export const refreshTokens = async (
    provider: LinkedAccountProvider,
    refreshToken: string,
    userId: string
): Promise<Omit<TokenResponse, 'scope' | 'tokenType'> | null> => {
    const config = buildRefreshConfig(provider, refreshToken);
    if (!config) return null;

    const newTokens = await executeTokenRequest(provider, config);
    if (!newTokens) return null;

    // Save new tokens
    const [err, updatedTokens] = await safeAwait(
        db.linkedAccount.update({
            where: { userId_provider: { userId, provider } },
            data: newTokens,
            select: { accessToken: true, refreshToken: true, expires: true },
        })
    );

    // return err || !updatedTokens ? null : updatedTokens;
    if (err || !updatedTokens) {
        console.error(`Failed to update tokens in DB for ${provider}:`, err);
        return null;
    }

    // Return updated tokens
    return updatedTokens;
};

/* -------------------------------------------------------------------------- */
/*                                  For Auth                                  */
/* -------------------------------------------------------------------------- */

/**
 * Fetch all linked accounts for a user.
 */
export const getLinkedAccounts = async (userId: string | undefined): Promise<LinkedAccountsByProvider> => {
    if (!userId) return {};

    const linkedAccounts = await db.linkedAccount.findMany({
        where: { userId },
        select: {
            provider: true,
            providerAccountId: true,
            image: true,
            banner: true,
            displayName: true,
            username: true,
            tokenType: true,
            accessToken: true,
            refreshToken: true,
            expires: true,
        },
    });

    return linkedAccounts.reduce<LinkedAccountsByProvider>((acc, account) => {
        const { providerAccountId, ...rest } = account;

        acc[account.provider] = {
            id: providerAccountId,
            ...rest,
        };

        return acc;
    }, {});
};

export const getOrRefreshToken = async (
    userId: string,
    refreshToken: string,
    provider: LinkedAccountProvider
): Promise<
    | T_ErrorResponseOutput<T_RateLimitInfo | undefined>
    | T_SuccessResponseOutput<{
          accessToken: string;
          refreshToken: string;
          expires: Date;
      }>
> => {
    if (!refreshToken) return createUnauthorized('Unauthorized: Please log in again.');

    try {
        const dbProvider = await db.linkedAccount.findUnique({
            where: { userId_provider: { userId, provider } },
            select: { accessToken: true, refreshToken: true, expires: true },
        });

        // Return existing if still valid
        if (dbProvider && dbProvider.expires.getTime() > Date.now()) {
            return createSuccess('Token is still valid', dbProvider);
        }

        // Refresh with provider
        const newTokens = await refreshTokens(provider, refreshToken, userId);
        if (!newTokens) return createUnauthorized('Unauthorized: Please log in again.');

        return createSuccess(`Successfully refreshed ${provider} token`, newTokens);
    } catch (error) {
        switch (provider) {
            case 'anilist':
                return createAniListError('Failed to refresh AniList token', {
                    error,
                });
            case 'spotify':
                return createError('Failed to refresh Spotify token', { error });
            default:
                return createError('Unauthorized: Please log in again.');
        }
    }
};
