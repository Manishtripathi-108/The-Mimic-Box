import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

import { auth } from '@/auth';
import APP_ROUTES from '@/constants/routes/app.routes';
import { DEFAULT_AUTH_ROUTE } from '@/constants/routes/auth.routes';
import { db } from '@/lib/db';
import { exchangeCodeForTokens } from '@/lib/services/linked-account.service';
import { getMe } from '@/lib/services/spotify/user.spotify.services';
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

    const tokens = await exchangeCodeForTokens('spotify', code);
    if (!tokens) return redirect(APP_ROUTES.AUTH.LINK_ACCOUNT_ERROR('spotify', 'invalid_grant'));

    const userProfileRes = await getMe(tokens.accessToken);

    if (!userProfileRes.success) {
        return redirect(APP_ROUTES.AUTH.LINK_ACCOUNT_ERROR('spotify', userProfileRes.code || 'server_error'));
    }

    const { id: providerAccountId, display_name, images } = userProfileRes.payload;

    const accountData = {
        providerAccountId,
        displayName: display_name,
        image: images.find((img) => img.width && img.width < 300)?.url,
        banner: images.find((img) => img.width && img.width >= 300)?.url,
        ...tokens,
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
