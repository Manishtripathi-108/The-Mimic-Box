'use server';

import axios from 'axios';

import { LyricsQuerySchema } from '@/lib/schema/audio.validations';
import lrclib from '@/lib/services/lrclib.service';
import { T_LyricsQuery } from '@/lib/types/common.types';
import { createError, createValidationError } from '@/lib/utils/createResponse.utils';

export async function getLyrics(params: T_LyricsQuery) {
    try {
        const parsedParams = LyricsQuerySchema.safeParse(params);
        if (!parsedParams.success) return createValidationError('Invalid data!', parsedParams.error.issues);

        const { id, q, trackName, artistName, albumName, duration } = parsedParams.data;

        // 1. Fetch by ID
        if (id) {
            return lrclib.getLyricsById(id);
        }

        // 2. Direct GET using track, artist, album, and duration
        if (trackName && artistName && albumName && duration) {
            return lrclib.getLyricsByMetadata(trackName, artistName, albumName, duration);
        }

        // 3. Search by query or track name
        if (q || trackName) {
            return lrclib.searchLyrics({
                q: q,
                track_name: trackName,
                artist_name: artistName,
                album_name: albumName,
                duration: duration,
            });
        }

        return createValidationError('No valid parameters provided for lyrics lookup.');
    } catch (err) {
        const message = axios.isAxiosError(err)
            ? err.response?.data?.message || err.message
            : err instanceof Error
              ? err.message
              : 'Failed to fetch lyrics.';

        return createError(message);
    }
}
