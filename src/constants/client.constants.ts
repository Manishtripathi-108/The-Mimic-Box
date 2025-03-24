import { AnilistFavouritesTab, AnilistMediaListStatus, AnilistMediaTab } from '@/lib/types/anilist.types';

export const IMAGE_URL = {
    PROFILE: 'https://res.cloudinary.com/dra73suxl/image/upload/v1742410227/profile_nes8vp.png',
    BANNER: 'https://res.cloudinary.com/dra73suxl/image/upload/v1742811780/scene-night-tree_raa1zn.jpg',
    NO_DATA: 'https://res.cloudinary.com/dra73suxl/image/upload/v1742810700/nodata_vyixzn.png',
};

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const convertMonthNumberToName = (monthNumber: number) => {
    if (monthNumber >= 1 && monthNumber <= 12) {
        return MONTH_NAMES[monthNumber - 1];
    }
    return '...';
};

/* -------------------------------------------------------------------------- */
/*                                   Anilist                                  */
/* -------------------------------------------------------------------------- */
//! Do not change Any of the following constants
export const ANILIST_SORT_OPTIONS = ['Average Score', 'Popularity', 'Score', 'Title', 'Last Updated'];
export const ANILIST_GENRES = [
    'Action',
    'Adventure',
    'Comedy',
    'Drama',
    'Ecchi',
    'Fantasy',
    'Horror',
    'Mahou Shoujo',
    'Mecha',
    'Music',
    'Mystery',
    'Psychological',
    'Romance',
    'Slice of Life',
    'Sports',
    'Supernatural',
    'Thriller',
];
export const ANILIST_MEDIA_FORMATS = ['Tv', 'Tv Short', 'Movie', 'Special', 'Ova', 'Ona', 'Music', 'Manga', 'Novel', 'One Shot'];
export const ANILIST_MEDIA_STATUSES = ['Finished', 'Releasing', 'Not yet Released', 'Cancelled', 'Hiatus'];
export const ANILIST_VALID_STATUSES: AnilistMediaListStatus[] = ['COMPLETED', 'CURRENT', 'DROPPED', 'PAUSED', 'PLANNING', 'REPEATING'];
export const ANILIST_MEDIA_TAB: AnilistMediaTab[] = ['All', ...ANILIST_VALID_STATUSES];
export const ANILIST_FAVOURITE_TAB: AnilistFavouritesTab[] = ['All', 'Anime', 'Manga'];
