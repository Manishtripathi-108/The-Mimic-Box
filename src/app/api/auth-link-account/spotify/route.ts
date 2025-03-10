import { auth } from '@/auth';
import { API_ROUTES, EXTERNAL_ROUTES } from '@/constants/routes.constants';
import { errorResponse } from '@/lib/utils/response.utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const session = await auth();

    if (!session || !session.user?.id) {
        return errorResponse({ message: 'Unauthorized, please login', status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const params = new URLSearchParams({
        client_id: process.env.AUTH_SPOTIFY_ID!,
        response_type: 'code',
        redirect_uri: `${process.env.NEXT_PUBLIC_URL}${API_ROUTES.AUTH_LINK_ACCOUNT.SPOTIFY.CALLBACK}`,
        scope: process.env.AUTH_SPOTIFY_SCOPES!,
        state: searchParams.get('callbackUrl') || '',
    });

    return NextResponse.json({ success: true, redirectUrl: `${EXTERNAL_ROUTES.SPOTIFY.AUTH}?${params.toString()}` });
}
