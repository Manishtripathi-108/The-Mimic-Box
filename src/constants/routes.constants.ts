export const APP_ROUTES = {
    INDEX: '/',
    SHADOWS: '/shadows',
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
    NOT_FOUND: '*',
};
