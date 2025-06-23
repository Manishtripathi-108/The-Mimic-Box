import { LinkedAccountProvider } from '@prisma/client';

import { AnilistSearchCategories } from '@/lib/types/anilist.types';
import { ErrorCodes } from '@/lib/types/response.types';

/* -------------------------------------------------------------------------- */
/*                                 App Routes                                 */
/* -------------------------------------------------------------------------- */

export const APP_ROUTES = {
    ROOT: '/',
    REDIRECT: '/redirect',
    DEV: '/dev',
    NOT_FOUND: '*',

    AUTH: {
        CHANGE_EMAIL: '/auth/change-email',
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        VERIFY_EMAIL: '/auth/verify-email',
        ERROR: '/auth/error',
        LINK_ACCOUNT_ERROR: (provider?: LinkedAccountProvider, errorCode?: ErrorCodes, errorDescription?: string): string => {
            const basePath = '/auth/link-account-error';
            const urlParams = new URLSearchParams();

            if (errorDescription) {
                urlParams.set('error_description', errorDescription);
            }

            if (errorCode) {
                urlParams.set('error', errorCode);
            }

            if (provider) {
                urlParams.set('linkAccountType', provider);
            }

            return `${basePath}?${urlParams.toString()}`;
        },
    },

    AUDIO: {
        TAGS_EDITOR: '/audio/tags-editor',
        CONVERTER: '/audio/converter',
        SEARCH_LYRICS: '/audio/search-lyrics',
    },

    ANILIST: {
        INDEX: '/anilist',
        USER: {
            ANIME: '/anilist/user/anime',
            MANGA: '/anilist/user/manga',
            FAVOURITES: '/anilist/user/favourites',
        },
        SEARCH: (type: 'anime' | 'manga', category?: AnilistSearchCategories) => `/anilist/search/${type}${category ? `/${category}` : ''}`,
        MEDIA_DETAIL: (type: 'anime' | 'manga', id: number) => `/anilist/${type}/${id}`,
    },

    GAMES: {
        TIC_TAC_TOE: {
            INDEX: '/games/tic-tac-toe',
            CLASSIC: '/games/tic-tac-toe/classic',
            ULTIMATE: '/games/tic-tac-toe/ultimate',
            ONLINE: '/games/tic-tac-toe/online',
            ONLINE_MODE: (mode: 'classic' | 'ultimate' | 'waiting-room') => `/games/tic-tac-toe/online/${mode}`,
        },
    },

    IMPORT_ANIME_MANGA: '/import/anime-manga',

    MUSIC: {
        DASHBOARD: '/music/dashboard',
        SEARCH: (query: string = ''): string => {
            const trimmedQuery = query.trim();
            return `/music/search?q=${encodeURIComponent(trimmedQuery)}`;
        },
        PLAYLISTS: '/music/playlists',
        PLAYLIST: (id: string) => `/music/playlists/${id}`,
        ALBUMS: (id: string) => `/music/albums/${id}`,
        TRACKS: (id: string) => `/music/tracks/${id}`,
        ARTISTS: (id: string) => `/music/artists/${id}`,
        JS: {
            TRACKS: (id: string) => `/music/js/tracks/${id}`,
            ARTISTS: (id: string) => `/music/js/artists/${id}`,
            ALBUMS: (id: string) => `/music/js/albums/${id}`,
            PLAYLISTS: (id: string) => `/music/js/playlists/${id}`,
        },
    },

    USER: {
        PROFILE: '/user/profile',
        EDIT_PROFILE: '/user/profile/edit',
        SETTINGS: '/user/settings',
        LINKED_ACCOUNTS: '/user/linked-accounts',
    },
} as const;

/* -------------------------------------------------------------------------- */
/*                                API Routes Enum                             */
/* -------------------------------------------------------------------------- */

export const API_ROUTES = {
    /* ---------------------------- Auth Link Account --------------------------- */
    AUTH_LA_ROOT: '/api/auth-link-account',

    /* ------------------------- Spotify Authentication ------------------------- */
    AUTH_LA_SPOTIFY_ROOT: '/api/auth-link-account/spotify',
    AUTH_LA_SPOTIFY_CALLBACK: '/api/auth-link-account/spotify/callback',

    /* ------------------------- AniList Authentication ------------------------- */
    AUTH_LA_ANILIST_ROOT: '/api/auth-link-account/anilist',
    AUTH_LA_ANILIST_CALLBACK: '/api/auth-link-account/anilist/callback',

    /* ----------------------- MyAnimeList Authentication ----------------------- */
    AUTH_LA_MYANIMELIST_ROOT: '/api/auth-link-account/myanimelist',
    AUTH_LA_MYANIMELIST_CALLBACK: '/api/auth-link-account/myanimelist/callback',

    LYRICS: {
        SEARCH: '/api/lyrics/search',
        GET: '/api/lyrics/get',
        ID: (id: string) => `/api/lyrics/get/${id}`,
    },

    ITUNES: {
        SEARCH: {
            TRACKS: '/api/itunes/search/tracks',
            ALBUMS: '/api/itunes/search/albums',
            ARTISTS: '/api/itunes/search/artists',
        },
        LOOKUP: {
            TRACKS: (id: string) => `/api/itunes/lookup/tracks/${id}`,
            ALBUMS: (id: string) => `/api/itunes/lookup/albums/${id}`,
            ALBUM_TRACKS: (id: string) => `${API_ROUTES.ITUNES.LOOKUP.ALBUMS(id)}/tracks`,
            ARTISTS: '/api/itunes/lookup/artists',
        },
    },
} as const;

/* -------------------------------------------------------------------------- */
/*                                External Routes                             */
/* -------------------------------------------------------------------------- */

const withIds = (base: string, ids?: string | string[]) => {
    if (!ids) return base;
    return typeof ids === 'string' ? `${base}/${ids}` : `${base}?ids=${ids.join(',')}`;
};

const AUDIO_BASE = process.env.NEXT_PUBLIC_EXTERNAL_AUDIO_BASE_URL;

export const EXTERNAL_ROUTES = {
    ANILIST: {
        BASE: 'https://anilist.co/api/v2',
        AUTH: 'https://anilist.co/api/v2/oauth/authorize',
        EXCHANGE_TOKEN: 'https://anilist.co/api/v2/oauth/token',
        GRAPHQL: 'https://graphql.anilist.co',
    },

    SAAVN: {
        BASE: 'https://www.jiosaavn.com/api.php',
        SEARCH: {
            ALL: 'autocomplete.get',
            SONGS: 'search.getResults',
            ALBUMS: 'search.getAlbumResults',
            ARTISTS: 'search.getArtistResults',
            PLAYLISTS: 'search.getPlaylistResults',
        },
        SONG: {
            ID: 'song.getDetails',
            LINK: 'webapi.get',
            SUGGESTIONS: 'webradio.getSong',
            LYRICS: 'lyrics.getLyrics',
            STATION: 'webradio.createEntityStation',
        },
        ALBUM: {
            DETAILS: 'content.getAlbumDetails',
            LINK: 'webapi.get',
        },
        ARTIST: {
            DETAILS: 'artist.getArtistPageDetails',
            LINK: 'webapi.get',
            SONGS: 'artist.getArtistMoreSong',
            ALBUMS: 'artist.getArtistMoreAlbum',
        },
        PLAYLIST: {
            DETAILS: 'playlist.getDetails',
            LINK: 'webapi.get',
        },
        BROWSE: {
            MODULES: 'content.getBrowseModules',
            TRENDING: 'content.getTrending',
        },
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
            TOP_ARTISTS: '/me/top/artists',
            TOP_TRACKS: '/me/top/tracks',
            RECENTLY_PLAYED: '/me/player/recently-played',
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
        GET: 'https://lrclib.net/api/get',
        SEARCH: 'https://lrclib.net/api/search',
    },

    ITUNES: {
        BASE: 'https://itunes.apple.com',
        SEARCH: '/search',
        LOOKUP: '/lookup',
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
    APP_ROUTES.ROOT,
    APP_ROUTES.DEV,
    APP_ROUTES.AUTH.VERIFY_EMAIL,
    APP_ROUTES.AUTH.FORGOT_PASSWORD,
    APP_ROUTES.AUTH.RESET_PASSWORD,
    APP_ROUTES.AUTH.LINK_ACCOUNT_ERROR(),
    APP_ROUTES.GAMES.TIC_TAC_TOE.INDEX,
    APP_ROUTES.GAMES.TIC_TAC_TOE.CLASSIC,
    APP_ROUTES.GAMES.TIC_TAC_TOE.ULTIMATE,
    '/download/ffmpeg-core.js',
    '/download/ffmpeg-core.wasm',
    '/download/ffmpeg-core.worker.js',
];

export const AUTH_ROUTES: string[] = [APP_ROUTES.AUTH.LOGIN, APP_ROUTES.AUTH.REGISTER, APP_ROUTES.AUTH.FORGOT_PASSWORD, APP_ROUTES.AUTH.ERROR];

export const API_AUTH_PREFIX = '/api/auth';
export const DEFAULT_AUTH_ROUTE = APP_ROUTES.AUTH.LOGIN;
export const DEFAULT_AUTH_REDIRECT = APP_ROUTES.ROOT;
