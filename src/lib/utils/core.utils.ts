import { AnilistMediaType, AnilistQuery, AnilistSearchCategories } from '@/lib/types/anilist.types';

// This function returns the current season based on the current month.
export const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1;
    if (month <= 3) return 'WINTER';
    if (month <= 6) return 'SPRING';
    if (month <= 9) return 'SUMMER';
    return 'FALL';
};

// This function returns the next season based on the current month and year.
export const getNextSeason = (): { season: 'SPRING' | 'SUMMER' | 'FALL' | 'WINTER'; year: number } => {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    if (month <= 3) return { season: 'SPRING', year };
    if (month <= 6) return { season: 'SUMMER', year };
    if (month <= 9) return { season: 'FALL', year };
    return { season: 'WINTER', year: year + 1 };
};

export const getMediaSearchParams = (type: AnilistMediaType, category?: AnilistSearchCategories): AnilistQuery => {
    const { season, year } = getNextSeason();
    switch (category) {
        case 'trending':
            return { type, season: 'ALL', sort: 'TRENDING_DESC' };
        case 'this-season':
            return { type, season: getCurrentSeason(), year: new Date().getFullYear(), sort: 'POPULARITY_DESC' };
        case 'popular':
            return { type, season: 'ALL', sort: 'POPULARITY_DESC' };
        case 'next-season':
            return { type, season, year };
        default:
            return { type, season: 'ALL' };
    }
};

export const categoryTitle = (category?: AnilistSearchCategories) => {
    switch (category) {
        case 'trending':
            return 'TRENDING NOW';
        case 'this-season':
            return 'POPULAR THIS SEASON';
        case 'popular':
            return 'ALL TIME POPULAR';
        case 'next-season':
            return 'UPCOMING';
        default:
            return;
    }
};
