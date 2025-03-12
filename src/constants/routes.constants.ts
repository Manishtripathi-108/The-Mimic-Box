export const APP_ROUTES = {
    INDEX: '/',
    SHADOWS: '/shadows',
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        VERIFY_EMAIL: '/auth/verify-email',
        ERROR: '/auth/error',
    },
    AUDIO: {
        TAGS_EDITOR: '/audio/tags-editor',
        CONVERTER: '/audio/converter',
    },
    ANILIST: {
        INDEX: '/anilist/anime',
        // ANIME: (id: string) => `/anilist/anime/${id}`,
        ANIME: '/anilist/anime',
        MANGA: '/anilist/manga',
        FAVOURITES: '/anilist/favourites',
        IMPORT_EXPORT: '/anilist/import-export',
        LOGIN: '/anilist/login',
    },
    GAMES: {
        TIC_TAC_TOE: {
            INDEX: '/games/tic-tac-toe/classic',
            CLASSIC: '/games/tic-tac-toe/classic',
            ULTIMATE: '/games/tic-tac-toe/ultimate',
        },
    },
    SPOTIFY: {
        INDEX: '/',
        LOGIN: '/spotify/login',
    },
    USER: {
        PROFILE: '/user/profile',
        EDIT_PROFILE: '/user/profile/edit',
        SETTINGS: '/user/settings',
        LINKED_ACCOUNTS: '/user/linked-accounts',
    },
    DEV: '/dev',
    NOT_FOUND: '*',
} as const;

export const API_ROUTES = {
    AUTH_LINK_ACCOUNT: {
        ROOT: '/api/auth-link-account',
        SPOTIFY: {
            CALLBACK: '/api/auth-link-account/spotify/callback',
            ROOT: '/api/auth-link-account/spotify',
        },
        ANILIST: {
            CALLBACK: '/api/auth-link-account/anilist/callback',
            ROOT: '/api/auth-link-account/anilist',
        },
        MYANIMELIST: {
            CALLBACK: '/api/auth-link-account/myanimelist/callback',
            ROOT: '/api/auth-link-account/myanimelist',
        },
    },
} as const;

export const EXTERNAL_ROUTES = {
    ANILIST: {
        AUTH: 'https://anilist.co/api/v2/oauth/authorize',
        EXCHANGE_TOKEN: 'https://anilist.co/api/v2/oauth/token',
        GRAPHQL: 'https://graphql.anilist.co',
    },
    SPOTIFY: {
        AUTH: 'https://accounts.spotify.com/authorize',
        EXCHANGE_TOKEN: 'https://accounts.spotify.com/api/token',
        API: 'https://api.spotify.com/v1',
        USER_PROFILE: 'https://api.spotify.com/v1/me',
    },
} as const;

/**
 * Array of routes accessible without authentication.
 */
export const PUBLIC_ROUTES: string[] = [
    APP_ROUTES.INDEX,
    APP_ROUTES.DEV,
    APP_ROUTES.AUTH.VERIFY_EMAIL,
    APP_ROUTES.AUTH.FORGOT_PASSWORD,
    APP_ROUTES.AUTH.RESET_PASSWORD,
];

/**
 * Array of authentication-related routes.
 */
export const AUTH_ROUTES: string[] = [APP_ROUTES.AUTH.LOGIN, APP_ROUTES.AUTH.REGISTER, APP_ROUTES.AUTH.FORGOT_PASSWORD, APP_ROUTES.AUTH.ERROR];

/**
 * Prefix for API authentication routes.
 */
export const API_AUTH_PREFIX: string = '/api/auth';

/**
 * Default route for authentication.
 */
export const DEFAULT_AUTH_ROUTE: string = APP_ROUTES.AUTH.LOGIN;

/**
 * Default route for the dashboard.
 */
export const DEFAULT_AUTH_REDIRECT: string = APP_ROUTES.INDEX;
