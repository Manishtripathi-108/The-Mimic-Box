import axios from 'axios';

import { EXTERNAL_ROUTES } from '@/constants/routes.constants';
import { T_LyricsRecord } from '@/lib/types/common.types';
import { createErrorReturn, createSuccessReturn } from '@/lib/utils/createResponse.utils';

const fetchLyricsData = async <T>(url: string, params?: Record<string, string | undefined | number>, successMessage = 'Request successful') => {
    try {
        const { data } = await axios.get<T>(url, { params });
        return createSuccessReturn(successMessage, data);
    } catch (err) {
        const message = axios.isAxiosError(err)
            ? err.response?.data?.message || err.message
            : err instanceof Error
              ? err.message
              : 'An unexpected error occurred.';
        return createErrorReturn(message);
    }
};

export const getLyricsById = (id: number) =>
    fetchLyricsData<T_LyricsRecord>(`${EXTERNAL_ROUTES.LRCLIB.GET}/${id}`, undefined, 'Lyrics fetched successfully by ID!');

export const getLyricsByMetadata = (trackName: string, artistName: string, albumName: string, duration: number) =>
    fetchLyricsData<T_LyricsRecord>(
        EXTERNAL_ROUTES.LRCLIB.GET,
        {
            track_name: trackName,
            artist_name: artistName,
            album_name: albumName,
            duration,
        },
        'Lyrics fetched successfully by metadata!'
    );

export const searchLyrics = ({
    q,
    trackName,
    artistName,
    albumName,
    duration,
}: {
    q?: string;
    trackName?: string;
    artistName?: string;
    albumName?: string;
    duration?: number;
}) =>
    fetchLyricsData<T_LyricsRecord[]>(
        EXTERNAL_ROUTES.LRCLIB.SEARCH,
        {
            q,
            track_name: trackName,
            artist_name: artistName,
            album_name: albumName,
            duration,
        },
        'Lyrics search completed successfully!'
    );

const lrclib = {
    getLyricsById,
    getLyricsByMetadata,
    searchLyrics,
};

export default lrclib;
