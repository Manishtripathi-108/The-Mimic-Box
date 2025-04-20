import { z } from 'zod';

import { MAX_FILE_SIZE } from '@/constants/client.constants';

export const AudioSampleRatesSchema = z.enum(['no change', '44100 Hz', '48000 Hz', '96000 Hz']);
export const AudioPlaybackSpeedsSchema = z.enum(['0.25x (Very Slow)', '0.5x (Slow)', '1.0x (Normal)', '1.5x (Fast)', '2.0x (Very Fast)']);
export const AudioFormatsSchema = z.enum(['AAC', 'MP3', 'WMA', 'AIFF', 'FLAC', 'OGG', 'M4A', 'WAV']);
export const AudioBitrateSchema = z.enum(['0', '64', '128', '192', '256', '320']);

export const AudioFileValidationSchema = z
    .instanceof(File, { message: 'Invalid audio file.' })
    .refine((val) => /audio\/.*/.test(val.type), {
        message: 'Invalid audio file type.',
    })
    .refine((val) => val.size <= MAX_FILE_SIZE.audio, {
        message: `Audio file size must not exceed ${MAX_FILE_SIZE.audio / 1000000} MB`,
    });

export const AudioFileArrayValidationSchema = z.array(AudioFileValidationSchema).max(10, { message: 'You can upload a maximum of 10 audio files.' });

export const audioAdvanceSettingsSchema = z.object({
    audio: z.object({
        format: AudioFormatsSchema.default('M4A'),
        volume: z.coerce.number().min(0).max(500).default(100),
        channels: z.enum(['0', '1', '2']).default('0'),
        sampleRate: AudioSampleRatesSchema.default('no change'),
        bitrate: AudioBitrateSchema.default('128'),
    }),
    effects: z.object({
        playbackSpeed: AudioPlaybackSpeedsSchema.default('1.0x (Normal)'),
        fadeIn: z.coerce.number().min(0).max(10).default(0),
        fadeOut: z.coerce.number().min(0).max(10).default(0),
        pitchShift: z.coerce.number().min(-12).max(12).default(0),
        normalize: z.boolean().default(false),
    }),
    trim: z.object({
        trimStart: z.string().time({ message: 'Invalid time format (HH:MM:SS)' }).default('00:00:00'),
        trimEnd: z.string().time({ message: 'Invalid time format (HH:MM:SS)' }).default('00:00:00'),
    }),
});

export const AudioMetaTagsSchema = z.object({
    cover: z
        .instanceof(File, { message: 'Invalid image' })
        .refine((file) => !file || file.size <= MAX_FILE_SIZE.image, {
            message: `Image file size must not exceed ${MAX_FILE_SIZE.image / 1000000} MB`,
        })
        .refine((file) => !file || file.type.startsWith('image/'), { message: 'File must be a valid image' })
        .optional(),
    title: z.string().min(1, { message: 'Title is required' }),
    artist: z.string().min(1, { message: 'Artist is required' }),
    album: z.string().optional(),
    album_artist: z.string().optional(),
    genre: z.string().optional(),
    date: z.coerce.number().min(1700).max(new Date().getFullYear()).default(new Date().getFullYear()),
    track: z.coerce.number().min(1).default(1),

    composer: z.string().optional(),
    lyricist: z.string().optional(),
    lyrics: z.string().optional(),
    comment: z.string().optional(),
    publisher: z.string().optional(),
    isrc: z.string().optional(),
    bpm: z.coerce.number().min(0).optional(),
    language: z.string().optional(),
    conductor: z.string().optional(),
    mood: z.string().optional(),
    rating: z.coerce.number().min(0).max(10).optional(),
    media_type: z.string().optional(),
    catalog_number: z.string().optional(),
    encoder: z.string().optional(),
    copyright: z.string().optional(),
    url: z.string().url({ message: 'Invalid URL' }).or(z.literal('')).optional(),
});

export const LyricsQuerySchema = z
    .object({
        id: z.coerce.number().optional(),
        q: z.string().optional(),
        trackName: z.string().optional(),
        artistName: z.string().optional(),
        albumName: z.string().optional(),
        duration: z.coerce.number().optional(),
    })
    .refine(
        (data) =>
            data.id !== undefined || (data.q !== undefined && data.q.trim() !== '') || (data.trackName !== undefined && data.trackName.trim() !== ''),
        {
            message: 'At least one of Lrclib ID, Search Lyrics, or Track Name must be provided.',
            path: ['q'],
        }
    );
