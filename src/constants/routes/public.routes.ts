import APP_ROUTES from '@/constants/routes/app.routes';

/**
 * Public routes that do not require authentication.
 * These routes are accessible to all users, including unauthenticated ones.
 */
export const PUBLIC_ROUTES: string[] = [
    APP_ROUTES.ROOT,
    APP_ROUTES.DEV,
    APP_ROUTES.AUTH.VERIFY_EMAIL,
    APP_ROUTES.AUTH.FORGOT_PASSWORD,
    APP_ROUTES.AUTH.RESET_PASSWORD,
    APP_ROUTES.AUTH.LINK_ACCOUNT_ERROR(),
    APP_ROUTES.GAMES.TIC_TAC_TOE.ROOT,
    APP_ROUTES.GAMES.TIC_TAC_TOE.CLASSIC,
    APP_ROUTES.GAMES.TIC_TAC_TOE.ULTIMATE,
];
