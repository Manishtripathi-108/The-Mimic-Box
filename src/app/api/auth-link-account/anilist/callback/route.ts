import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

import axios from 'axios';

import { getUserProfile } from '@/actions/anilist.actions';
import { auth } from '@/auth';
import API_ROUTES from '@/constants/routes/api.routes';
import { db } from '@/lib/db';
import { safeAwait } from '@/lib/utils/safeAwait.utils';
import ANILIST_ROUTES from '@/constants/external-routes/anilist.routes';
import { DEFAULT_AUTH_ROUTE } from '@/constants/routes/auth.routes';
import APP_ROUTES from '@/constants/routes/app.routes';

export async function GET(req: NextRequest) {
    const session = await auth();

    if (!session?.user?.id) {
        console.error('[AniList Link] Missing session or user ID');
        return redirect(DEFAULT_AUTH_ROUTE);
    }

    const code = req.nextUrl.searchParams.get('code');

    if (!code) {
        console.error('[AniList Link] Missing "code" in query params');
        return redirect(APP_ROUTES.AUTH.LINK_ACCOUNT_ERROR('anilist', 'missing_parameters', 'Authorization code is required.'));
    }

    const [exchError, exchResponse] = await safeAwait(
        axios.post(ANILIST_ROUTES.TOKEN, {
            grant_type: 'authorization_code',
            client_id: process.env.AUTH_ANILIST_ID,
            client_secret: process.env.AUTH_ANILIST_SECRET,
            redirect_uri: `${process.env.NEXT_PUBLIC_URL}${API_ROUTES.AUTH_LA_ANILIST_CALLBACK}`,
            code,
        })
    );

    if (exchError || !exchResponse?.data) {
        const errorCode = axios.isAxiosError(exchError) ? exchError.response?.data?.error || 'invalid_grant' : 'server_error';

        console.error('[AniList Link] Token exchange failed', exchError);
        return redirect(APP_ROUTES.AUTH.LINK_ACCOUNT_ERROR('anilist', errorCode, 'Failed to exchange token.'));
    }

    const tokens = exchResponse.data;
    const userProfile = await getUserProfile(tokens.access_token);

    if (!userProfile) {
        console.error('[AniList Link] Failed to fetch user profile', userProfile);
        return redirect(APP_ROUTES.AUTH.LINK_ACCOUNT_ERROR('anilist', 'server_error', 'Could not fetch user profile.'));
    }

    const userId = session.user.id;
    const anilistData = {
        providerAccountId: userProfile?.Viewer.id?.toString(),
        imageUrl: userProfile?.Viewer.avatar?.large || undefined,
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
        console.error('[AniList Link] Failed to save account info to database', dbError);
        return redirect(APP_ROUTES.AUTH.LINK_ACCOUNT_ERROR('anilist', 'server_error', 'Failed to save account information.'));
    }

    return redirect(APP_ROUTES.REDIRECT);
}
