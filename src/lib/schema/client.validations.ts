import { z } from 'zod';

import { ANILIST_GENRES } from '@/constants/client.constants';

export const AnilistMediaSeasonSchema = z.enum(['WINTER', 'SPRING', 'SUMMER', 'FALL']);
export const AnilistMediaStatusSchema = z.enum(['FINISHED', 'RELEASING', 'NOT_YET_RELEASED', 'CANCELLED', 'HIATUS']);
export const AnilistMediaListStatusSchema = z.enum(['COMPLETED', 'CURRENT', 'DROPPED', 'PAUSED', 'PLANNING', 'REPEATING']);
export const AnilistMediaFormatSchema = z.enum(['TV', 'TV_SHORT', 'MOVIE', 'SPECIAL', 'OVA', 'ONA', 'MUSIC', 'MANGA', 'NOVEL', 'ONE_SHOT']);
export const AnilistMediaSortOptionsSchema = z.enum(['Last Updated', 'Average Score', 'Popularity', 'Score', 'Title', 'Year']);

export const AnilistFilterSchema = z.object({
    search: z.string().optional(),
    format: AnilistMediaFormatSchema.optional(),
    status: AnilistMediaStatusSchema.optional(),
    sort: AnilistMediaSortOptionsSchema,
    season: z.enum(['ALL', 'WINTER', 'SPRING', 'SUMMER', 'FALL']),
    year: z.union([z.number().min(1900).max(new Date().getFullYear()), z.nan()]).optional(),
    genres: z
        .array(z.string())
        .refine((val) => val.every((g) => ANILIST_GENRES.includes(g)), {
            message: 'Invalid genre selected',
        })
        .optional()
        .transform((val) => ((val ?? []).length > 0 ? val : undefined)),
});

export const AudioSampleRatesSchema = z.enum(['no change', '44100 Hz', '48000 Hz', '96000 Hz']);
export const AudioChannelsSchema = z.enum(['no change', 'mono', 'stereo']);
export const AudioPlaybackSpeedsSchema = z.enum(['0.25x (Very Slow)', '0.5x (Slow)', '1.0x (Normal)', '1.5x (Fast)', '2.0x (Very Fast)']);
export const AudioFormatsSchema = z.enum(['AAC', 'MP3', 'WMA', 'AIFF', 'FLAC', 'OGG', 'M4A', 'WAV']);
export const AudioBitrateSchema = z.enum(['0', '64', '128', '192', '256', '320']).transform((val) => parseInt(val));

export const AudioConverterSchema = z.object({});

export const audioAdvanceSettingsSchema = z.object({
    audio: z.object({
        volume: z.string().min(0).max(500).default('100'),
        channels: AudioChannelsSchema.default('no change'),
        sampleRate: AudioSampleRatesSchema.default('44100 Hz'),
    }),
    effects: z.object({
        playbackSpeed: AudioPlaybackSpeedsSchema.default('1.0x (Normal)'),
        fadeIn: z.string().min(0).max(10).optional(),
        fadeOut: z.string().min(0).max(10).optional(),
        pitchShift: z.string().min(-12).max(12).optional(),
        normalize: z.boolean().default(false),
    }),
    trim: z.object({
        trimStart: z.string().time().default('00:00:00').optional(),
        trimEnd: z.string().time().default('00:00:00').optional(),
    }),
});
