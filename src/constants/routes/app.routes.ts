import { LinkedAccountProvider } from '@prisma/client';

import { AnilistSearchCategories } from '@/lib/types/anilist.types';
import { T_ErrorCode } from '@/lib/types/response.types';

const APP_ROUTES = {
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
        LINK_ACCOUNT_ERROR: (provider?: LinkedAccountProvider, errorCode?: T_ErrorCode, errorDescription?: string): string => {
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
        ROOT: '/anilist',
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
            ROOT: '/games/tic-tac-toe',
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

    TUNE_SYNC: {
        ROOT: '/tune-sync',
        REMOVE_DUPLICATES: {
            ROOT: '/tune-sync/remove-duplicates',
            SPOTIFY: '/tune-sync/remove-duplicates/spotify/',
            SPOTIFY_PLAYLIST: (id: string) => `/tune-sync/remove-duplicates/spotify/playlists/${id}`,
            SAAVN: '/tune-sync/remove-duplicates/saavn/',
            ITUNES: '/tune-sync/remove-duplicates/itunes/',
        },
    },

    USER: {
        PROFILE: '/user/profile',
        EDIT_PROFILE: '/user/profile/edit',
        SETTINGS: '/user/settings',
        LINKED_ACCOUNTS: '/user/linked-accounts',
    },
} as const;

export default APP_ROUTES;
