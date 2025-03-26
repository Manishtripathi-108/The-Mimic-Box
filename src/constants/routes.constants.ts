export const APP_ROUTES = {
    // General Routes
    INDEX: '/',
    REDIRECT: '/redirect',
    DEV: '/dev',
    NOT_FOUND: '*',

    // Authentication Routes
    AUTH_CHANGE_EMAIL: '/auth/change-email',
    AUTH_LOGIN: '/auth/login',
    AUTH_REGISTER: '/auth/register',
    AUTH_FORGOT_PASSWORD: '/auth/forgot-password',
    AUTH_RESET_PASSWORD: '/auth/reset-password',
    AUTH_VERIFY_EMAIL: '/auth/verify-email',
    AUTH_ERROR: '/auth/error',

    // Audio Routes
    AUDIO_TAGS_EDITOR: '/audio/tags-editor',
    AUDIO_CONVERTER: '/audio/converter',

    // AniList Routes
    ANILIST_INDEX: '/anilist',
    ANILIST_ANIME: '/anilist/anime',
    ANILIST_MANGA: '/anilist/manga',
    ANILIST_FAVOURITES: '/anilist/favourites',
    ANILIST_LOGIN: '/anilist/login',

    // Games Routes
    GAMES_TIC_TAC_TOE_INDEX: '/games/tic-tac-toe',
    GAMES_TIC_TAC_TOE_CLASSIC: '/games/tic-tac-toe/classic',
    GAMES_TIC_TAC_TOE_ULTIMATE: '/games/tic-tac-toe/ultimate',
    GAMES_TIC_TAC_TOE_ONLINE: '/games/tic-tac-toe/online',
    GAMES_TIC_TAC_TOE_ONLINE_ROOM: (roomId: string) => `/games/tic-tac-toe/online/${roomId}`,

    // Import Routes
    IMPORT_ANIME_MANGA: '/import/anime-manga',

    // User Routes
    USER_PROFILE: '/user/profile',
    USER_EDIT_PROFILE: '/user/profile/edit',
    USER_SETTINGS: '/user/settings',
    USER_LINKED_ACCOUNTS: '/user/linked-accounts',
} as const;

export enum API_ROUTES {
    /* ---------------------------- Auth Link Account --------------------------- */
    AUTH_LA_ROOT = '/api/auth-link-account',

    // Spotify Authentication
    AUTH_LA_SPOTIFY_ROOT = '/api/auth-link-account/spotify',
    AUTH_LA_SPOTIFY_CALLBACK = '/api/auth-link-account/spotify/callback',

    // AniList Authentication
    AUTH_LA_ANILIST_ROOT = '/api/auth-link-account/anilist',
    AUTH_LA_ANILIST_CALLBACK = '/api/auth-link-account/anilist/callback',

    // MyAnimeList Authentication
    AUTH_LA_MYANIMELIST_ROOT = '/api/auth-link-account/myanimelist',
    AUTH_LA_MYANIMELIST_CALLBACK = '/api/auth-link-account/myanimelist/callback',
}

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
    APP_ROUTES.AUTH_VERIFY_EMAIL,
    APP_ROUTES.AUTH_FORGOT_PASSWORD,
    APP_ROUTES.AUTH_RESET_PASSWORD,
];

/**
 * Array of authentication-related routes.
 */
export const AUTH_ROUTES: string[] = [APP_ROUTES.AUTH_LOGIN, APP_ROUTES.AUTH_REGISTER, APP_ROUTES.AUTH_FORGOT_PASSWORD, APP_ROUTES.AUTH_ERROR];

/**
 * Prefix for API authentication routes.
 */
export const API_AUTH_PREFIX: string = '/api/auth';

/**
 * Default route for authentication.
 */
export const DEFAULT_AUTH_ROUTE: string = APP_ROUTES.AUTH_LOGIN;

/**
 * Default route for the dashboard.
 */
export const DEFAULT_AUTH_REDIRECT: string = APP_ROUTES.INDEX;
