import { z } from 'zod';

import jioSaavnApi from '@/lib/services/jio-saavn.service';
import { createErrorReturn } from '@/lib/utils/createResponse.utils';

export const validatePaginationOptions = z.object({
    page: z.number().min(0, 'Page must be non-negative').optional().default(0),
    limit: z.number().gt(0, 'Limit must be greater than 0').optional().default(10),
});

export const validateSortOptions = z.object({
    sortBy: z.enum(['popularity', 'latest', 'alphabetical']).optional().default('popularity'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

export const validateSearchOptions = validatePaginationOptions.extend({
    query: z.string().min(1, 'Query is required'),
});

export type PaginationOptions = z.input<typeof validatePaginationOptions>;
export type SortOptions = z.input<typeof validateSortOptions>;
export type SearchOptions = z.input<typeof validateSearchOptions>;

/**
 * Perform a global search on JioSaavn.
 * @param query The search term.
 * @example
 * const result = await saavnGlobalSearch('Arijit Singh');
 */
export const saavnGlobalSearch = async (query: string) => {
    if (!query) return createErrorReturn('Query is required');
    return await jioSaavnApi.searchAll(query);
};

/**
 * Search for songs on JioSaavn.
 * @example
 * const result = await saavnSearchSongs({ query: 'Tum Hi Ho', page: 1, limit: 10 });
 */
export const saavnSearchSongs = async (options: SearchOptions) => {
    const validate = validateSearchOptions.safeParse(options);
    if (!validate.success) return createErrorReturn(validate.error.format()._errors[0]);
    return await jioSaavnApi.searchSongs(validate.data);
};

/**
 * Search for albums on JioSaavn.
 * @example
 * const result = await saavnSearchAlbums({ query: 'Kabir Singh', page: 0, limit: 5 });
 */
export const saavnSearchAlbums = async (options: SearchOptions) => {
    const validate = validateSearchOptions.safeParse(options);
    if (!validate.success) return createErrorReturn(validate.error.format()._errors[0]);
    return await jioSaavnApi.searchAlbums(validate.data);
};

/**
 * Search for playlists on JioSaavn.
 * @example
 * const result = await saavnSearchPlaylists({ query: 'Workout', page: 0, limit: 10 });
 */
export const saavnSearchPlaylists = async (options: SearchOptions) => {
    const validate = validateSearchOptions.safeParse(options);
    if (!validate.success) return createErrorReturn(validate.error.format()._errors[0]);
    return await jioSaavnApi.searchPlaylists(validate.data);
};

/**
 * Search for artists on JioSaavn.
 * @example
 * const result = await saavnSearchArtists({ query: 'A.R. Rahman', page: 1, limit: 20 });
 */
export const saavnSearchArtists = async (options: SearchOptions) => {
    const validate = validateSearchOptions.safeParse(options);
    if (!validate.success) return createErrorReturn(validate.error.format()._errors[0]);
    return await jioSaavnApi.searchArtists(validate.data);
};

/* -------------------------------------------------------------------------- */
/*                                    Song                                    */
/* -------------------------------------------------------------------------- */

/**
 * Get song details by IDs.
 * @example
 * const result = await saavnGetSongDetails('abc123,xyz456');
 */
export const saavnGetSongDetails = async (ids: string) => {
    if (!ids) return createErrorReturn('IDs are required');
    return await jioSaavnApi.getSongByIds(ids);
};

/**
 * Get song details from a JioSaavn link.
 * @example
 * const result = await saavnGetSongDetailsByLink('https://www.jiosaavn.com/song/abc123');
 */
export const saavnGetSongDetailsByLink = async (link: string) => {
    if (!link) return createErrorReturn('Link is required');
    return await jioSaavnApi.getSongByLink(link);
};

/**
 * Get song suggestions based on a song ID.
 * @example
 * const result = await saavnGetSongSuggestions('abc123');
 */
export const saavnGetSongSuggestions = async (id: string, limit = 10) => {
    if (!id) return createErrorReturn('ID is required');
    return await jioSaavnApi.getSongSuggestions({ id, limit });
};

/* -------------------------------------------------------------------------- */
/*                                    Album                                   */
/* -------------------------------------------------------------------------- */

/**
 * Get album details by ID.
 * @example
 * const result = await saavnGetAlbumDetails('album123');
 */
export const saavnGetAlbumDetails = async (id: string) => {
    if (!id) return createErrorReturn('ID is required');
    return await jioSaavnApi.getAlbumById(id);
};

/**
 * Get album details from a JioSaavn link.
 * @example
 * const result = await saavnGetAlbumDetailsByLink('https://www.jiosaavn.com/album/xyz');
 */
export const saavnGetAlbumDetailsByLink = async (link: string) => {
    if (!link) return createErrorReturn('Link is required');
    return await jioSaavnApi.getAlbumByLink(link);
};

/* -------------------------------------------------------------------------- */
/*                                   Artist                                   */
/* -------------------------------------------------------------------------- */

/**
 * Get artist details by ID with pagination and sorting.
 * @example
 * const result = await saavnGetArtistDetails({ id: 'artist123', page: 0, songCount: 10, albumCount: 5, sortBy: 'popularity', sortOrder: 'asc' });
 */
export const saavnGetArtistDetails = async (params: { id: string; songCount: number; albumCount: number } & PaginationOptions & SortOptions) => {
    if (!params.id) return createErrorReturn('ID is required');
    const pagination = validatePaginationOptions.safeParse(params);
    const sort = validateSortOptions.safeParse(params);

    if (!pagination.success) return createErrorReturn(pagination.error.format()._errors[0]);
    if (!sort.success) return createErrorReturn(sort.error.format()._errors[0]);
    if (params.songCount == null) return createErrorReturn('Song count is required');
    if (params.albumCount == null) return createErrorReturn('Album count is required');
    if (params.songCount < 0) return createErrorReturn('Song count must be a non-negative number');
    if (params.albumCount < 0) return createErrorReturn('Album count must be a non-negative number');

    return await jioSaavnApi.getArtistById({
        ...pagination.data,
        ...sort.data,
        id: params.id,
        songCount: params.songCount,
        albumCount: params.albumCount,
    });
};

/**
 * Get artist details from a link with pagination and sorting.
 * @example
 * const result = await saavnGetArtistDetailsByLink({ link: 'https://www.jiosaavn.com/artist/xyz', page: 0, songCount: 10, albumCount: 5, sortBy: 'latest', sortOrder: 'desc' });
 */
export const saavnGetArtistDetailsByLink = async (
    params: { link: string; songCount: number; albumCount: number } & PaginationOptions & SortOptions
) => {
    if (!params.link) return createErrorReturn('Link is required');
    const pagination = validatePaginationOptions.safeParse(params);
    const sort = validateSortOptions.safeParse(params);

    if (!pagination.success) return createErrorReturn(pagination.error.format()._errors[0]);
    if (!sort.success) return createErrorReturn(sort.error.format()._errors[0]);
    if (params.songCount == null) return createErrorReturn('Song count is required');
    if (params.albumCount == null) return createErrorReturn('Album count is required');
    if (params.songCount < 0) return createErrorReturn('Song count must be a non-negative number');
    if (params.albumCount < 0) return createErrorReturn('Album count must be a non-negative number');

    return await jioSaavnApi.getArtistByLink({
        ...pagination.data,
        ...sort.data,
        link: params.link,
        songCount: params.songCount,
        albumCount: params.albumCount,
    });
};

/**
 * Get songs by an artist.
 * @example
 * const result = await saavnGetArtistSongs({ id: 'artist123', page: 0, sortBy: 'popularity', sortOrder: 'asc' });
 */
export const saavnGetArtistSongs = async (params: { id: string } & PaginationOptions & SortOptions) => {
    if (!params.id) return createErrorReturn('ID is required');
    const pagination = validatePaginationOptions.safeParse(params);
    const sort = validateSortOptions.safeParse(params);

    if (!pagination.success) return createErrorReturn(pagination.error.format()._errors[0]);
    if (!sort.success) return createErrorReturn(sort.error.format()._errors[0]);

    return await jioSaavnApi.getArtistSongs({
        ...pagination.data,
        id: params.id,
        sortBy: sort.data.sortBy,
        sortOrder: sort.data.sortOrder,
    });
};

/**
 * Get albums by an artist.
 * @example
 * const result = await saavnGetArtistAlbums({ id: 'artist123', page: 1, sortBy: 'release', sortOrder: 'desc' });
 */
export const saavnGetArtistAlbums = async (params: { id: string } & PaginationOptions & SortOptions) => {
    if (!params.id) return createErrorReturn('ID is required');
    const pagination = validatePaginationOptions.safeParse(params);
    const sort = validateSortOptions.safeParse(params);

    if (!pagination.success) return createErrorReturn(pagination.error.format()._errors[0]);
    if (!sort.success) return createErrorReturn(sort.error.format()._errors[0]);

    return await jioSaavnApi.getArtistAlbums({
        ...pagination.data,
        id: params.id,
        sortBy: sort.data.sortBy,
        sortOrder: sort.data.sortOrder,
    });
};

/* -------------------------------------------------------------------------- */
/*                                  Playlist                                  */
/* -------------------------------------------------------------------------- */

/**
 * Get playlist details by ID.
 * @example
 * const result = await saavnGetPlaylistDetails({ id: 'playlist123', page: 0, limit: 15 });
 */
export const saavnGetPlaylistDetails = async (params: { id: string } & PaginationOptions) => {
    if (!params.id) return createErrorReturn('ID is required');
    const pagination = validatePaginationOptions.safeParse(params);

    if (!pagination.success) return createErrorReturn(pagination.error.format()._errors[0]);

    return await jioSaavnApi.getPlaylistById({
        ...pagination.data,
        id: params.id,
    });
};

/**
 * Get playlist details from a link.
 * @example
 * const result = await saavnGetPlaylistDetailsByLink({ link: 'https://www.jiosaavn.com/playlist/xyz', page: 0, limit: 10 });
 */
export const saavnGetPlaylistDetailsByLink = async (params: { link: string } & PaginationOptions) => {
    if (!params.link) return createErrorReturn('Link is required');
    const pagination = validatePaginationOptions.safeParse(params);

    if (!pagination.success) return createErrorReturn(pagination.error.format()._errors[0]);

    return await jioSaavnApi.getPlaylistByLink({
        ...pagination.data,
        link: params.link,
    });
};
