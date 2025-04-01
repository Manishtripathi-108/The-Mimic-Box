import NextAuth from 'next-auth';

import authConfig from '@/auth.config';
import { API_AUTH_PREFIX, AUTH_ROUTES, DEFAULT_AUTH_REDIRECT, DEFAULT_AUTH_ROUTE, PUBLIC_ROUTES } from '@/constants/routes.constants';

const { auth } = NextAuth(authConfig);

const ENABLE_LOGGING = false;

export default auth((req) => {
    const { pathname, search } = req.nextUrl;
    const isAuthenticated = !!req.auth;

    if (ENABLE_LOGGING) {
        console.log('------------------------------------------------------');
        console.log(`🔗 Path: ${pathname}`);
        console.log(`🔐 Authenticated: ${isAuthenticated}`);
    }

    const isApiAuthRoute = pathname.startsWith(API_AUTH_PREFIX);
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    const isAuthRoute = AUTH_ROUTES.includes(pathname);

    if (isApiAuthRoute) return undefined;

    const redirectTo = (destination: string) => Response.redirect(new URL(destination, req.nextUrl));

    if (isAuthRoute) {
        if (isAuthenticated) return redirectTo(DEFAULT_AUTH_REDIRECT);
        return undefined;
    }

    if (!isAuthenticated && !isPublicRoute) {
        const callbackUrl = encodeURIComponent(`${pathname}${search}`);
        return redirectTo(`${DEFAULT_AUTH_ROUTE}/?callbackUrl=${callbackUrl}`);
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
