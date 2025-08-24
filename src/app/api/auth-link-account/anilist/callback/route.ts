import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

import { getUserProfile } from '@/actions/anilist.actions';
import { auth } from '@/auth';
import APP_ROUTES from '@/constants/routes/app.routes';
import { DEFAULT_AUTH_ROUTE } from '@/constants/routes/auth.routes';
import { db } from '@/lib/db';
import { exchangeCodeForTokens } from '@/lib/services/linked-account.service';
import { safeAwait } from '@/lib/utils/safeAwait.utils';

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

    const tokens = await exchangeCodeForTokens('anilist', code);
    if (!tokens) {
        return redirect(APP_ROUTES.AUTH.LINK_ACCOUNT_ERROR('anilist', 'invalid_grant', 'Failed to exchange code for tokens.'));
    }

    const userProfile = await getUserProfile(tokens.accessToken);

    if (!userProfile) {
        console.error('[AniList Link] Failed to fetch user profile', userProfile);
        return redirect(APP_ROUTES.AUTH.LINK_ACCOUNT_ERROR('anilist', 'server_error', 'Could not fetch user profile.'));
    }

    const userId = session.user.id;
    const anilistData = {
        providerAccountId: userProfile?.Viewer.id?.toString(),
        image: userProfile?.Viewer.avatar?.large || undefined,
        banner: userProfile?.Viewer.bannerImage || undefined,
        displayName: userProfile?.Viewer.name,
        ...tokens,
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
