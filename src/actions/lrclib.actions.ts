'use server';

import axios from 'axios';

import { LyricsQuerySchema } from '@/lib/schema/audio.validations';
import lrclib from '@/lib/services/lrclib.service';
import { T_LyricsQuery } from '@/lib/types/common.types';
import { createErrorReturn } from '@/lib/utils/createResponse.utils';

export async function getLyrics(params: T_LyricsQuery) {
    try {
        const parsedParams = LyricsQuerySchema.safeParse(params);
        if (!parsedParams.success) return createErrorReturn(parsedParams.error.errors[0].message);

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
                trackName: trackName,
                artistName: artistName,
                albumName: albumName,
                duration: duration,
            });
        }

        return createErrorReturn('No valid parameters provided for lyrics lookup.');
    } catch (err) {
        const message = axios.isAxiosError(err)
            ? err.response?.data?.message || err.message
            : err instanceof Error
              ? err.message
              : 'Failed to fetch lyrics.';

        return createErrorReturn(message);
    }
}
