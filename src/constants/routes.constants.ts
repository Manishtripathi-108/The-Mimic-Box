import { AnilistSearchCategories } from '@/lib/types/anilist.types';

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
    AUDIO_SEARCH_LYRICS: '/audio/search-lyrics',

    // AniList Routes
    ANILIST_INDEX: '/anilist',
    ANILIST_ANIME: '/anilist/user/anime',
    ANILIST_MANGA: '/anilist/user/manga',
    ANILIST_FAVOURITES: '/anilist/user/favourites',
    ANILIST_SEARCH: (type: 'anime' | 'manga', category?: AnilistSearchCategories) => `/anilist/search/${type}${category ? `/${category}` : ''}`,
    ANILIST_MEDIA_DETAIL: (type: 'anime' | 'manga', id: number) => `/anilist/${type}/${id}`,

    // Games Routes
    GAMES_TIC_TAC_TOE_INDEX: '/games/tic-tac-toe',
    GAMES_TIC_TAC_TOE_CLASSIC: '/games/tic-tac-toe/classic',
    GAMES_TIC_TAC_TOE_ULTIMATE: '/games/tic-tac-toe/ultimate',
    GAMES_TIC_TAC_TOE_ONLINE: '/games/tic-tac-toe/online',
    GAMES_TIC_TAC_TOE_ONLINE_MODE: (mode: 'classic' | 'ultimate' | 'waiting-room') => `/games/tic-tac-toe/online/${mode}`,

    // Import Routes
    IMPORT_ANIME_MANGA: '/import/anime-manga',

    // Spotify Routes
    SPOTIFY_DASHBOARD: '/spotify/dashboard',
    SPOTIFY_SEARCH: '/spotify/search',
    SPOTIFY_PLAYLISTS: '/spotify/playlists',
    SPOTIFY_PLAYLIST: (id: string) => `/spotify/playlists/${id}`,
    SPOTIFY_ALBUMS: (id: string) => `/spotify/albums/${id}`,
    SPOTIFY_TRACKS: (id: string) => `/spotify/tracks/${id}`,
    SPOTIFY_ARTISTS: (id: string) => `/spotify/artists/${id}`,

    // User Routes
    USER_PROFILE: '/user/profile',
    USER_EDIT_PROFILE: '/user/profile/edit',
    USER_SETTINGS: '/user/settings',
    USER_LINKED_ACCOUNTS: '/user/linked-accounts',
} as const;

export enum API_ROUTES {
    /* ---------------------------- Auth Link Account --------------------------- */
    AUTH_LA_ROOT = '/api/auth-link-account',

    /* ------------------------- Spotify Authentication ------------------------- */
    AUTH_LA_SPOTIFY_ROOT = '/api/auth-link-account/spotify',
    AUTH_LA_SPOTIFY_CALLBACK = '/api/auth-link-account/spotify/callback',

    /* ------------------------- AniList Authentication ------------------------- */
    AUTH_LA_ANILIST_ROOT = '/api/auth-link-account/anilist',
    AUTH_LA_ANILIST_CALLBACK = '/api/auth-link-account/anilist/callback',

    /* ----------------------- MyAnimeList Authentication ----------------------- */
    AUTH_LA_MYANIMELIST_ROOT = '/api/auth-link-account/myanimelist',
    AUTH_LA_MYANIMELIST_CALLBACK = '/api/auth-link-account/myanimelist/callback',
}

const withIds = (base: string, ids?: string | string[]) => {
    if (!ids) return base;

    if (typeof ids === 'string') return `${base}/${ids}`;
    if (Array.isArray(ids)) return `${base}?ids=${ids.join(',')}`;

    return base;
};

const AUDIO_BASE = process.env.NODE_ENV === 'development' ? 'http://localhost:4000/api/audio' : 'https://elephoria.onrender.com/api/audio';
export const EXTERNAL_ROUTES = {
    ANILIST: {
        BASE: 'https://anilist.co/api/v2',
        AUTH: 'https://anilist.co/api/v2/oauth/authorize',
        EXCHANGE_TOKEN: 'https://anilist.co/api/v2/oauth/token',
        GRAPHQL: 'https://graphql.anilist.co',
    },
    SPOTIFY: {
        BASE: 'https://api.spotify.com/v1',
        AUTH: 'https://accounts.spotify.com/authorize',
        EXCHANGE_TOKEN: 'https://accounts.spotify.com/api/token',
        SEARCH: '/search',
        ALBUM: (ids?: string | string[]) => withIds('/albums', ids),
        ARTIST: (ids?: string | string[]) => withIds('/artists', ids),
        ALBUM_TRACKS: (id: string) => `/albums/${id}/tracks`,
        ARTIST_TRACKS: (id: string) => `/artists/${id}/top-tracks`,
        ARTIST_ALBUMS: (id: string) => `/artists/${id}/albums`,
        PLAYLISTS: (id?: string) => `/playlists/${id}`,
        PLAYLIST_TRACKS: (id: string) => `/playlists/${id}/tracks`,
        TRACKS: (ids?: string | string[]) => withIds('/tracks', ids),
        USERS_PROFILE: (id?: string) => `/users/${id}`,
        USER: {
            PROFILE: '/me',
            PLAYLISTS: '/me/playlists',
            CREATE_PLAYLIST: (userId: string) => `/users/${userId}/playlists`,
            FOLLOWING: '/me/following',
            ARTISTS: '/me/top/artists',
            RECENTLY_PLAYED: '/me/player/recently-played',
            TOP_TRACKS: '/me/top/tracks',
            TOP_ARTISTS: '/me/top/artists',
            CHECK_SAVED_TRACK: (ids?: string | string[]) => withIds('/me/tracks/contains', ids),
        },
    },
    AUDIO: {
        CONVERTER: `${AUDIO_BASE}/convert-audio`,
        EXTRACT_METADATA: `${AUDIO_BASE}/extract-metadata`,
        EDIT_META_TAGS: `${AUDIO_BASE}/edit-metadata`,
    },
    LRCLIB: {
        BASE: 'https://lrclib.net',
        GET_LYRICS: 'https://lrclib.net/api/get',
        SEARCH_LYRICS: 'https://lrclib.net/api/search',
    },
} as const;

/* -------------------------------------------------------------------------- */
/*                                   Configs                                  */
/* -------------------------------------------------------------------------- */

/**
 * PUBLIC_ROUTES is an array of route paths that are accessible without requiring user authentication.
    APP_ROUTES.INDEX,
 * Additionally, it includes paths for sitemap and robots.txt files for SEO purposes.
 */
export const PUBLIC_ROUTES: string[] = [
    /* ------------------------------ General Routes ----------------------------- */
    APP_ROUTES.INDEX,
    APP_ROUTES.DEV,

    /* ------------------------------ Authentication Routes ---------------------- */
    APP_ROUTES.AUTH_VERIFY_EMAIL,
    APP_ROUTES.AUTH_FORGOT_PASSWORD,
    APP_ROUTES.AUTH_RESET_PASSWORD,

    /* ------------------------------ Games Routes ------------------------------ */
    APP_ROUTES.GAMES_TIC_TAC_TOE_INDEX,
    APP_ROUTES.GAMES_TIC_TAC_TOE_CLASSIC,
    APP_ROUTES.GAMES_TIC_TAC_TOE_ULTIMATE,

    /* -------------------------- Sitemap & Robots.txt -------------------------- */
    '/sitemap.xml',
    '/robots.txt',
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
