import z from 'zod';

import { MAX_FILE_SIZE } from '@/constants/common.constants';
import { imageFileValidation } from '@/lib/schema/common.validations';
import { formatFileSize } from '@/lib/utils/file.utils';

export const AudioSampleRatesSchema = z.enum(['no change', '44100 Hz', '48000 Hz', '96000 Hz']);
export const AudioPlaybackSpeedsSchema = z.enum(['0.25x (Very Slow)', '0.5x (Slow)', '1.0x (Normal)', '1.5x (Fast)', '2.0x (Very Fast)']);
export const AudioFormatsSchema = z.enum(['AAC', 'MP3', 'WMA', 'AIFF', 'FLAC', 'OGG', 'M4A', 'WAV']);
export const AudioBitrateSchema = z.enum(['0', '64', '128', '192', '256', '320']);

export const AudioFileValidationSchema = z
    .file()
    .max(MAX_FILE_SIZE.audio, `Audio file size must not exceed ${formatFileSize(MAX_FILE_SIZE.audio)}`)
    .refine((val) => /audio\/.*/.test(val.type), 'Invalid audio file type.');

export const AudioFileArrayValidationSchema = z.array(AudioFileValidationSchema).max(10, 'You can upload a maximum of 10 audio files.');

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
        trimStart: z.iso.time('Invalid time format (HH:MM:SS)').default('00:00:00'),
        trimEnd: z.iso.time('Invalid time format (HH:MM:SS)').default('00:00:00'),
    }),
});

export const AudioMetaTagsSchema = z.object({
    cover: imageFileValidation.max(10 * 1024 * 1024, `Cover image file size must not exceed 10 MB`).optional(),
    title: z.string().min(1, 'Title is required'),
    artist: z.string().min(1, 'Artist is required'),
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
    url: z.url('Invalid URL').or(z.literal('')).optional(),
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
    .refine((data) => data.id !== undefined || (data.q && data.q.trim() !== '') || (data.trackName && data.trackName.trim() !== ''), {
        error: 'At least one of the following fields must be provided: track name, search query, or Lrclib ID.',
        path: ['q'],
    });
