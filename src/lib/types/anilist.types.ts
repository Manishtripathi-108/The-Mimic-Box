import { z } from 'zod';



import { AnilistFilterSchema, AnilistMediaFormatSchema, AnilistMediaListStatusSchema, AnilistMediaSeasonSchema, AnilistMediaStatusSchema } from '@/lib/schema/client.validations';





/* ----------------------------- Core Types ----------------------------- */

export type AnilistMediaType = 'ANIME' | 'MANGA';
export type AnilistMediaSeason = z.infer<typeof AnilistMediaSeasonSchema>;
export type AnilistMediaStatus = z.infer<typeof AnilistMediaStatusSchema>;
export type AnilistMediaFormat = z.infer<typeof AnilistMediaFormatSchema>;
export type AnilistMediaListStatus = z.infer<typeof AnilistMediaListStatusSchema>;
export type AnilistSelectedTabType = 'ALL' | AnilistMediaListStatus | AnilistMediaType;

export type AnilistMediaSort =
    | 'ID'
    | 'ID_DESC'
    | 'TITLE_ROMAJI'
    | 'TITLE_ROMAJI_DESC'
    | 'TITLE_ENGLISH'
    | 'TITLE_ENGLISH_DESC'
    | 'TITLE_NATIVE'
    | 'TITLE_NATIVE_DESC'
    | 'TYPE'
    | 'TYPE_DESC'
    | 'FORMAT'
    | 'FORMAT_DESC'
    | 'START_DATE'
    | 'START_DATE_DESC'
    | 'END_DATE'
    | 'END_DATE_DESC'
    | 'SCORE'
    | 'SCORE_DESC'
    | 'POPULARITY'
    | 'POPULARITY_DESC'
    | 'TRENDING'
    | 'TRENDING_DESC'
    | 'EPISODES'
    | 'EPISODES_DESC'
    | 'DURATION'
    | 'DURATION_DESC'
    | 'STATUS'
    | 'STATUS_DESC'
    | 'CHAPTERS'
    | 'CHAPTERS_DESC'
    | 'VOLUMES'
    | 'VOLUMES_DESC'
    | 'UPDATED_AT'
    | 'UPDATED_AT_DESC'
    | 'SEARCH_MATCH'
    | 'FAVOURITES'
    | 'FAVOURITES_DESC';

/* ------------------------- Data Representation ------------------------- */

export type AnilistUser = { Viewer: { id: number; name: string; avatar: { large: string }; bannerImage: string } };

export type AnilistMedia = {
    id: number;
    type: AnilistMediaType;
    format: AnilistMediaFormat;
    status: AnilistMediaStatus;
    season: AnilistMediaSeason;
    description: string;
    duration: number | null;
    chapters: number | null;
    episodes: number | null;
    genres: string[];
    averageScore: number;
    popularity: number;
    favourites: number;
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

export type AnilistMediaEntry = {
    id: number;
    progress: number;
    status: AnilistMediaListStatus;
    updatedAt: number;
    createdAt: number;
    media: AnilistMedia;
};

export type AnilistMediaList = {
    name: string;
    status: AnilistMediaListStatus;
    entries: AnilistMediaEntry[];
};

export type AnilistMediaCollection = {
    MediaListCollection: {
        lists: AnilistMediaList[];
    };
};

export type AnilistFavourites = {
    anime?: {
        nodes: AnilistMedia[];
    };
    manga?: {
        nodes: AnilistMedia[];
    };
};

export type AnilistUserFavourites = {
    User: {
        favourites: AnilistFavourites;
    };
};

export type AnilistSaveMediaListEntry = {
    id: number;
    status: AnilistMediaListStatus;
    progress: number;
};

// Represents the response of Anilist Ids of MalIds
export type AnilistMediaIds = {
    Page: {
        media: {
            id: number;
            idMal: number;
        }[];
    };
};

export type AnilistMediaFilters = z.infer<typeof AnilistFilterSchema>;

export type AnilistQuery = {
    type: AnilistMediaType;
    sort?: AnilistMediaSort;
    page?: number;
    perPage?: number;
} & Omit<z.infer<typeof AnilistFilterSchema>, 'sort'>;