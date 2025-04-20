'use server';

import axios from 'axios';

import { LyricsQuerySchema } from '@/lib/schema/audio.validations';
import { T_LyricsQuery, T_LyricsRecord } from '@/lib/types/common.types';
import { createErrorReturn, createSuccessReturn } from '@/lib/utils/createResponse.utils';

const BASE_URL = 'https://lrclib.net';

export async function getLyrics(params: T_LyricsQuery) {
    try {
        const parsedParams = LyricsQuerySchema.safeParse(params);
        if (!parsedParams.success) return createErrorReturn(parsedParams.error.errors[0].message);

        const { id, q, trackName, artistName, albumName, duration } = parsedParams.data;

        // 1. Fetch by ID
        if (id) {
            const { data } = await axios.get<T_LyricsRecord>(`${BASE_URL}/api/get/${id}`);
            return createSuccessReturn('Lyrics fetched successfully!', data);
        }

        // 2. Direct GET using track, artist, album, and duration
        if (trackName && artistName && albumName && duration) {
            const { data } = await axios.get<T_LyricsRecord>(`${BASE_URL}/api/get`, {
                params: {
                    track_name: trackName,
                    artist_name: artistName,
                    album_name: albumName,
                    duration: duration,
                },
            });
            return createSuccessReturn('Lyrics fetched successfully!', data);
        }

        // 3. Search by query or track name
        if (q || trackName) {
            const { data } = await axios.get<T_LyricsRecord[]>(`${BASE_URL}/api/search`, {
                params: {
                    q,
                    track_name: trackName,
                    artist_name: artistName,
                    album_name: albumName,
                    duration: duration,
                },
            });
            return createSuccessReturn('Lyrics fetched successfully!', data);
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
