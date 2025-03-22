/** 📌 Represents the type of media (Anime or Manga) */
export type AnilistMediaType = 'ANIME' | 'MANGA';

/** 📌 Represents the status of a media entry */
export type AnilistMediaStatus = 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED' | 'HIATUS';

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

/* ------------------------------- Client Side ------------------------------ */

/** 📌 Represents the tabs for media lists */
export type AnilistMediaTab = 'All' | AnilistMediaListStatus;

/** 📌 Represents the tabs for favourites */
export type AnilistFavouritesTab = 'All' | 'Anime' | 'Manga';

/** 📌 Represents media filtering options */
export type AnilistMediaFilters = {
    format: AnilistMediaFormat | null;
    status: AnilistMediaStatus | null;
    search: string;
    genres: string[] | null;
    year: number | null;
    sort: string | null;
};
