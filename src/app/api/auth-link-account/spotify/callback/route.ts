import { NextRequest, NextResponse } from 'next/server';

import axios from 'axios';

import { auth } from '@/auth';
import { API_ROUTES, APP_ROUTES, DEFAULT_AUTH_ROUTE, EXTERNAL_ROUTES } from '@/constants/routes.constants';
import { db } from '@/lib/db';
import { getUserProfile } from '@/lib/services/spotify.service';
import { T_SpotifyAccessToken } from '@/lib/types/spotify.types';
import { createErrorResponse } from '@/lib/utils/createResponse.utils';
import { safeAwait } from '@/lib/utils/safeAwait.utils';

export async function GET(req: NextRequest) {
    const session = await auth();

    if (!session || !session.user?.id) {
        return NextResponse.redirect(new URL(DEFAULT_AUTH_ROUTE, req.nextUrl));
    }

    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code || !state) {
        return createErrorResponse({ message: 'Missing required parameters', status: 400 });
    }

    const clientId = process.env.AUTH_SPOTIFY_ID;
    const clientSecret = process.env.AUTH_SPOTIFY_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_URL}${API_ROUTES.AUTH_LA_SPOTIFY_CALLBACK}`;

    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    // Exchange authorization code for access token
    const [exchError, exchResponse] = await safeAwait(
        axios.post(
            EXTERNAL_ROUTES.SPOTIFY.EXCHANGE_TOKEN,
            new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${authHeader}`,
                },
            }
        )
    );

    if (exchError || !exchResponse || exchResponse.status !== 200) {
        return createErrorResponse({
            message: exchResponse?.data?.error === 'invalid_grant' ? 'Invalid authorization code' : 'Failed to authenticate with Spotify',
            status: 400,
            error: exchError || new Error(String(exchResponse)),
        });
    }

    const tokens = exchResponse.data as T_SpotifyAccessToken;
    const [error, userProfile] = await getUserProfile(tokens.access_token);

    if (error || !userProfile) {
        return createErrorResponse({ message: 'Failed to link Spotify account', status: 400 });
    }

    const userId = session.user.id;
    const spotifyData = {
        providerAccountId: userProfile.id,
        imageUrl: userProfile.images.find((image) => image.width && image.width < 300)?.url || undefined,
        bannerUrl: userProfile.images.find((image) => image.width && image.width >= 300)?.url || undefined,
        displayName: userProfile.display_name,
        scope: tokens.scope,
        token_type: tokens.token_type,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: Date.now() + tokens.expires_in * 1000,
    };

    const [dbError] = await safeAwait(
        db.linkedAccount.upsert({
            where: { userId_provider: { userId, provider: 'spotify' } },
            update: spotifyData,
            create: {
                userId,
                provider: 'spotify',
                type: 'oauth',
                ...spotifyData,
            },
        })
    );

    if (dbError) {
        return createErrorResponse({ message: 'Failed to link Spotify account', error: dbError, status: 400 });
    }
    return NextResponse.redirect(new URL(`${APP_ROUTES.REDIRECT}?callbackUrl=${encodeURIComponent(state)}`, req.nextUrl));
}
