import { auth } from '@/auth';
import { API_ROUTES, APP_ROUTES, DEFAULT_AUTH_REDIRECT, EXTERNAL_ROUTES } from '@/constants/routes.constants';
import { db } from '@/lib/db';
import { getAnilistUserProfile } from '@/lib/services/anilist/user.service';
import { anilistErrorResponse, errorResponse } from '@/lib/utils/response.utils';
import { safeAwait } from '@/lib/utils/safeAwait.utils';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const session = await auth();

    if (!session || !session.user?.id) {
        return NextResponse.redirect(new URL(APP_ROUTES.AUTH.LOGIN, req.nextUrl));
    }

    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
        return errorResponse({ message: 'Missing required parameters', status: 400 });
    }

    // Exchange authorization code for access token
    const [exchError, exchResponse] = await safeAwait(
        axios.post(EXTERNAL_ROUTES.ANILIST.EXCHANGE_TOKEN, {
            grant_type: 'authorization_code',
            client_id: process.env.AUTH_ANILIST_ID,
            client_secret: process.env.AUTH_ANILIST_SECRET,
            redirect_uri: `${process.env.NEXT_PUBLIC_URL}${API_ROUTES.AUTH_LINK_ACCOUNT.ANILIST.CALLBACK}`,
            code: code,
        })
    );

    if (exchError) {
        return anilistErrorResponse('Failed to Setup Anilist Account', exchError);
    }

    const tokens = exchResponse?.data;
    const userProfile = await getAnilistUserProfile(tokens.access_token);

    if (!userProfile) {
        return errorResponse({ message: 'Failed to Setup Anilist Account', status: 400 });
    }

    // Store tokens in the database
    const userId = session.user.id;
    const [dbError] = await safeAwait(
        db.linkedAccount.upsert({
            where: { userId_provider: { userId, provider: 'anilist' } },
            update: {
                providerAccountId: userProfile?.Viewer.id?.toString(),
                imageUrl: userProfile?.Viewer.avatar.large,
                bannerUrl: userProfile?.Viewer.bannerImage,
                displayName: userProfile?.Viewer.name,
                scope: tokens.scope,
                token_type: tokens.token_type,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                expires_at: Math.floor(Date.now() / 1000) + tokens.expires_in,
            },
            create: {
                userId,
                provider: 'anilist',
                type: 'oauth',
                providerAccountId: userProfile?.Viewer.id?.toString(),
                imageUrl: userProfile?.Viewer.avatar.large,
                bannerUrl: userProfile?.Viewer.bannerImage,
                displayName: userProfile?.Viewer.name,
                scope: tokens.scope,
                token_type: tokens.token_type,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                expires_at: Math.floor(Date.now() / 1000) + tokens.expires_in,
            },
        })
    );

    if (dbError) {
        return errorResponse({ message: 'Failed to Setup Anilist Account', error: dbError, status: 400 });
    }

    return NextResponse.redirect(new URL(DEFAULT_AUTH_REDIRECT, req.nextUrl));
}
