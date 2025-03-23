import { z } from 'zod';

import { ANILIST_GENRES, ANILIST_MEDIA_FORMATS, ANILIST_MEDIA_STATUSES, ANILIST_SORT_OPTIONS } from '@/constants/client.constants';

export const AnilistFilterSchema = z.object({
    search: z.string().optional(),
    format: z
        .string({ message: 'Invalid format selected' })
        .refine((val) => ANILIST_MEDIA_FORMATS.includes(val), {
            message: 'Invalid format selected',
        })
        .transform((val) => val?.replace(' ', '_').toUpperCase())
        .nullable(),
    genres: z
        .array(z.string())
        .refine((val) => val.every((g) => ANILIST_GENRES.includes(g)), {
            message: 'Invalid genre selected',
        })
        .nullable(),
    status: z
        .string({ message: 'Invalid status option' })
        .refine((val) => ANILIST_MEDIA_STATUSES.includes(val), {
            message: 'Invalid status option',
        })
        .transform((val) => val?.replaceAll(' ', '_').toUpperCase())
        .nullable(),
    sort: z.string({ message: 'Invalid sort option' }).refine((val) => ANILIST_SORT_OPTIONS.includes(val), {
        message: 'Invalid sort option',
    }),
    year: z.number().min(1900).max(new Date().getFullYear()).nullable(),
});
