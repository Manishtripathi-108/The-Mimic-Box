import { AxiosRequestConfig } from 'axios';

import ITUNES_ROUTES from '@/constants/external-routes/iTunes.routes';
import iTunesConfig from '@/lib/config/iTunes.config';
import { T_ITunesAlbumCollectionResponse, T_ITunesPayload, T_ITunesTrackResponse } from '@/lib/types/iTunes/api.types';
import { ITunesMusicAlbumTracks, T_ITunesAlbum, T_ITunesTrack } from '@/lib/types/iTunes/normalized.types';
import { createError, createNotFound, createSuccess } from '@/lib/utils/createResponse.utils';
import { createITunesTrack, createItunesAlbum } from '@/lib/utils/iTunes.utils';
import { safeAwait } from '@/lib/utils/safeAwait.utils';

/**
 * Generic helper to fetch and normalize iTunes data.
 */
const fetchITunesData = async <T, R>(
    url: string,
    params: AxiosRequestConfig['params'],
    notFoundMessage: string,
    transform: (data: T[]) => R | false
) => {
    const [err, res] = await safeAwait(iTunesConfig.get<T_ITunesPayload<T>>(url, { params }));

    if (err || !res) {
        return createError('Failed to fetch data from iTunes', { error: err });
    }

    const { results } = res.data;

    if (!results?.length) {
        return createNotFound(notFoundMessage);
    }

    const transformedData = transform(results);
    if (!transformedData) {
        return createNotFound(notFoundMessage);
    }

    return createSuccess('Data fetched successfully', transformedData);
};

/**
 * Search iTunes tracks using song title, artist, or album
 */
export const searchTracks = async ({ title, artist, album, limit = 5 }: { title: string; artist?: string; album?: string; limit?: number }) => {
    const term = [title, artist, album].filter(Boolean).join(' ');

    return fetchITunesData<T_ITunesTrackResponse, T_ITunesTrack[]>(
        ITUNES_ROUTES.SEARCH,
        { term, entity: 'song', limit },
        'No tracks found for the given query',
        (data) => data.map(createITunesTrack)
    );
};

/**
 * Get album(s) by iTunes collection ID
 */
export const getAlbumsById = async (id: number | string, limit = 5) => {
    return fetchITunesData<T_ITunesAlbumCollectionResponse, T_ITunesAlbum[]>(
        ITUNES_ROUTES.LOOKUP,
        { id, entity: 'album', limit },
        'No collection found for the given ID',
        (data) => data.map(createItunesAlbum)
    );
};

/**
 * Get a single album and its associated tracks by collection ID
 */
export const getAlbumTracksById = async (id: number | string, limit = 5) => {
    return fetchITunesData<T_ITunesAlbumCollectionResponse | T_ITunesTrackResponse, ITunesMusicAlbumTracks>(
        ITUNES_ROUTES.LOOKUP,
        { id, entity: 'song', limit },
        'No album or tracks found for the given ID',
        (data) => {
            const rawAlbum = data.find((item) => item.wrapperType === 'collection');
            const rawTracks = data.filter((item) => item.wrapperType === 'track');

            if (!rawAlbum || rawTracks.length === 0) return false;

            const album = createItunesAlbum(rawAlbum);
            const songs = rawTracks.map(createITunesTrack);

            return {
                ...album,
                songs,
            };
        }
    );
};

const iTunesService = {
    searchTracks,
    getAlbumsById,
    getAlbumTracksById,
};

export default iTunesService;
