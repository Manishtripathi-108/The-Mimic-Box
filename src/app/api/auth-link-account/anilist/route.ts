import { auth } from '@/auth';
import ANILIST_ROUTES from '@/constants/external-routes/anilist.routes';
import API_ROUTES from '@/constants/routes/api.routes';
import { createSuccess, createUnauthorized } from '@/lib/utils/createResponse.utils';

export async function GET() {
    const session = await auth();

    if (!session || !session.user?.id) {
        return createUnauthorized('User not authenticated.', {}, true);
    }

    const params = new URLSearchParams({
        client_id: process.env.AUTH_ANILIST_ID!,
        redirect_uri: `${process.env.NEXT_PUBLIC_URL}${API_ROUTES.AUTH_LA_ANILIST_CALLBACK}`,
        response_type: 'code',
    });

    // return NextResponse.json({ success: true, redirectUrl: `${EXTERNAL_ROUTES.ANILIST.AUTH}?${params.toString()}` });
    return createSuccess('Redirecting to Anilist', `${ANILIST_ROUTES.AUTH}?${params.toString()}`, {}, true);
}
