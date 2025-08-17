import axios from 'axios';

import LRCLIB_ROUTES from '@/constants/external-routes/lrclib.routes';
import { T_LyricsRecord } from '@/lib/types/common.types';
import { createError, createSuccess } from '@/lib/utils/createResponse.utils';

const fetchLyricsData = async <T>(url: string, params?: Record<string, string | undefined | number>, successMessage = 'Request successful') => {
    try {
        const { data } = await axios.get<T>(url, { params });
        return createSuccess(successMessage, data);
    } catch (err) {
        return createError('Failed to fetch lyrics', { error: err });
    }
};

export const getLyricsById = (id: number) =>
    fetchLyricsData<T_LyricsRecord>(`${LRCLIB_ROUTES.GET}/${id}`, undefined, 'Lyrics fetched successfully by ID!');

export const getLyricsByMetadata = (track_name: string, artist_name: string, album_name: string, duration: number) =>
    fetchLyricsData<T_LyricsRecord>(LRCLIB_ROUTES.GET, { track_name, artist_name, album_name, duration }, 'Lyrics fetched successfully by metadata!');

export const searchLyrics = ({
    q,
    track_name,
    artist_name,
    album_name,
    duration,
}: {
    q?: string;
    track_name?: string;
    artist_name?: string;
    album_name?: string;
    duration?: number;
}) =>
    fetchLyricsData<T_LyricsRecord[]>(
        LRCLIB_ROUTES.SEARCH,
        { q, track_name, artist_name, album_name, duration },
        'Lyrics search completed successfully!'
    );

const lrclib = {
    getLyricsById,
    getLyricsByMetadata,
    searchLyrics,
};

export default lrclib;
