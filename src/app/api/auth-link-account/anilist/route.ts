import { auth } from '@/auth';
import { API_ROUTES, EXTERNAL_ROUTES } from '@/constants/routes.constants';
import { createErrorResponse, createSuccessResponse } from '@/lib/utils/response.utils';

export async function GET() {
    const session = await auth();

    if (!session || !session.user?.id) {
        return createErrorResponse({ message: 'Unauthorized, please login', status: 401 });
    }

    const params = new URLSearchParams({
        client_id: process.env.AUTH_ANILIST_ID!,
        redirect_uri: `${process.env.NEXT_PUBLIC_URL}${API_ROUTES.AUTH_LINK_ACCOUNT.ANILIST.CALLBACK}`,
        response_type: 'code',
    });

    // return NextResponse.json({ success: true, redirectUrl: `${EXTERNAL_ROUTES.ANILIST.AUTH}?${params.toString()}` });
    return createSuccessResponse({ message: 'Redirecting to Anilist', payload: `${EXTERNAL_ROUTES.ANILIST.AUTH}?${params.toString()}` });
}
