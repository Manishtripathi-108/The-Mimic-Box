import NextAuth from 'next-auth';

import authConfig from '@/auth.config';
import { API_AUTH_PREFIX, AUTH_ROUTES, DEFAULT_AUTH_REDIRECT, DEFAULT_AUTH_ROUTE, PUBLIC_ROUTES } from '@/constants/routes.constants';

const { auth } = NextAuth(authConfig);

const ENABLE_LOGGING = false;

// Comprehensive bot/crawler regex
const BOT_REGEX =
    /bot|crawl|slurp|spider|facebook|twitter|discord|embed|whatsapp|messenger|telegram|google|bing|yandex|baidu|pinterest|reddit|linkedin|preview|vkShare|skype|outbrain|quora|duckduckbot|applebot|ia_archiver/i;

export default auth((req) => {
    const { pathname, search } = req.nextUrl;
    const isAuthenticated = !!req.auth;
    const userAgent = req.headers.get('user-agent') || '';

    const isApiAuthRoute = pathname.startsWith(API_AUTH_PREFIX);
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    const isAuthRoute = AUTH_ROUTES.includes(pathname);

    // bot detection — allow bots for SEO/social previews
    const isBot = BOT_REGEX.test(userAgent);
    const isSitemapOrRobots = pathname === '/robots.txt' || pathname.startsWith('/mimic-sitemap');

    if (ENABLE_LOGGING) {
        console.log('------------------------------------------------------');
        console.log(`🔗 Path: ${pathname}`);
        console.log(`🔐 Authenticated: ${isAuthenticated}`);
        console.log(`🤖 User-Agent: ${userAgent}`);
        console.log(`🕷️ Bot: ${isBot}`);
    }

    // Always allow bots and sitemap-related paths
    if (isApiAuthRoute || isBot || isSitemapOrRobots) {
        return;
    }

    // Helper to redirect
    const redirectTo = (destination: string) => {
        if (ENABLE_LOGGING) console.log(`🔄 Redirecting to: ${destination}`);
        return Response.redirect(new URL(destination, req.nextUrl));
    };

    // Auth pages: if already logged in, redirect to dashboard
    if (isAuthRoute) {
        return isAuthenticated ? redirectTo(DEFAULT_AUTH_REDIRECT) : undefined;
    }

    // Protected pages: require auth
    if (!isAuthenticated && !isPublicRoute) {
        const callbackUrl = encodeURIComponent(`${pathname}${search}`);
        return redirectTo(`${DEFAULT_AUTH_ROUTE}?callbackUrl=${callbackUrl}`);
    }

    // All good — allow request
    return;
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
