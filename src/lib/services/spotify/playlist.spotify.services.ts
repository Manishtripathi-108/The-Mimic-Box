import spotifyApiRoutes from '@/constants/external-routes/spotify.routes';
import spotifyConfig from '@/lib/config/spotify.config';
import { T_SpotifyPaging, T_SpotifyPlaylist, T_SpotifyPlaylistTrack, T_SpotifySimplifiedPlaylist } from '@/lib/types/spotify.types';
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
 * Spotify Playlist Services: Collection of all Spotify playlist-related service functions.
 */
const spotifyPlaylistServices = {
    getPlaylist,
    getPlaylistItems,
    getUserPlaylists,
    getMyPlaylists,
} as const;

export default spotifyPlaylistServices;
