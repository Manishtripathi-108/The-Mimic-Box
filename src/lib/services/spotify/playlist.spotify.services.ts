import spotifyApiRoutes from '@/constants/external-routes/spotify.routes';
import spotifyConfig from '@/lib/config/spotify.config';
import { T_SpotifyRemove } from '@/lib/types/common.types';
import { T_SpotifyPaging, T_SpotifyPlaylist, T_SpotifyPlaylistTrack, T_SpotifySimplifiedPlaylist } from '@/lib/types/spotify.types';
import { chunkArray } from '@/lib/utils/core.utils';
import { createErrorReturn, createSuccessReturn } from '@/lib/utils/createResponse.utils';
import { safeAwait } from '@/lib/utils/safeAwait.utils';
import { withAuthHeader } from '@/lib/utils/server.utils';

/**
 * Service: Fetch details for a single Spotify playlist by playlist ID.
 */
export const getPlaylist = async (accessToken: string, playlistId: string) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<T_SpotifyPlaylist>(spotifyApiRoutes.playlists.getPlaylist(playlistId), { headers: withAuthHeader(accessToken) })
    );

    return error || !response
        ? createErrorReturn('Failed to fetch playlist details', error)
        : createSuccessReturn('Playlist details fetched successfully!', response.data);
};

/**
 * Service: Fetch tracks for a specific Spotify playlist by playlist ID.
 */
export const getPlaylistItems = async (accessToken: string, playlistId: string, limit?: number) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<T_SpotifyPaging<T_SpotifyPlaylistTrack>>(spotifyApiRoutes.playlists.getPlaylistItems(playlistId), {
            headers: withAuthHeader(accessToken),
            params: { limit },
        })
    );

    return error
        ? createErrorReturn('Failed to fetch playlist tracks', error)
        : createSuccessReturn('Playlist tracks fetched successfully!', response.data);
};

/**
 * Service: Fetch playlists for a specific Spotify user by user ID.
 */
export const getUserPlaylists = async (accessToken: string, userId: string) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<T_SpotifyPaging<T_SpotifySimplifiedPlaylist>>(spotifyApiRoutes.playlists.getUserPlaylists(userId), {
            headers: withAuthHeader(accessToken),
        })
    );

    return error || !response
        ? createErrorReturn('Failed to fetch user playlists', error)
        : createSuccessReturn('User playlists fetched successfully!', response.data);
};

/**
 * Service: Fetch playlists for the current Spotify user.
 */
export const getMyPlaylists = async (accessToken: string) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<T_SpotifyPaging<T_SpotifySimplifiedPlaylist>>(spotifyApiRoutes.playlists.getMyPlaylists(), {
            headers: withAuthHeader(accessToken),
        })
    );

    return error || !response
        ? createErrorReturn('Failed to fetch current user playlists', error)
        : createSuccessReturn('Current user playlists fetched successfully!', response.data);
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
    const [error, response] = await safeAwait(
        spotifyConfig.put<T_SpotifyPlaylist>(spotifyApiRoutes.playlists.changePlaylistDetails(playlistId), data, {
            headers: withAuthHeader(accessToken),
        })
    );

    return error || !response
        ? createErrorReturn('Failed to change playlist details', error)
        : createSuccessReturn('Playlist details changed successfully!', response.data);
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
    if (!data.uris || data.uris.length === 0) {
        return createErrorReturn('No URIs provided to replace playlist items.');
    }

    const chunks = chunkArray(data.uris, 100);

    const promises = chunks.map(async (chunk) => {
        const chunkData = { ...data, uris: chunk };
        const [error, response] = await safeAwait(
            spotifyConfig.put<{ snapshot_id: string }>(spotifyApiRoutes.playlists.replaceItems(playlistId), chunkData, {
                headers: withAuthHeader(accessToken),
            })
        );

        if (error || !response) {
            return createErrorReturn('Failed to replace playlist items', error);
        }

        return createSuccessReturn('Playlist items replaced successfully!', response.data);
    });

    const results = await Promise.all(promises);

    if (results.some((result) => !result?.success)) {
        return createErrorReturn('Failed to replace playlist items', results.find((result) => !result?.success)?.error);
    }

    return createSuccessReturn('Playlist items replaced successfully!');
};

/**
 * Service: Add items to a Spotify playlist by playlist ID.
 */
export const addItems = async (accessToken: string, playlistId: string, data: { uris: string[]; position?: number }) => {
    if (!data.uris || data.uris.length === 0) {
        return createErrorReturn('No URIs provided to add to playlist.');
    }

    const chunks = chunkArray(data.uris, 100);

    const promises = chunks.map(async (chunk) => {
        const chunkData = { ...data, uris: chunk };
        const [error, response] = await safeAwait(
            spotifyConfig.post<{ snapshot_id: string }>(spotifyApiRoutes.playlists.addItems(playlistId), chunkData, {
                headers: withAuthHeader(accessToken),
            })
        );
        if (error || !response) {
            return createErrorReturn('Failed to add items to playlist', error);
        }
        return createSuccessReturn('Items added to playlist successfully!', response.data);
    });

    const results = await Promise.all(promises);
    if (results.some((result) => !result?.success)) {
        return createErrorReturn('Failed to add items to playlist', results.find((result) => !result?.success)?.error);
    }
    return createSuccessReturn('Items added to playlist successfully!');
};

/**
 * Service: Remove items from a Spotify playlist by playlist ID.
 */
export const removeItems = async (accessToken: string, playlistId: string, data: T_SpotifyRemove['data']) => {
    if (!data.tracks || data.tracks.length === 0) {
        return createErrorReturn('No tracks provided to remove from playlist.');
    }
    const chunks = chunkArray(data.tracks, 100);

    const promises = chunks.map(async (chunk) => {
        const [error, response] = await safeAwait(
            spotifyConfig.delete<{ snapshot_id: string }>(spotifyApiRoutes.playlists.removeItems(playlistId), {
                data: { tracks: chunk, snapshot_id: data.snapshot_id },
                headers: withAuthHeader(accessToken),
            })
        );

        if (error || !response) {
            return createErrorReturn('Failed to remove items from playlist', error);
        }

        return createSuccessReturn('Items removed from playlist successfully!', response.data);
    });

    const results = await Promise.all(promises);
    if (results.some((result) => !result?.success)) {
        return createErrorReturn('Failed to remove items from playlist', results.find((result) => !result?.success)?.error);
    }

    return createSuccessReturn('Items removed from playlist successfully!');
};

/**
 * Service: Create a new Spotify playlist for a user.
 */
export const createPlaylist = async (
    accessToken: string,
    userId: string,
    data: { name: string; description?: string; public?: boolean; collaborative?: boolean }
) => {
    const [error, response] = await safeAwait(
        spotifyConfig.post<T_SpotifyPlaylist>(spotifyApiRoutes.playlists.createPlaylist(userId), data, {
            headers: withAuthHeader(accessToken),
        })
    );
    return error || !response
        ? createErrorReturn('Failed to create playlist', error)
        : createSuccessReturn('Playlist created successfully!', response.data);
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
