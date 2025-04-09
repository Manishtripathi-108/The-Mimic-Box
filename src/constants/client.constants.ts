export const IMAGE_URL = {
    APP_LOGO: 'https://res.cloudinary.com/dra73suxl/image/upload/v1744229205/mimic_logo_tb4e9r.png',
    PROFILE: 'https://res.cloudinary.com/dra73suxl/image/upload/v1742410227/profile_nes8vp.png',
    BANNER: 'https://res.cloudinary.com/dra73suxl/image/upload/v1742811780/scene-night-tree_raa1zn.jpg',
    NO_DATA: 'https://res.cloudinary.com/dra73suxl/image/upload/v1742810700/nodata_vyixzn.png',
    AUDIO_COVER_FALLBACK: 'https://res.cloudinary.com/dra73suxl/image/upload/v1744229654/no_cover_image_fallback_jhsdj.png',
};

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const convertMonthNumberToName = (monthNumber: number) => {
    if (monthNumber >= 1 && monthNumber <= 12) {
        return MONTH_NAMES[monthNumber - 1];
    }
    return '...';
};

export const getPageNumbers = (currentPage: number, totalPages: number, maxVisibleBtns = 5) => {
    const start = Math.max(1, currentPage - Math.floor(maxVisibleBtns / 2));
    const end = Math.min(totalPages, start + maxVisibleBtns - 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

/* -------------------------------------------------------------------------- */
/*                                   Anilist                                  */
/* -------------------------------------------------------------------------- */
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
