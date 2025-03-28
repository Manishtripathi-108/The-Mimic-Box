/** 📌 Represents the type of media (Anime or Manga) */
export type AnilistMediaType = 'ANIME' | 'MANGA';

/** 📌 Represents the season of a media entry */
export type AnilistMediaSeason = 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL';

/** 📌 Represents the status of a media entry */
export type AnilistMediaStatus = 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED' | 'HIATUS';

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

/** 📌 Represents the user’s list status for a media */
export type AnilistMediaListStatus = 'CURRENT' | 'PLANNING' | 'COMPLETED' | 'DROPPED' | 'PAUSED' | 'REPEATING';

/** 📌 Represents different media formats */
export type AnilistMediaFormat = 'TV' | 'TV_SHORT' | 'MOVIE' | 'SPECIAL' | 'OVA' | 'ONA' | 'MUSIC' | 'MANGA' | 'NOVEL' | 'ONE_SHOT';

/** 📌 Represents an Anilist user */
export type AnilistUser = { Viewer: { id: number; name: string; avatar: { large: string }; bannerImage: string } };

/** 📌 Represents a media entry (Anime/Manga) */
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

/** 📌 Represents an individual media list entry (e.g., from user's list) */
export type AnilistMediaEntry = {
    id: number;
    progress: number;
    status: string;
    updatedAt: number;
    createdAt: number;
    media: AnilistMedia;
};

/** 📌 Represents a user's media list collection */
export type AnilistMediaList = {
    name: string;
    status: AnilistMediaListStatus;
    entries: AnilistMediaEntry[];
};

/** 📌 Represents the media list collection */
export type AnilistMediaCollection = {
    MediaListCollection: {
        lists: AnilistMediaList[];
    };
};

/** 📌 Represents a user's favourite media */
export type AnilistFavourites = {
    anime?: {
        nodes: AnilistMedia[];
    };
    manga?: {
        nodes: AnilistMedia[];
    };
};

/** 📌 Represents a user's favourites collection */
export type AnilistUserFavourites = {
    User: {
        favourites: AnilistFavourites;
    };
};

/** 📌 Represents the response from saving a media list entry */
export type AnilistSaveMediaListEntry = {
    id: number;
    status: AnilistMediaListStatus;
    progress: number;
};

/** 📌 Represents the response of Anilist Ids of MalIds */
export type AnilistMediaIds = {
    Page: {
        media: {
            id: number;
            idMal: number;
        }[];
    };
};

export type AnilistQuery = {
    type: AnilistMediaType;
    format?: AnilistMediaFormat;
    season?: AnilistMediaSeason;
    sort?: AnilistMediaSort;
    status?: AnilistMediaStatus;
    search?: string | null;
    genres?: string[] | null;
    seasonYear?: number | null;
    page?: number;
    perPage?: number;
};

/* ------------------------------- Client Side ------------------------------ */

/** 📌 Represents the tabs for media lists */
export type AnilistMediaTab = 'All' | AnilistMediaListStatus;

/** 📌 Represents the tabs for favourites */
export type AnilistFavouritesTab = 'All' | 'Anime' | 'Manga';

/** 📌 Represents media filtering options */
export type AnilistMediaFilters = {
    format: AnilistMediaFormat | null;
    status: AnilistMediaStatus | null;
    season: AnilistMediaSeason | null;
    search: string;
    genres: string[] | null;
    year: number | null;
    sort: string | null;
};
