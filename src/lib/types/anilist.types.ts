export type AnilistUserType = {
    Viewer: {
        id: number;
        name: string;
        avatar: { large: string };
        bannerImage: string;
    };
};

export type AnilistMediaType = 'ANIME' | 'MANGA';

export type AnilistMediaListStatus = 'CURRENT' | 'PLANNING' | 'COMPLETED' | 'DROPPED' | 'PAUSED' | 'REPEATING';

export type AnilistMediaFormat = 'TV' | 'TV_SHORT' | 'MOVIE' | 'SPECIAL' | 'OVA' | 'ONA' | 'MUSIC' | 'MANGA' | 'NOVEL' | 'ONE_SHOT';

export type AnilistMedia = {
    id: number;
    type: string;
    format: AnilistMediaFormat;
    status: string;
    description: string;
    duration: number | null;
    chapters: number | null;
    episodes: number | null;
    genres: string[];
    averageScore: number;
    popularity: number;
    isFavourite: boolean;
    bannerImage: string;
    coverImage: { large: string };
    title: {
        romaji: string;
        english: string;
        native: string;
        userPreferred: string;
    };
    startDate: {
        day: number;
        month: number;
        year: number;
    };
};

export type AnilistMediaCollection = {
    MediaListCollection: {
        lists: {
            name: string;
            status: AnilistMediaListStatus;
            entries: {
                id: number;
                progress: number;
                status: string;
                updatedAt: number;
                createdAt: number;
                media: AnilistMedia;
            }[];
        }[];
    };
};

export type AnilistFavorites = {
    User: {
        favourites: {
            anime?: {
                nodes: AnilistMedia[];
            };
            manga?: {
                nodes: AnilistMedia[];
            };
        };
    };
};
