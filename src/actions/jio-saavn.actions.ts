import jioSaavnApi from '@/lib/services/jio-saavn.service';
import { createErrorReturn } from '@/lib/utils/createResponse.utils';

type T_SearchOptions = {
    query: string;
    page?: number;
    limit?: number;
};

const validateSearchOptions = ({ query, page = 0, limit = 10 }: T_SearchOptions) => {
    if (!query) return 'Query is required';
    if (page < 0) return 'Page must be greater than or equal to 0';
    if (limit < 1) return 'Limit must be greater than or equal to 1';
    if (limit > 100) return 'Limit must be less than or equal to 100';
    return null;
};

/**
 * Perform a global search on JioSaavn for a given query.
 *
 *@example
 * const results = await saavnGlobalSearch('Departure lane');
 */
export const saavnGlobalSearch = async (query: string) => {
    if (!query) return createErrorReturn('Query is required');

    const response = await jioSaavnApi.searchAll(query);
    return response;
};

/**
 * Searches for songs on JioSaavn with the specified query, page, and limit.
 *
 * @example
 * const results = await saavnSearchSongs({ query: 'Departure lane', page: 0, limit: 10 });
 */
export const saavnSearchSongs = async ({ query, page = 0, limit = 10 }: { query: string; page: number; limit: number }) => {
    const error = validateSearchOptions({ query, page, limit });
    if (error) return createErrorReturn(error);
    const response = await jioSaavnApi.searchSongs({ query, page, limit });
    return response;
};

/**
 * Searches for albums on JioSaavn with the specified query, page, and limit.
 *
 * @example
 * const results = await saavnSearchAlbums({ query: 'Departure lane', page: 0, limit: 10 });
 */
export const saavnSearchAlbums = async ({ query, page = 0, limit = 10 }: { query: string; page: number; limit: number }) => {
    const error = validateSearchOptions({ query, page, limit });
    if (error) return createErrorReturn(error);

    const response = await jioSaavnApi.searchAlbums({ query, page, limit });
    return response;
};

/**
 * Searches for playlists on JioSaavn with the specified query, page, and limit.
 *
 * @example
 * const results = await saavnSearchPlaylists({ query: 'Departure lane', page: 0, limit: 10 });
 */
export const saavnSearchPlaylists = async ({ query, page = 0, limit = 10 }: { query: string; page: number; limit: number }) => {
    const error = validateSearchOptions({ query, page, limit });
    if (error) return createErrorReturn(error);

    const response = await jioSaavnApi.searchPlaylists({ query, page, limit });
    return response;
};

/**
 * Searches for artists on JioSaavn with the specified query, page, and limit.
 *
 * @example
 * const results = await saavnSearchArtists({ query: 'Departure lane', page: 0, limit: 10 });
 */
export const saavnSearchArtists = async ({ query, page = 0, limit = 10 }: { query: string; page: number; limit: number }) => {
    const error = validateSearchOptions({ query, page, limit });
    if (error) return createErrorReturn(error);

    const response = await jioSaavnApi.searchArtists({ query, page, limit });
    return response;
};

/* -------------------------------------------------------------------------- */
/*                                    Songs                                   */
/* -------------------------------------------------------------------------- */

/**
 * Fetches song details from JioSaavn using the provided song IDs.
 *
 * @example
 * const results = await saavnGetSongDetails('3IoDK8qI,4IoDK8qI,5IoDK8qI');
 */
export const saavnGetSongDetails = async (ids: string) => {
    if (!ids) return createErrorReturn('IDs are required');
    const response = await jioSaavnApi.getSongByIds(ids);
    return response;
};

/**
 * Fetches song details from JioSaavn using the link.
 *
 * @example
 * const results = await saavnGetSongDetailsByLink('https://www.jiosaavn.com/song/departure-lane/3IoDK8qI');
 */
export const saavnGetSongDetailsByLink = async (link: string) => {
    if (!link) return createErrorReturn('Link is required');
    const response = await jioSaavnApi.getSongByLink(link);
    return response;
};

/**
 * Fetches song suggestions from JioSaavn using the provided song ID.
 *
 * @example
 * const results = await saavnGetSongSuggestions('3IoDK8qI');
 */
export const saavnGetSongSuggestions = async (id: string, limit = 10) => {
    if (!id) return createErrorReturn('ID is required');
    const response = await jioSaavnApi.getSongSuggestions({ id, limit });
    return response;
};

/* -------------------------------------------------------------------------- */
/*                                    ALbum                                   */
/* -------------------------------------------------------------------------- */
/**
 * Fetches album details from JioSaavn using the provided album ID.
 *
 * @example
 * const results = await saavnGetAlbumDetails('3IoDK8qI');
 */
export const saavnGetAlbumDetails = async (id: string) => {
    if (!id) return createErrorReturn('ID is required');
    const response = await jioSaavnApi.getAlbumById(id);
    return response;
};

/**
 * Fetches album details from JioSaavn using the link.
 *
 * @example
 * const results = await saavnGetAlbumDetailsByLink('https://www.jiosaavn.com/album/departure-lane/3IoDK8qI');
 */
export const saavnGetAlbumDetailsByLink = async (link: string) => {
    if (!link) return createErrorReturn('Link is required');
    const response = await jioSaavnApi.getAlbumByLink(link);
    return response;
};

/* -------------------------------------------------------------------------- */
/*                                   Artist                                   */
/* -------------------------------------------------------------------------- */
/**
 * Fetches artist details from JioSaavn using the provided artist ID.
 *
 * @example
 * const results = await saavnGetArtistDetails('3IoDK8qI');
 */
export const saavnGetArtistDetails = async ({
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
}) => {
    if (!id) return createErrorReturn('ID is required');
    const response = await jioSaavnApi.getArtistById({
        id,
        page,
        songCount,
        albumCount,
        sortBy,
        sortOrder,
    });
    return response;
};

/**
 * Fetches artist details from JioSaavn using the link.
 *
 * @example
 * const results = await saavnGetArtistDetailsByLink('https://www.jiosaavn.com/artist/departure-lane/3IoDK8qI');
 */
export const saavnGetArtistDetailsByLink = async ({
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
    if (!link) return createErrorReturn('Link is required');
    const response = await jioSaavnApi.getArtistByLink({
        link,
        page,
        songCount,
        albumCount,
        sortBy,
        sortOrder,
    });
    return response;
};

export const saavnGetArtistSongs = async ({ id, page, sortBy, sortOrder }: { id: string; page: number; sortBy: string; sortOrder: string }) => {
    if (!id) return createErrorReturn('ID is required');
    const response = await jioSaavnApi.getArtistSongs({
        id,
        page,
        sortBy,
        sortOrder,
    });
    return response;
};

export const saavnGetArtistAlbums = async ({ id, page, sortBy, sortOrder }: { id: string; page: number; sortBy: string; sortOrder: string }) => {
    if (!id) return createErrorReturn('ID is required');
    const response = await jioSaavnApi.getArtistAlbums({
        id,
        page,
        sortBy,
        sortOrder,
    });
    return response;
};

/* -------------------------------------------------------------------------- */
/*                                  Playlist                                  */
/* -------------------------------------------------------------------------- */
/**
 * Fetches playlist details from JioSaavn using the provided playlist ID.
 *
 * @example
 * const results = await saavnGetPlaylistDetails('3IoDK8qI');
 */
export const saavnGetPlaylistDetails = async ({ id, limit, page }: { id: string; page: number; limit: number }) => {
    if (!id) return createErrorReturn('ID is required');
    const response = await jioSaavnApi.getPlaylistById({ id, limit, page });
    return response;
};

/**
 * Fetches playlist details from JioSaavn using the link.
 *
 * @example
 * const results = await saavnGetPlaylistDetailsByLink('https://www.jiosaavn.com/playlist/departure-lane/3IoDK8qI');
 */
export const saavnGetPlaylistDetailsByLink = async ({ link, limit, page }: { link: string; page: number; limit: number }) => {
    if (!link) return createErrorReturn('Link is required');
    const response = await jioSaavnApi.getPlaylistByLink({ link, limit, page });
    return response;
};
