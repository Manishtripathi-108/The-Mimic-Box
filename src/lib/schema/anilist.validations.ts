import { z } from 'zod';

import { ANILIST_GENRES } from '@/constants/client.constants';

export const AnilistMediaSeasonSchema = z.enum(['WINTER', 'SPRING', 'SUMMER', 'FALL']);
export const AnilistMediaStatusSchema = z.enum(['FINISHED', 'RELEASING', 'NOT_YET_RELEASED', 'CANCELLED', 'HIATUS']);
export const AnilistMediaListStatusSchema = z.enum(['COMPLETED', 'CURRENT', 'DROPPED', 'PAUSED', 'PLANNING', 'REPEATING']);
export const AnilistMediaFormatSchema = z.enum(['TV', 'TV_SHORT', 'MOVIE', 'SPECIAL', 'OVA', 'ONA', 'MUSIC', 'MANGA', 'NOVEL', 'ONE_SHOT']);
export const AnilistMediaSortOptionsSchema = z.enum(['Last Updated', 'Average Score', 'Popularity', 'Score', 'Title', 'Year']);

const CURRENT_YEAR = new Date().getFullYear();

export const AnilistFilterSchema = z.object({
    search: z.string().optional(),
    format: AnilistMediaFormatSchema.optional(),
    status: AnilistMediaStatusSchema.optional(),
    sort: AnilistMediaSortOptionsSchema,
    season: z.enum(['ALL', 'WINTER', 'SPRING', 'SUMMER', 'FALL']),
    year: z
        .preprocess(
            (v) => {
                if (v == null) return undefined;
                if (typeof v === 'string' && v.trim() === '') return undefined;
                return v;
            },
            z
                .number({ message: 'Invalid year' })
                .int()
                .min(1900, { message: 'Invalid year! Year must be between 1900 and current year' })
                .max(CURRENT_YEAR)
                .optional()
        )
        .optional(),

    genres: z
        .array(z.string())
        .refine((val) => val.every((g) => ANILIST_GENRES.includes(g)), {
            error: 'Invalid genre selected',
        })
        .transform((val) => ((val ?? []).length > 0 ? val : undefined))
        .optional(),
});
