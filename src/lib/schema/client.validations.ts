import { z } from 'zod';

import { FILTER_OPTIONS } from '@/constants/client.constants';

export const AnilistFilterSchema = z.object({
    format: z.string().nullable(),
    genres: z
        .array(z.string())
        .refine((val) => val.every((g) => FILTER_OPTIONS.genres.includes(g)), {
            message: 'Invalid genre selected',
        })
        .optional(),
    year: z.number().min(1900).max(new Date().getFullYear()).nullable().optional(),
    status: z.string().nullable(),
    sort: z.string().refine((val) => FILTER_OPTIONS.sort.includes(val), {
        message: 'Invalid sort option',
    }),
});
