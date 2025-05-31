import { EXTERNAL_ROUTES } from '@/constants/routes.constants';
import saavnConfig from '@/lib/config/saavn.config';
import { T_SaavnAlbum, T_SaavnAlbumAPIResponse, T_SaavnSearchAlbum, T_SaavnSearchAlbumAPIResponse } from '@/lib/types/saavn/albums.types';
import {
    T_SaavnArtist,
    T_SaavnArtistAPIResponse,
    T_SaavnArtistAlbumAPIResponse,
    T_SaavnArtistBase,
    T_SaavnArtistSongAPIResponse,
} from '@/lib/types/saavn/artists.type';
import { T_SaavnLyrics } from '@/lib/types/saavn/global.types';
import { T_SaavnPlaylist, T_SaavnPlaylistAPIResponse } from '@/lib/types/saavn/playlist.types';
import {
    T_SaavnSearchAPIResponse,
    T_SaavnSearchArtistAPIResponse,
    T_SaavnSearchPlaylist,
    T_SaavnSearchPlaylistAPIResponse,
    T_SaavnSearchResponse,
    T_SaavnSearchSongAPIResponse,
} from '@/lib/types/saavn/search.types';
import { T_SaavnSong, T_SaavnSongAPIResponse, T_SaavnSongSuggestionAPIResponse } from '@/lib/types/saavn/song.types';
import { createErrorReturn, createSuccessReturn } from '@/lib/utils/createResponse.utils';
import {
    createAlbumPayload,
    createArtistBasePayload,
    createArtistPayload,
    createPlaylistPayload,
    createSearchAlbumPayload,
    createSearchPayload,
    createSearchPlaylistPayload,
    createSongPayload,
} from '@/lib/utils/saavn.utils';
import { safeAwait } from '@/lib/utils/safeAwait.utils';

type T_SearchParams = { query: string; page: number; limit: number };

const apiHandler = async <T, R>(
    endPoint: string,
    params: Record<string, string | number>,
    transform: (data: T) => R,
    errorMsg: string = 'Failed to fetch data',
    successMsg: string = 'Data fetched successfully!'
) => {
    const [error, response] = await safeAwait(
        saavnConfig.get<
            | T
            | {
                  error: {
                      code: string;
                      msg: string;
                  };
              }
        >('/', { params: { ...params, __call: endPoint } })
    );

    const hasError = typeof response?.data === 'object' && response?.data !== null && 'error' in response.data;
    return error || !response || hasError ? createErrorReturn(errorMsg, error) : createSuccessReturn(successMsg, transform(response.data as T));
};

/* -------------------------------------------------------------------------- */
/*                                   Search                                   */
/* -------------------------------------------------------------------------- */
export const searchAll = async (query: string) =>
    apiHandler<T_SaavnSearchAPIResponse, T_SaavnSearchResponse>(
        EXTERNAL_ROUTES.SAAVN.SEARCH.ALL,
        { query },
        createSearchPayload,
        'Failed to fetch search results',
        'Search results fetched successfully!'
    );

export const searchSongs = async ({ query, page, limit }: T_SearchParams) =>
    apiHandler<T_SaavnSearchSongAPIResponse, { total: number; start: number; results: T_SaavnSong[] }>(
        EXTERNAL_ROUTES.SAAVN.SEARCH.SONGS,
        { q: query, p: page, n: limit },
        (data) => ({
            total: data.total,
            start: data.start,
            results: data.results?.map(createSongPayload).slice(0, limit) || [],
        }),
        'Failed to fetch search results',
        'Search results fetched successfully!'
    );

export const searchAlbums = async ({ query, page, limit }: T_SearchParams) =>
    apiHandler<T_SaavnSearchAlbumAPIResponse, T_SaavnSearchAlbum>(
        EXTERNAL_ROUTES.SAAVN.SEARCH.ALBUMS,
        { q: query, p: page, n: limit },
        createSearchAlbumPayload,
        'Failed to fetch search results',
        'Search results fetched successfully!'
    );

export const searchArtists = async ({ query, page, limit }: T_SearchParams) =>
    apiHandler<T_SaavnSearchArtistAPIResponse, { total: number; start: number; results: T_SaavnArtistBase[] }>(
        EXTERNAL_ROUTES.SAAVN.SEARCH.ARTISTS,
        { q: query, p: page, n: limit },
        (data) => ({
            total: data.total,
            start: data.start,
            results: data.results?.map(createArtistBasePayload).slice(0, limit) || [],
        }),
        'Failed to fetch search results',
        'Search results fetched successfully!'
    );

export const searchPlaylists = async ({ query, page, limit }: T_SearchParams) =>
    apiHandler<T_SaavnSearchPlaylistAPIResponse, T_SaavnSearchPlaylist>(
        EXTERNAL_ROUTES.SAAVN.SEARCH.PLAYLISTS,
        { q: query, p: page, n: limit },
        createSearchPlaylistPayload,
        'Failed to fetch search results',
        'Search results fetched successfully!'
    );

/* -------------------------------------------------------------------------- */
/*                                    Songs                                   */
/* -------------------------------------------------------------------------- */
export const getSongByIds = async (ids: string) => {
    const [error, response] = await safeAwait(
        saavnConfig.get<{ songs: T_SaavnSongAPIResponse[] }>('/', { params: { pids: ids, __call: EXTERNAL_ROUTES.SAAVN.SONG.ID } })
    );

    if (error || !response) return createErrorReturn('Failed to fetch song', error);

    const songs = response.data.songs;

    if (!songs?.length) return createErrorReturn('Song not found');

    return createSuccessReturn(
        'Song fetched successfully!',
        songs.map((song) => createSongPayload(song))
    );
};

export const getSongByLink = async (link: string) => {
    const token = link.match(/jiosaavn\.com\/song\/[^/]+\/([^/]+)$/)?.[1];
    if (!token) return createErrorReturn('Invalid song link');

    const [error, response] = await safeAwait(
        saavnConfig.get<{ songs: T_SaavnSongAPIResponse[] }>('/', { params: { token, type: 'song', __call: EXTERNAL_ROUTES.SAAVN.SONG.LINK } })
    );

    if (error || !response) return createErrorReturn('Failed to fetch song', error);

    const songs = response.data.songs;

    if (!songs?.length) return createErrorReturn('Song not found');

    return createSuccessReturn(
        'Song fetched successfully!',
        songs.map((song) => createSongPayload(song))
    );
};

export const getSongStation = async (id: string) => {
    const encodedSongId = JSON.stringify([encodeURIComponent(id)]);

    const [error, response] = await safeAwait(
        saavnConfig.get<{ stationid: string }>(EXTERNAL_ROUTES.SAAVN.SONG.STATION, {
            params: {
                entity_id: encodedSongId,
                entity_type: 'queue',
                ctx: 'android',
            },
        })
    );

    return error || !response
        ? createErrorReturn('Failed to fetch song station', error)
        : createSuccessReturn('Song station fetched successfully!', response.data.stationid);
};

export const getSongSuggestions = async ({ id, limit }: { id: string; limit: number }) => {
    const stationsRes = await getSongStation(id);

    if (!stationsRes.success) {
        return createErrorReturn('Failed to fetch song suggestions');
    }

    const [error, response] = await safeAwait(
        saavnConfig.get<T_SaavnSongSuggestionAPIResponse>(EXTERNAL_ROUTES.SAAVN.SONG.SUGGESTIONS, {
            params: {
                stationid: stationsRes.payload,
                k: limit,
                ctx: 'android',
            },
        })
    );

    if (error || !response?.data) {
        return createErrorReturn('Failed to fetch song suggestions', error);
    }

    const rawSuggestions = Object.values(response.data);
    const suggestions = rawSuggestions
        .map((entry) => {
            if (typeof entry === 'object' && entry.song) {
                return createSongPayload(entry.song);
            }
            return null;
        })
        .filter((s) => s !== null)
        .slice(0, limit);

    return createSuccessReturn('Song suggestions fetched successfully!', suggestions);
};

export const getSongLyrics = async (id: string) => {
    const [error, response] = await safeAwait(
        saavnConfig.get<T_SaavnLyrics>(EXTERNAL_ROUTES.SAAVN.SONG.LYRICS, {
            params: { id, __call: EXTERNAL_ROUTES.SAAVN.SONG.LYRICS },
        })
    );

    const hasError = typeof response?.data === 'object' && response?.data !== null && 'error' in response.data;

    return error || !response || hasError || !response.data.lyrics
        ? createErrorReturn('Failed to fetch song lyrics', error)
        : createSuccessReturn('Song lyrics fetched successfully!', response.data.lyrics);
};

/* -------------------------------------------------------------------------- */
/*                                    Album                                   */
/* -------------------------------------------------------------------------- */
export const getAlbumById = async (id: string) =>
    apiHandler<T_SaavnAlbumAPIResponse, T_SaavnAlbum>(
        EXTERNAL_ROUTES.SAAVN.ALBUM.DETAILS,
        { albumid: id },
        createAlbumPayload,
        'Failed to fetch album',
        'Album fetched successfully!'
    );

export const getAlbumByLink = async (link: string) => {
    const token = link.match(/jiosaavn\.com\/album\/[^/]+\/([^/]+)$/)?.[1];

    if (!token) {
        return createErrorReturn('Invalid album link');
    }

    return apiHandler<T_SaavnAlbumAPIResponse, T_SaavnAlbum>(
        EXTERNAL_ROUTES.SAAVN.ALBUM.LINK,
        { token, type: 'album' },
        createAlbumPayload,
        'Failed to fetch album',
        'Album fetched successfully!'
    );
};

/* -------------------------------------------------------------------------- */
/*                                   Artist                                   */
/* -------------------------------------------------------------------------- */
export const getArtistById = async ({
    id,
    page,
    songCount,
    albumCount,
    sortBy,
    sortOrder,
}: {
    id: string;
    page: number;
    songCount: number;
    albumCount: number;
    sortBy: string;
    sortOrder: string;
}) =>
    apiHandler<T_SaavnArtistAPIResponse, T_SaavnArtist>(
        EXTERNAL_ROUTES.SAAVN.ARTIST.DETAILS,
        { artistId: id, page, n_song: songCount, n_album: albumCount, sort_order: sortOrder, category: sortBy },
        createArtistPayload,
        'Failed to fetch artist',
        'Artist fetched successfully!'
    );

export const getArtistByLink = async ({
    link,
    page,
    songCount,
    albumCount,
    sortBy,
    sortOrder,
}: {
    link: string;
    page: number;
    songCount: number;
    albumCount: number;
    sortBy: string;
    sortOrder: string;
}) => {
    const token = link.match(/jiosaavn\.com\/artist\/[^/]+\/([^/]+)$/)?.[1];

    if (!token) {
        return createErrorReturn('Invalid artist link');
    }

    return apiHandler<T_SaavnArtistAPIResponse, T_SaavnArtist>(
        EXTERNAL_ROUTES.SAAVN.ARTIST.LINK,
        { token, page, type: 'artist', n_song: songCount, n_album: albumCount, sort_order: sortOrder, category: sortBy },
        createArtistPayload,
        'Failed to fetch artist',
        'Artist fetched successfully!'
    );
};

export const getArtistSongs = async ({ id, page, sortBy, sortOrder }: { id: string; page: number; sortBy: string; sortOrder: string }) =>
    apiHandler<T_SaavnArtistSongAPIResponse, { total: number; songs: T_SaavnSong[] }>(
        EXTERNAL_ROUTES.SAAVN.ARTIST.SONGS,
        { id, page, sort_order: sortOrder, category: sortBy },
        (data) => ({
            total: data.topSongs.total,
            songs: data.topSongs.songs.map((song) => createSongPayload(song)),
        }),
        'Failed to fetch artist songs',
        'Artist songs fetched successfully!'
    );

export const getArtistAlbums = async ({ id, page, sortBy, sortOrder }: { id: string; page: number; sortBy: string; sortOrder: string }) =>
    apiHandler<T_SaavnArtistAlbumAPIResponse, { total: number; albums: T_SaavnAlbum[] }>(
        EXTERNAL_ROUTES.SAAVN.ARTIST.ALBUMS,
        { id, page, sort_order: sortOrder, category: sortBy },
        (data) => ({
            total: data.topAlbums.total,
            albums: data.topAlbums.albums.map((album) => createAlbumPayload(album)),
        }),
        'Failed to fetch artist albums',
        'Artist albums fetched successfully!'
    );

/* -------------------------------------------------------------------------- */
/*                                  Playlist                                  */
/* -------------------------------------------------------------------------- */
export const getPlaylistById = async ({ id, limit, page }: { id: string; page: number; limit: number }) =>
    apiHandler<T_SaavnPlaylistAPIResponse, T_SaavnPlaylist & { songCount: number | null; songs: T_SaavnSong[] }>(
        EXTERNAL_ROUTES.SAAVN.PLAYLIST.DETAILS,
        { listid: id, p: page, n: limit },
        (data) => {
            const playlist = createPlaylistPayload(data);
            return {
                ...playlist,
                songCount: playlist?.songs?.length || null,
                songs: playlist?.songs?.slice(0, limit) || [],
            };
        },
        'Failed to fetch playlist',
        'Playlist fetched successfully!'
    );

export const getPlaylistByLink = async ({ link, limit, page }: { link: string; page: number; limit: number }) => {
    const token = link.match(/jiosaavn\.com\/playlist\/([^/]+)$/)?.[1];

    if (!token) {
        return createErrorReturn('Invalid playlist link');
    }

    return apiHandler<T_SaavnPlaylistAPIResponse, T_SaavnPlaylist & { songCount: number | null; songs: T_SaavnSong[] }>(
        EXTERNAL_ROUTES.SAAVN.PLAYLIST.LINK,
        { token, type: 'playlist', p: page, n: limit },
        (data) => {
            const playlist = createPlaylistPayload(data);
            return {
                ...playlist,
                songCount: playlist?.songs?.length || null,
                songs: playlist?.songs?.slice(0, limit) || [],
            };
        },
        'Failed to fetch playlist',
        'Playlist fetched successfully!'
    );
};

const saavnApi = {
    searchArtists,
    searchAlbums,
    searchSongs,
    searchPlaylists,
    searchAll,

    getSongByIds,
    getSongByLink,
    getSongStation,
    getSongSuggestions,
    getSongLyrics,

    getAlbumById,
    getAlbumByLink,

    getArtistById,
    getArtistByLink,
    getArtistSongs,
    getArtistAlbums,

    getPlaylistById,
    getPlaylistByLink,
};

export default saavnApi;
