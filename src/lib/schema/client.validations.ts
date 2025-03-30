import { z } from 'zod';

import { ANILIST_GENRES } from '@/constants/client.constants';

export const AnilistMediaSeasonSchema = z.enum(['WINTER', 'SPRING', 'SUMMER', 'FALL']);
export const AnilistMediaStatusSchema = z.enum(['FINISHED', 'RELEASING', 'NOT_YET_RELEASED', 'CANCELLED', 'HIATUS']);
export const AnilistMediaListStatusSchema = z.enum(['COMPLETED', 'CURRENT', 'DROPPED', 'PAUSED', 'PLANNING', 'REPEATING']);
export const AnilistMediaFormatSchema = z.enum(['TV', 'TV_SHORT', 'MOVIE', 'SPECIAL', 'OVA', 'ONA', 'MUSIC', 'MANGA', 'NOVEL', 'ONE_SHOT']);
export const AnilistMediaSortOptionsSchema = z.enum(['Average Score', 'Popularity', 'Score', 'Title', 'Last Updated', 'Year']);

export const AnilistFilterSchema = z.object({
    search: z.string().nullable(),
    format: AnilistMediaFormatSchema.nullable(),
    status: AnilistMediaStatusSchema.nullable(),
    sort: AnilistMediaSortOptionsSchema,
    season: z.enum(['ALL', 'WINTER', 'SPRING', 'SUMMER', 'FALL']),
    year: z.union([z.number().min(1900).max(new Date().getFullYear()), z.nan()]).nullish(),
    genres: z
        .array(z.string())
        .refine((val) => val.every((g) => ANILIST_GENRES.includes(g)), {
            message: 'Invalid genre selected',
        })
        .nullable(),
});
