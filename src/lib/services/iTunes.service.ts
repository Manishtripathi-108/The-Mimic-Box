import { AxiosRequestConfig } from 'axios';

import ITUNES_ROUTES from '@/constants/external-routes/iTunes.routes';
import iTunesConfig from '@/lib/config/iTunes.config';
import { T_ITunesAlbumCollectionResponse, T_ITunesPayload, T_ITunesTrackResponse } from '@/lib/types/iTunes/api.types';
import { ITunesMusicAlbumTracks, T_ITunesAlbum, T_ITunesTrack } from '@/lib/types/iTunes/normalized.types';
import { createErrorReturn, createSuccessReturn } from '@/lib/utils/createResponse.utils';
import { createITunesTrack, createItunesAlbum } from '@/lib/utils/iTunes.utils';
import { safeAwait } from '@/lib/utils/safeAwait.utils';

/** Helper to fetch and validate data from iTunes */
const fetchITunesData = async <T, R>(
    url: string,
    params: AxiosRequestConfig['params'],
    notFoundMessage: string,
    transform: (data: T[]) => R | false
) => {
    const [err, res] = await safeAwait(iTunesConfig.get<T_ITunesPayload<T>>(url, { params }));

    if (err || !res) return createErrorReturn('Failed to fetch data');

    const { results } = res.data;

    if (!results.length) return createErrorReturn(notFoundMessage);

    const transformedData = transform(results);
    if (!transformedData) return createErrorReturn(notFoundMessage);

    return createSuccessReturn('Data fetched successfully', transformedData);
};

/** Search for iTunes tracks by query */
export const searchTracks = async ({ track, artist, album, limit = 5 }: { track: string; artist?: string; album?: string; limit?: number }) => {
    const term = [track, artist, album].filter(Boolean).join(' ');

    return fetchITunesData<T_ITunesTrackResponse, T_ITunesTrack[]>(
        ITUNES_ROUTES.SEARCH,
        { term, entity: 'song', limit },
        'No tracks found for the given query',
        (data) => data.map(createITunesTrack)
    );
};

/** Get iTunes albums by ID */
export const getAlbumsById = async (id: number | string, limit = 5) => {
    return fetchITunesData<T_ITunesAlbumCollectionResponse, T_ITunesAlbum[]>(
        ITUNES_ROUTES.LOOKUP,
        { id, entity: 'album', limit },
        'No collection found for the given ID',
        (data) => data.map(createItunesAlbum)
    );
};

/** Get album and its tracks by ID */
export const getAlbumTracksById = async (id: number | string, limit = 5) => {
    return fetchITunesData<T_ITunesAlbumCollectionResponse | T_ITunesTrackResponse, ITunesMusicAlbumTracks>(
        ITUNES_ROUTES.LOOKUP,
        { id, entity: 'song', limit },
        'No album or tracks found for the given ID',
        (data) => {
            const rawAlbum = data.find((item) => item.wrapperType === 'collection');
            const rawTracks = data.filter((item) => item.wrapperType === 'track');

            if (!rawAlbum || !rawTracks.length) return false;

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
