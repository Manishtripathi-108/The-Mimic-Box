import { auth } from '@/auth';
import { API_ROUTES, APP_ROUTES } from '@/constants/routes.constants';
import { db } from '@/lib/db';
import { getSpotifyUserProfile } from '@/lib/services/spotify/user.service';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const session = await auth();

    if (!session || !session.user?.id) {
        return NextResponse.redirect(new URL(APP_ROUTES.AUTH.LOGIN, req.nextUrl));
    }

    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code || !state) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const clientId = process.env.AUTH_SPOTIFY_ID;
    const clientSecret = process.env.AUTH_SPOTIFY_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_URL}${API_ROUTES.AUTH_LINK_ACCOUNT.SPOTIFY.CALLBACK}`;

    if (!clientId || !clientSecret) {
        console.error('Missing Spotify client credentials.');
        return NextResponse.json({ error: 'Server configuration error' }, { status: 300 });
    }

    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
        // Exchange authorization code for access token
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
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
        );

        if (!response.status || response.status !== 200) {
            if (response.data.error === 'invalid_grant') {
                return NextResponse.json({ success: false, error: 'Invalid authorization code' }, { status: 400 });
            }
            throw new Error('Failed to sign in with Spotify');
        }

        const tokens = response.data;
        const userProfile = await getSpotifyUserProfile(tokens.access_token);

        const userId = session.user.id;
        // Store tokens in the database
        await db.linkedAccount.upsert({
            where: { userId_provider: { userId, provider: 'spotify' } },
            update: {
                providerAccountId: userProfile.id,
                imageUrl: userProfile.images.find((image) => image.width && image.width < 300)?.url || null,
                bannerUrl: userProfile.images.find((image) => image.width && image.width >= 300)?.url || null,
                displayName: userProfile.display_name,
                scope: tokens.scope,
                token_type: tokens.token_type,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                expires_at: Math.floor(Date.now() / 1000) + tokens.expires_in,
            },
            create: {
                userId,
                provider: 'spotify',
                type: 'oauth',
                providerAccountId: userProfile.id,
                imageUrl: userProfile.images.find((image) => image.width && image.width < 300)?.url || null,
                bannerUrl: userProfile.images.find((image) => image.width && image.width >= 300)?.url || null,
                displayName: userProfile.display_name,
                scope: tokens.scope,
                token_type: tokens.token_type,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                expires_at: Math.floor(Date.now() / 1000) + tokens.expires_in,
            },
        });

        return NextResponse.redirect(new URL(decodeURIComponent(state), req.nextUrl));
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 300 });
    }
}
