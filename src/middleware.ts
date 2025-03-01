import authConfig from '@/auth.config';
import NextAuth from 'next-auth';
import { API_AUTH_PREFIX, AUTH_ROUTES, DEFAULT_AUTH_REDIRECT, DEFAULT_AUTH_ROUTE, PUBLIC_ROUTES } from '@/constants/routes.constants';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const isAuthenticated = !!req.auth;
    console.log('🔐 Auth:', isAuthenticated);
    console.log('⚪ Path:', req.nextUrl.pathname);

    const isApiAuthRoute = req.nextUrl.pathname.startsWith(API_AUTH_PREFIX);
    const isPublicRoute = PUBLIC_ROUTES.includes(req.nextUrl.pathname);
    const isAuthRoute = AUTH_ROUTES.includes(req.nextUrl.pathname);

    if (isApiAuthRoute) {
        return undefined;
    }

    if (isAuthRoute) {
        console.log('🔒 Auth Route:', req.nextUrl.pathname);
        if (isAuthenticated) {
            console.log('🔓 Authenticated');
            return Response.redirect(new URL(DEFAULT_AUTH_REDIRECT, req.nextUrl));
        }
        return undefined;
    }

    if (!isAuthenticated && !isPublicRoute) {
        console.log('🔒 Protected Route:', req.nextUrl.pathname);
        return Response.redirect(new URL(DEFAULT_AUTH_ROUTE, req.nextUrl));
    }

    return undefined;
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
