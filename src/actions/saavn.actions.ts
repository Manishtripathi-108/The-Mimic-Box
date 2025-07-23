'use server';

import { z } from 'zod';

import saavnApi from '@/lib/services/saavn.service';
import { createError, createSuccess, createValidationError } from '@/lib/utils/createResponse.utils';

const validatePaginationOptions = z.object({
    page: z.number().min(0, 'Page must be non-negative').optional().default(0),
    limit: z.number().gt(0, 'Limit must be greater than 0').optional().default(10),
});

const validateSortOptions = z.object({
    sortBy: z.enum(['popularity', 'latest', 'alphabetical']).optional().default('popularity'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

const validateSearchOptions = validatePaginationOptions.extend({
    query: z.string().min(1, 'Query is required'),
});

type PaginationOptions = z.input<typeof validatePaginationOptions>;
type SortOptions = z.input<typeof validateSortOptions>;
type SearchOptions = z.input<typeof validateSearchOptions>;

/**
 * Perform a global search on saavn.
 * @param query The search term.
 * @example
 * const result = await saavnGlobalSearch('Arijit Singh');
 */
export const saavnGlobalSearch = async (query: string) => {
    if (!query) return createValidationError('Query is required');
    return await saavnApi.searchAll(query);
};

/**
 * Search for songs on saavn.
 * @example
 * const result = await saavnSearchSongs({ query: 'Tum Hi Ho', page: 1, limit: 10 });
 */
export const saavnSearchSongs = async (options: SearchOptions) => {
    const validate = validateSearchOptions.safeParse(options);
    if (!validate.success) return createValidationError(validate.error.format()._errors[0], validate.error.errors);
    return await saavnApi.searchSongs(validate.data);
};

/**
 * Search for albums on saavn.
 * @example
 * const result = await saavnSearchAlbums({ query: 'Kabir Singh', page: 0, limit: 5 });
 */
export const saavnSearchAlbums = async (options: SearchOptions) => {
    const validate = validateSearchOptions.safeParse(options);
    if (!validate.success) return createValidationError(validate.error.format()._errors[0], validate.error.errors);
    return await saavnApi.searchAlbums(validate.data);
};

/**
 * Search for playlists on saavn.
 * @example
 * const result = await saavnSearchPlaylists({ query: 'Workout', page: 0, limit: 10 });
 */
export const saavnSearchPlaylists = async (options: SearchOptions) => {
    const validate = validateSearchOptions.safeParse(options);
    if (!validate.success) return createValidationError(validate.error.format()._errors[0], validate.error.errors);
    return await saavnApi.searchPlaylists(validate.data);
};

/**
 * Search for artists on saavn.
 * @example
 * const result = await saavnSearchArtists({ query: 'A.R. Rahman', page: 1, limit: 20 });
 */
export const saavnSearchArtists = async (options: SearchOptions) => {
    const validate = validateSearchOptions.safeParse(options);
    if (!validate.success) return createValidationError(validate.error.format()._errors[0], validate.error.errors);
    return await saavnApi.searchArtists(validate.data);
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
    if (!ids) return createValidationError('IDs are required');
    return await saavnApi.getSongByIds(ids);
};

/**
 * Get song details from a saavn link.
 * @example
 * const result = await saavnGetSongDetailsByLink('https://www.saavn.com/song/abc123');
 */
export const saavnGetSongDetailsByLink = async (link: string) => {
    if (!link) return createValidationError('Link is required');
    return await saavnApi.getSongByLink(link);
};

/**
 * Get song suggestions based on a song ID.
 * @example
 * const result = await saavnGetSongSuggestions('abc123');
 */
export const saavnGetSongSuggestions = async (id: string, limit = 10) => {
    if (!id) return createValidationError('ID is required');
    return await saavnApi.getSongSuggestions({ id, limit });
};

/**
 * Get lyrics of a song.
 * @example
 * const result = await saavnGetSongLyrics('abc123');
 */
export const saavnGetSongLyrics = async (id: string) => {
    if (!id) return createValidationError('ID is required');
    return await saavnApi.getSongLyrics(id);
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
    if (!id) return createValidationError('ID is required');
    return await saavnApi.getAlbumById(id);
};

/**
 * Get album details from a saavn link.
 * @example
 * const result = await saavnGetAlbumDetailsByLink('https://www.saavn.com/album/xyz');
 */
export const saavnGetAlbumDetailsByLink = async (link: string) => {
    if (!link) return createValidationError('Link is required');
    return await saavnApi.getAlbumByLink(link);
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
    if (!params.id) return createValidationError('ID is required');
    const pagination = validatePaginationOptions.safeParse(params);
    const sort = validateSortOptions.safeParse(params);

    if (!pagination.success) return createValidationError(pagination.error.format()._errors[0], pagination.error.errors);
    if (!sort.success) return createValidationError(sort.error.format()._errors[0], sort.error.errors);
    if (params.songCount == null) return createValidationError('Song count is required');
    if (params.albumCount == null) return createValidationError('Album count is required');
    if (params.songCount < 0) return createValidationError('Song count must be a non-negative number');
    if (params.albumCount < 0) return createValidationError('Album count must be a non-negative number');

    return await saavnApi.getArtistById({
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
 * const result = await saavnGetArtistDetailsByLink({ link: 'https://www.saavn.com/artist/xyz', page: 0, songCount: 10, albumCount: 5, sortBy: 'latest', sortOrder: 'desc' });
 */
export const saavnGetArtistDetailsByLink = async (
    params: { link: string; songCount: number; albumCount: number } & PaginationOptions & SortOptions
) => {
    if (!params.link) return createValidationError('Link is required');
    const pagination = validatePaginationOptions.safeParse(params);
    const sort = validateSortOptions.safeParse(params);

    if (!pagination.success) return createValidationError(pagination.error.format()._errors[0]);
    if (!sort.success) return createValidationError(sort.error.format()._errors[0]);
    if (params.songCount == null) return createValidationError('Song count is required');
    if (params.albumCount == null) return createValidationError('Album count is required');
    if (params.songCount < 0) return createValidationError('Song count must be a non-negative number');
    if (params.albumCount < 0) return createValidationError('Album count must be a non-negative number');

    return await saavnApi.getArtistByLink({
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
    if (!params.id) return createValidationError('ID is required');
    const pagination = validatePaginationOptions.safeParse(params);
    const sort = validateSortOptions.safeParse(params);

    if (!pagination.success) return createValidationError(pagination.error.format()._errors[0], pagination.error.errors);
    if (!sort.success) return createValidationError(sort.error.format()._errors[0], sort.error.errors);

    return await saavnApi.getArtistSongs({
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
    if (!params.id) return createValidationError('ID is required');
    const pagination = validatePaginationOptions.safeParse(params);
    const sort = validateSortOptions.safeParse(params);

    if (!pagination.success) return createValidationError(pagination.error.format()._errors[0], pagination.error.errors);
    if (!sort.success) return createValidationError(sort.error.format()._errors[0], sort.error.errors);

    return await saavnApi.getArtistAlbums({
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
    if (!params.id) return createValidationError('ID is required');
    const pagination = validatePaginationOptions.safeParse(params);

    if (!pagination.success) return createValidationError(pagination.error.format()._errors[0], pagination.error.errors);

    return await saavnApi.getPlaylistById({
        ...pagination.data,
        id: params.id,
    });
};

/**
 * Get playlist details from a link.
 * @example
 * const result = await saavnGetPlaylistDetailsByLink({ link: 'https://www.saavn.com/playlist/xyz', page: 0, limit: 10 });
 */
export const saavnGetPlaylistDetailsByLink = async (params: { link: string } & PaginationOptions) => {
    if (!params.link) return createValidationError('Link is required');
    const pagination = validatePaginationOptions.safeParse(params);

    if (!pagination.success) return createValidationError(pagination.error.format()._errors[0], pagination.error.errors);

    return await saavnApi.getPlaylistByLink({
        ...pagination.data,
        link: params.link,
    });
};

/**
 * Fetches tracks or songs from Saavn based on the entity type and ID.
 *
 * @example
 * // Fetch tracks from an album
 * const result = await saavnGetEntityTracks('album123', 'album');
 */
export const saavnGetEntityTracks = async (id: string, type: 'album' | 'playlist' | 'artist' | 'track') => {
    if (!id || !type) return createValidationError('ID and type are required');

    try {
        let result;
        switch (type) {
            case 'album': {
                const res = await saavnApi.getAlbumById(id);
                if (!res.success || !res.payload.songs) throw new Error(res.message || 'Failed to fetch album tracks');
                result = createSuccess('Album tracks fetched successfully', res.payload.songs);
                break;
            }
            case 'playlist': {
                const res = await saavnApi.getPlaylistById({ id, page: 0, limit: 1000 });
                if (!res.success || !res.payload.songs) throw new Error(res.message || 'Failed to fetch playlist tracks');
                result = createSuccess('Playlist tracks fetched successfully', res.payload.songs);
                break;
            }
            case 'artist': {
                const res = await saavnApi.getArtistSongs({ id, page: 0, sortBy: 'popularity', sortOrder: 'desc' });
                if (!res.success || !res.payload.songs) throw new Error(res.message || 'Failed to fetch artist songs');
                result = createSuccess('Artist songs fetched successfully', res.payload.songs);
                break;
            }
            case 'track': {
                const res = await saavnApi.getSongByIds(id);
                if (!res.success || !res.payload || res.payload.length === 0) throw new Error(res.message || 'Failed to fetch track');
                result = createSuccess('Track fetched successfully', res.payload);
                break;
            }
            default:
                return createValidationError('Invalid type provided');
        }
        return result;
    } catch (err) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred';
        return createError(message);
    }
};
