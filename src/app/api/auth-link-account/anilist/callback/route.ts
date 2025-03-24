import { NextRequest, NextResponse } from 'next/server';

import axios from 'axios';

import { getAnilistUserProfile } from '@/actions/anilist.actions';
import { auth } from '@/auth';
import { API_ROUTES, APP_ROUTES, EXTERNAL_ROUTES } from '@/constants/routes.constants';
import { db } from '@/lib/db';
import { createAniListError, createErrorResponse } from '@/lib/utils/createResponse.utils';
import { safeAwait } from '@/lib/utils/safeAwait.utils';

export async function GET(req: NextRequest) {
    const session = await auth();

    if (!session || !session.user?.id) {
        return NextResponse.redirect(new URL(APP_ROUTES.AUTH_LOGIN, req.nextUrl));
    }

    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
        return createErrorResponse({ message: 'Missing required parameters', status: 400 });
    }

    // Exchange authorization code for access token
    const [exchError, exchResponse] = await safeAwait(
        axios.post(EXTERNAL_ROUTES.ANILIST.EXCHANGE_TOKEN, {
            grant_type: 'authorization_code',
            client_id: process.env.AUTH_ANILIST_ID,
            client_secret: process.env.AUTH_ANILIST_SECRET,
            redirect_uri: `${process.env.NEXT_PUBLIC_URL}${API_ROUTES.AUTH_LA_ANILIST_CALLBACK}`,
            code: code,
        })
    );

    if (exchError) {
        return createAniListError('Failed to Setup Anilist Account', exchError);
    }

    const tokens = exchResponse?.data;
    const userProfile = await getAnilistUserProfile(tokens.access_token);

    if (!userProfile) {
        return createErrorResponse({ message: 'Failed to Setup Anilist Account', status: 400 });
    }

    // Store tokens in the database
    const userId = session.user.id;
    const anilistData = {
        providerAccountId: userProfile?.Viewer.id?.toString(),
        imageUrl: userProfile?.Viewer.avatar.large || undefined,
        bannerUrl: userProfile?.Viewer.bannerImage || undefined,
        displayName: userProfile?.Viewer.name,
        scope: tokens.scope,
        token_type: tokens.token_type,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: Date.now() + tokens.expires_in,
    };

    const [dbError] = await safeAwait(
        db.linkedAccount.upsert({
            where: { userId_provider: { userId, provider: 'anilist' } },
            update: anilistData,
            create: {
                userId,
                provider: 'anilist',
                type: 'oauth',
                ...anilistData,
            },
        })
    );

    if (dbError) {
        return createErrorResponse({ message: 'Failed to Setup Anilist Account', error: dbError, status: 400 });
    }

    return NextResponse.redirect(new URL(APP_ROUTES.REDIRECT, req.nextUrl));
}
