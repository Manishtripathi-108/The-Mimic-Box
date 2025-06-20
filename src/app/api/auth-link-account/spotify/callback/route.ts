import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

import axios from 'axios';

import { auth } from '@/auth';
import spotifyApiRoutes from '@/constants/external-routes/spotify.routes';
import API_ROUTES from '@/constants/routes/api.routes';
import APP_ROUTES from '@/constants/routes/app.routes';
import { DEFAULT_AUTH_ROUTE } from '@/constants/routes/auth.routes';
import { db } from '@/lib/db';
import { getMe } from '@/lib/services/spotify/user.spotify.services';
import { ErrorCodes } from '@/lib/types/response.types';
import { T_SpotifyAccessToken } from '@/lib/types/spotify.types';
import { safeAwait } from '@/lib/utils/safeAwait.utils';

export async function GET(req: NextRequest) {
    const session = await auth();

    if (!session?.user?.id) {
        console.error('[Spotify Link] Missing session or user ID');
        return redirect(DEFAULT_AUTH_ROUTE);
    }

    const { searchParams } = req.nextUrl;
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code || !state) {
        console.error('[Spotify Link] Missing "code" or "state" in query params', { code, state });
        return redirect(APP_ROUTES.AUTH.LINK_ACCOUNT_ERROR('spotify', 'missing_parameters'));
    }

    const authHeader = Buffer.from(`${process.env.AUTH_SPOTIFY_ID}:${process.env.AUTH_SPOTIFY_SECRET}`).toString('base64');

    const [tokenErr, tokenRes] = await safeAwait(
        axios.post<T_SpotifyAccessToken>(
            spotifyApiRoutes.exchangeToken,
            new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: `${process.env.NEXT_PUBLIC_URL}${API_ROUTES.AUTH_LA_SPOTIFY_CALLBACK}`,
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${authHeader}`,
                },
            }
        )
    );

    if (tokenErr || !tokenRes?.data) {
        const errorCode: ErrorCodes = axios.isAxiosError(tokenErr) ? tokenErr.response?.data?.error || 'invalid_grant' : 'server_error';

        console.error('[Spotify Link] Token exchange failed', tokenErr);
        return redirect(APP_ROUTES.AUTH.LINK_ACCOUNT_ERROR('spotify', errorCode));
    }

    const tokens = tokenRes.data;
    const userProfileRes = await getMe(tokens.access_token);

    if (!userProfileRes.success) {
        console.error('[Spotify Link] Failed to fetch user profile', userProfileRes);
        return redirect(APP_ROUTES.AUTH.LINK_ACCOUNT_ERROR('spotify', userProfileRes.code || 'server_error'));
    }

    const { id: providerAccountId, display_name, images } = userProfileRes.payload;

    const accountData = {
        providerAccountId,
        displayName: display_name,
        imageUrl: images.find((img) => img.width && img.width < 300)?.url,
        bannerUrl: images.find((img) => img.width && img.width >= 300)?.url,
        scope: tokens.scope,
        token_type: tokens.token_type,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: Date.now() + tokens.expires_in * 1000,
    };

    const [dbErr] = await safeAwait(
        db.linkedAccount.upsert({
            where: {
                userId_provider: {
                    userId: session.user.id,
                    provider: 'spotify',
                },
            },
            update: accountData,
            create: {
                userId: session.user.id,
                provider: 'spotify',
                type: 'oauth',
                ...accountData,
            },
        })
    );

    if (dbErr) {
        console.error('[Spotify Link] Failed to save linked account to database', dbErr);
        return redirect(APP_ROUTES.AUTH.LINK_ACCOUNT_ERROR('spotify', 'server_error'));
    }

    return redirect(`${APP_ROUTES.REDIRECT}?callbackUrl=${encodeURIComponent(state)}`);
}
