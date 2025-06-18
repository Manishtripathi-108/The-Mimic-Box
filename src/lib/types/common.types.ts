import { z } from 'zod';

import { AudioMetaTagsSchema, LyricsQuerySchema, audioAdvanceSettingsSchema } from '@/lib/schema/audio.validations';

/* ---------------------------------- Audio --------------------------------- */
export type T_AudioAdvanceSettings = z.infer<typeof audioAdvanceSettingsSchema>;
export type T_AudioMetaTags = z.infer<typeof AudioMetaTagsSchema>;
export type T_AudioMetaTagsRecords = Record<
    keyof Omit<T_AudioMetaTags, 'cover'>,
    { className: string; placeholder: string; type?: 'number' | 'textarea' }
>;

export type T_LyricsQuery = z.infer<typeof LyricsQuerySchema>;

export type T_LyricsRecord = {
    id: number;
    trackName: string;
    artistName: string;
    albumName: string;
    duration: number;
    instrumental: boolean;
    plainLyrics: string;
    syncedLyrics: string;
};

export type T_LyricsError = {
    code: number;
    name: string;
    message: string;
};

export type T_DuplicateTrack = {
    id: string;
    title: string;
    artist: string;
    album: string;
    cover: string;
    duplicates: {
        id: string;
        title: string;
        artist: string;
        album: string;
        cover: string;
    }[];
};
