import spotifyApiRoutes from '@/constants/external-routes/spotify.routes';
import spotifyConfig from '@/lib/config/spotify.config';
import { T_SpotifyAlbum, T_SpotifyPaging, T_SpotifySimplifiedTrack } from '@/lib/types/spotify.types';
import { createError, createSuccess } from '@/lib/utils/createResponse.utils';
import { safeAwait } from '@/lib/utils/safeAwait.utils';
import { withAuthHeader } from '@/lib/utils/server.utils';

/**
 * Service: Fetch details for a single Spotify album by album ID.
 */
export const getAlbum = async (accessToken: string, albumId: string) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<T_SpotifyAlbum>(spotifyApiRoutes.albums.getAlbum(albumId), { headers: withAuthHeader(accessToken) })
    );

    return error || !response
        ? createError('Failed to fetch album details', { error })
        : createSuccess('Album details fetched successfully!', response.data);
};

/**
 * Service: Fetch details for multiple Spotify albums by an array of album IDs.
 */
export const getAlbums = async (accessToken: string, albumIds: string[]) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<{ albums: T_SpotifyAlbum[] }>(spotifyApiRoutes.albums.getAlbums(albumIds), {
            headers: withAuthHeader(accessToken),
        })
    );

    return error || !response
        ? createError('Failed to fetch album details', { error })
        : createSuccess('Album details fetched successfully!', {
              albums: response.data.albums,
          });
};

/**
 * Service: Fetch tracks for a specific Spotify album by album ID.
 */
export const getAlbumTracks = async (accessToken: string, albumId: string, limit?: number) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<T_SpotifyPaging<T_SpotifySimplifiedTrack>>(spotifyApiRoutes.albums.getAlbumTracks(albumId), {
            headers: withAuthHeader(accessToken),
            params: { limit },
        })
    );
    return error || !response
        ? createError('Failed to fetch album tracks', { error })
        : createSuccess('Album tracks fetched successfully!', response.data);
};

/**
 * Service: Fetch the current user's saved albums from Spotify.
 */
export const getUserAlbums = async (accessToken: string, limit?: number) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<T_SpotifyPaging<T_SpotifyAlbum>>(spotifyApiRoutes.albums.getMySavedAlbums(), {
            headers: withAuthHeader(accessToken),
            params: { limit },
        })
    );

    return error || !response
        ? createError('Failed to fetch  user albums', { error })
        : createSuccess(' user albums fetched successfully!', response.data);
};

/**
 * Service: Save one or more albums to the current user's Spotify library.
 */
export const saveAlbums = async (accessToken: string, albumIds: string[]) => {
    const [error, response] = await safeAwait(
        spotifyConfig.put(spotifyApiRoutes.albums.saveAlbums(albumIds), {}, { headers: withAuthHeader(accessToken) })
    );

    return error || !response ? createError('Failed to save album for  user', { error }) : createSuccess('Album saved successfully!', response.data);
};

/**
 * Service: Remove one or more albums from the current user's Spotify library.
 */
export const removeAlbums = async (accessToken: string, albumIds: string[]) => {
    const [error, response] = await safeAwait(
        spotifyConfig.delete(spotifyApiRoutes.albums.removeAlbums(albumIds), { headers: withAuthHeader(accessToken) })
    );

    return error || !response
        ? createError('Failed to remove album for  user', { error })
        : createSuccess('Album removed successfully!', response.data);
};

/**
 * Service: Check if one or more albums are saved in the current user's Spotify library.
 */
export const checkSavedAlbums = async (accessToken: string, albumIds: string[]) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<boolean>(spotifyApiRoutes.albums.checkSavedAlbums(albumIds), { headers: withAuthHeader(accessToken) })
    );

    return error || !response
        ? createError('Failed to check if album is saved for  user', { error })
        : createSuccess('Album saved status checked successfully!', response.data);
};

/**
 * Service: Fetch new album releases from Spotify.
 */
export const getNewReleases = async (accessToken: string, limit?: number) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<T_SpotifyPaging<T_SpotifyAlbum>>(spotifyApiRoutes.albums.getNewReleases(), {
            headers: withAuthHeader(accessToken),
            params: { limit },
        })
    );
    return error || !response
        ? createError('Failed to fetch new releases', { error })
        : createSuccess('New releases fetched successfully!', response.data);
};

/**
 * Spotify Album Services: Collection of all Spotify album-related service functions.
 */
const spotifyAlbumServices = {
    getAlbum,
    getAlbums,
    getAlbumTracks,
    getUserAlbums,
    saveAlbums,
    removeAlbums,
    checkSavedAlbums,
    getNewReleases,
} as const;

export default spotifyAlbumServices;
