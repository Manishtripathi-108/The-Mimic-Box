import spotifyApiRoutes from '@/constants/external-routes/spotify.routes';
import spotifyConfig from '@/lib/config/spotify.config';
import { T_SpotifyRemove } from '@/lib/types/common.types';
import { T_SpotifyPaging, T_SpotifyPlaylist, T_SpotifyPlaylistTrack, T_SpotifySimplifiedPlaylist } from '@/lib/types/spotify.types';
import { chunkArray } from '@/lib/utils/core.utils';
import { createError, createSuccess, createValidationError } from '@/lib/utils/createResponse.utils';
import { safeAwait } from '@/lib/utils/safeAwait.utils';
import { withAuthHeader } from '@/lib/utils/server.utils';

/**
 * Service: Fetch details for a single Spotify playlist by playlist ID.
 */
export const getPlaylist = async (accessToken: string, playlistId: string) => {
    const headers = withAuthHeader(accessToken);
    const [error, response] = await safeAwait(spotifyConfig.get<T_SpotifyPlaylist>(spotifyApiRoutes.playlists.getPlaylist(playlistId), { headers }));

    return error || !response
        ? createError('Failed to fetch playlist details', { error })
        : createSuccess('Playlist details fetched successfully!', response.data);
};

/**
 * Service: Fetch tracks for a specific Spotify playlist by playlist ID.
 */
export const getPlaylistItems = async (accessToken: string, playlistId: string, limit?: number) => {
    const headers = withAuthHeader(accessToken);
    const [error, response] = await safeAwait(
        spotifyConfig.get<T_SpotifyPaging<T_SpotifyPlaylistTrack>>(spotifyApiRoutes.playlists.getPlaylistItems(playlistId), {
            headers,
            params: limit !== undefined ? { limit } : undefined,
        })
    );

    return error || !response
        ? createError('Failed to fetch playlist tracks', { error })
        : createSuccess('Playlist tracks fetched successfully!', response.data);
};

/**
 * Service: Fetch playlists for a specific Spotify user by user ID.
 */
export const getUserPlaylists = async (accessToken: string, userId: string) => {
    const headers = withAuthHeader(accessToken);
    const [error, response] = await safeAwait(
        spotifyConfig.get<T_SpotifyPaging<T_SpotifySimplifiedPlaylist>>(spotifyApiRoutes.playlists.getUserPlaylists(userId), { headers })
    );

    return error || !response
        ? createError('Failed to fetch user playlists', { error })
        : createSuccess('User playlists fetched successfully!', response.data);
};

/**
 * Service: Fetch playlists for the current Spotify user.
 */
export const getMyPlaylists = async (accessToken: string) => {
    const headers = withAuthHeader(accessToken);
    const [error, response] = await safeAwait(
        spotifyConfig.get<T_SpotifyPaging<T_SpotifySimplifiedPlaylist>>(spotifyApiRoutes.playlists.getMyPlaylists(), { headers })
    );

    return error || !response
        ? createError('Failed to fetch current user playlists', { error })
        : createSuccess('Current user playlists fetched successfully!', response.data);
};

/**
 * Service: Update a Spotify playlist by playlist ID.
 */
export const changeDetails = async (
    accessToken: string,
    playlistId: string,
    data: {
        name?: string;
        description?: string;
        public?: boolean;
        collaborative?: boolean;
    }
) => {
    const headers = withAuthHeader(accessToken);
    const [error, response] = await safeAwait(
        spotifyConfig.put<T_SpotifyPlaylist>(spotifyApiRoutes.playlists.changePlaylistDetails(playlistId), data, { headers })
    );

    return error || !response
        ? createError('Failed to change playlist details', { error })
        : createSuccess('Playlist details changed successfully!', response.data);
};

/**
 * Service: Replace items in a Spotify playlist by playlist ID.
 */
export const replaceItems = async (
    accessToken: string,
    playlistId: string,
    data: {
        uris: string[];
        range_start?: number;
        range_length?: number;
        snapshot_id?: string;
        range_before?: number;
    }
) => {
    const uris = data.uris?.filter(Boolean) ?? [];
    if (!uris.length) return createValidationError('No URIs provided to replace playlist items.');

    const headers = withAuthHeader(accessToken);
    const chunks = chunkArray(uris, 100);

    // Single request fast-path
    if (chunks.length === 1) {
        const [error, response] = await safeAwait(
            spotifyConfig.put<{ snapshot_id: string }>(spotifyApiRoutes.playlists.replaceItems(playlistId), { ...data, uris: chunks[0] }, { headers })
        );
        return error || !response
            ? createError('Failed to replace playlist items', { error })
            : createSuccess('Playlist items replaced successfully!', response.data);
    }

    const results = await Promise.all(
        chunks.map(async (chunk) => {
            const [error, response] = await safeAwait(
                spotifyConfig.put<{ snapshot_id: string }>(spotifyApiRoutes.playlists.replaceItems(playlistId), { ...data, uris: chunk }, { headers })
            );
            return error || !response
                ? createError('Failed to replace playlist items', { error })
                : createSuccess('Playlist items replaced successfully!', response.data);
        })
    );

    const failed = results.find((r) => !r?.success);
    return failed ? createError('Failed to replace playlist items', { error: failed.error }) : createSuccess('Playlist items replaced successfully!');
};

/**
 * Service: Add items to a Spotify playlist by playlist ID.
 */
export const addItems = async (accessToken: string, playlistId: string, data: { uris: string[]; position?: number }) => {
    const uris = data.uris?.filter(Boolean) ?? [];
    if (!uris.length) return createValidationError('No URIs provided to add to playlist.');
    if (data.position && data.position < 0) return createValidationError('Invalid track position.');

    const headers = withAuthHeader(accessToken);
    const chunks = chunkArray(uris, 100);

    // Single request fast-path
    if (chunks.length === 1) {
        const [error, response] = await safeAwait(
            spotifyConfig.post<{ snapshot_id: string }>(spotifyApiRoutes.playlists.addItems(playlistId), { ...data, uris: chunks[0] }, { headers })
        );
        return error || !response
            ? createError('Failed to add items to playlist', { error })
            : createSuccess('Items added to playlist successfully!', response.data);
    }

    const results = await Promise.all(
        chunks.map(async (chunk) => {
            const [error, response] = await safeAwait(
                spotifyConfig.post<{ snapshot_id: string }>(spotifyApiRoutes.playlists.addItems(playlistId), { ...data, uris: chunk }, { headers })
            );
            return error || !response
                ? createError('Failed to add items to playlist', { error })
                : createSuccess('Items added to playlist successfully!', response.data);
        })
    );

    const failed = results.find((r) => !r?.success);
    return failed ? createError('Failed to add items to playlist', { error: failed.error }) : createSuccess('Items added to playlist successfully!');
};

/**
 * Service: Remove items from a Spotify playlist by playlist ID.
 */
export const removeItems = async (accessToken: string, playlistId: string, data: T_SpotifyRemove['data']) => {
    if (!data.tracks?.length) return createValidationError('No tracks provided to remove from playlist.');

    const headers = withAuthHeader(accessToken);

    // Collect "same-id" URIs to add back (deduped via Set)
    const addBackUris = new Set(data.tracks.filter((t) => t.isSameId === true).map((t) => t.uri));

    const chunks = chunkArray(data.tracks, 100);

    // Single request fast-path
    if (chunks.length === 1) {
        const [error, response] = await safeAwait(
            spotifyConfig.delete<{ snapshot_id: string }>(spotifyApiRoutes.playlists.removeItems(playlistId), {
                data: { tracks: chunks[0], snapshot_id: data.snapshot_id },
                headers,
            })
        );
        if (error || !response) {
            return createError('Failed to remove items from playlist', { error });
        }
        if (addBackUris.size) {
            await addItems(accessToken, playlistId, { uris: [...addBackUris] });
        }
        return createSuccess('Items removed from playlist successfully!', response.data);
    }

    const results = await Promise.all(
        chunks.map(async (chunk) => {
            const [error, response] = await safeAwait(
                spotifyConfig.delete<{ snapshot_id: string }>(spotifyApiRoutes.playlists.removeItems(playlistId), {
                    data: { tracks: chunk, snapshot_id: data.snapshot_id },
                    headers,
                })
            );
            return error || !response
                ? createError('Failed to remove items from playlist', { error })
                : createSuccess('Items removed from playlist successfully!', response.data);
        })
    );

    const failed = results.find((r) => !r?.success);
    if (failed) return createError('Failed to remove items from playlist', { error: failed.error });

    if (addBackUris.size) {
        await addItems(accessToken, playlistId, { uris: [...addBackUris] });
    }

    return createSuccess('Items removed from playlist successfully!');
};

/**
 * Service: Create a new Spotify playlist for a user.
 */
export const createPlaylist = async (
    accessToken: string,
    userId: string,
    data: { name: string; description?: string; public?: boolean; collaborative?: boolean }
) => {
    const headers = withAuthHeader(accessToken);
    const [error, response] = await safeAwait(
        spotifyConfig.post<T_SpotifyPlaylist>(spotifyApiRoutes.playlists.createPlaylist(userId), data, { headers })
    );
    return error || !response ? createError('Failed to create playlist', { error }) : createSuccess('Playlist created successfully!', response.data);
};

/**
 * Spotify Playlist Services: Collection of all Spotify playlist-related service functions.
 */
const spotifyPlaylistServices = {
    getPlaylist,
    getPlaylistItems,
    getUserPlaylists,
    getMyPlaylists,
    addItems,
    removeItems,
    changeDetails,
    replaceItems,
    createPlaylist,
} as const;

export default spotifyPlaylistServices;
