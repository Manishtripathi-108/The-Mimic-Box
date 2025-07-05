import { AnilistMediaType, AnilistQuery, AnilistSearchCategories } from '@/lib/types/anilist.types';

/**
 * Sleeps for a specified number of milliseconds.
 *
 * @param ms - The number of milliseconds to sleep.
 * @returns A promise that resolves after the specified time.
 */
export function sleep(ms: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/**
 * Determines the current season based on the current month.
 */
export function getCurrentSeason(): 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL' {
    const month = new Date().getMonth() + 1;

    if (month <= 3) return 'WINTER';
    if (month <= 6) return 'SPRING';
    if (month <= 9) return 'SUMMER';
    return 'FALL';
}

/**
 * Determines the next season and corresponding year based on the current month.
 */
export function getNextSeasonAndYear(): { season: 'SPRING' | 'SUMMER' | 'FALL' | 'WINTER'; year: number } {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    if (month <= 3) return { season: 'SPRING', year };
    if (month <= 6) return { season: 'SUMMER', year };
    if (month <= 9) return { season: 'FALL', year };

    return { season: 'WINTER', year: year + 1 };
}

/**
 * Generates search parameters for querying media based on type and category.
 */
export function buildMediaSearchParams(mediaType: AnilistMediaType, category?: AnilistSearchCategories): AnilistQuery {
    const { season, year } = getNextSeasonAndYear();

    switch (category) {
        case 'trending':
            return { type: mediaType, season: 'ALL', sort: 'TRENDING_DESC' };
        case 'this-season':
            return { type: mediaType, season: getCurrentSeason(), year: new Date().getFullYear(), sort: 'POPULARITY_DESC' };
        case 'popular':
            return { type: mediaType, season: 'ALL', sort: 'POPULARITY_DESC' };
        case 'next-season':
            return { type: mediaType, season, year };
        default:
            return { type: mediaType, season: 'ALL' };
    }
}

/**
 * Maps a search category to a human-readable title.
 */
export function getCategoryDisplayTitle(category?: AnilistSearchCategories): string | undefined {
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
            return undefined;
    }
}

/**
 * Decomposes time in milliseconds into days, hours, minutes, and seconds.
 */
function decomposeTime(milliseconds: number) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds };
}

/**
 * Formats a duration into a human-readable string (e.g., "1d 2h 30min 5s").
 */
export function formatDurationInReadableFormat(milliseconds: number): string {
    if (milliseconds < 1000) return 'Less than 1s';

    const { days, hours, minutes, seconds } = decomposeTime(milliseconds);

    const durationParts: string[] = [];
    if (days) durationParts.push(`${days}d`);
    if (hours) durationParts.push(`${hours}h`);
    if (minutes) durationParts.push(`${minutes}min`);
    if (seconds) durationParts.push(`${seconds}s`);

    return durationParts.join(' ') || '0s';
}

/**
 * Formats time into a customizable format based on precision.
 * Precision options: 'seconds', 'minutes', 'hours', 'full' (including days, hours, minutes, seconds).
 */ export function formatTimeDuration(milliseconds: number, precision: 'seconds' | 'minutes' | 'hours' | 'full' = 'hours'): string {
    const { days, hours, minutes, seconds } = decomposeTime(milliseconds);

    const pad = (n: number) => n.toString().padStart(2, '0');

    if (precision === 'seconds') return pad(seconds);
    if (precision === 'minutes') return `${pad(minutes)}:${pad(seconds)}`;

    const time = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

    if (precision === 'full') return days > 0 ? `${days}:${time}` : time;

    return time;
}

/**
 * Chunks an array into multiple batches of a given size.
 *
 * @example
 * chunkArray([1, 2, 3, 4, 5], 2)
 * // [[1, 2], [3, 4], [5]]
 *
 * @param array The array to chunk
 * @param batchSize The size of each chunk
 * @returns An array of arrays, each containing batchSize elements
 */
export function chunkArray<T>(array: T[], batchSize: number): T[][] {
    if (batchSize <= 0) {
        throw new Error('batchSize must be a positive number');
    }
    const batches: T[][] = [];
    for (let i = 0; i < array.length; i += batchSize) {
        batches.push(array.slice(i, i + batchSize));
    }
    return batches;
}

export const isBrowser = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

export const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
