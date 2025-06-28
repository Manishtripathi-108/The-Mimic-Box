import { NextRequest } from 'next/server';

import { auth } from '@/auth';
import spotifyApiRoutes from '@/constants/external-routes/spotify.routes';
import API_ROUTES from '@/constants/routes/api.routes';
import { createErrorResponse, createSuccessResponse } from '@/lib/utils/createResponse.utils';

export async function GET(req: NextRequest) {
    const session = await auth();

    if (!session || !session.user?.id) {
        return createErrorResponse({ message: 'Unauthorized, please login', status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const params = new URLSearchParams({
        client_id: process.env.AUTH_SPOTIFY_ID!,
        response_type: 'code',
        redirect_uri: `${process.env.NEXT_PUBLIC_URL}${API_ROUTES.AUTH_LA_SPOTIFY_CALLBACK}`,
        scope: process.env.AUTH_SPOTIFY_SCOPES!,
        state: searchParams.get('callbackUrl') || '/',
    });

    return createSuccessResponse({ message: 'Redirecting to Spotify', payload: `${spotifyApiRoutes.auth}?${params.toString()}` });
}
