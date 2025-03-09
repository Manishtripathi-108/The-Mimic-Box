import { auth } from '@/auth';
import { API_ROUTES, APP_ROUTES } from '@/constants/routes.constants';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const session = await auth();
    const searchParams = req.nextUrl.searchParams;

    if (!session || !session.user?.id) {
        return NextResponse.redirect(new URL(APP_ROUTES.AUTH.LOGIN, req.nextUrl));
    }

    const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
    const params = new URLSearchParams({
        client_id: process.env.AUTH_SPOTIFY_ID!,
        response_type: 'code',
        redirect_uri: `${process.env.NEXT_PUBLIC_URL}${API_ROUTES.AUTH_LINK_ACCOUNT.SPOTIFY.CALLBACK}`,
        scope: process.env.AUTH_SPOTIFY_SCOPES!,
        state: searchParams.get('callbackUrl') || '',
    });

    return NextResponse.json({ success: true, redirectUrl: `${SPOTIFY_AUTH_URL}?${params.toString()}` });
}
