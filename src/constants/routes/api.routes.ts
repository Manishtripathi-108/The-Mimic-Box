export const API_AUTH_PREFIX = '/api/auth';

const API_ROUTES = {
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

export default API_ROUTES;
