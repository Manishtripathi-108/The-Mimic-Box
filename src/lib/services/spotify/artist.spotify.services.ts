import spotifyApiRoutes from '@/constants/external-routes/spotify.routes';
import spotifyConfig from '@/lib/config/spotify.config';
import { T_SpotifyArtist, T_SpotifyPaging, T_SpotifySimplifiedAlbum, T_SpotifyTrack } from '@/lib/types/spotify.types';
import { createError, createSuccess } from '@/lib/utils/createResponse.utils';
import { safeAwait } from '@/lib/utils/safeAwait.utils';
import { withAuthHeader } from '@/lib/utils/server.utils';

/**
 * Service: Fetch details for a single Spotify artist by artist ID.
 */
export const getArtist = async (accessToken: string, artistId: string) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<T_SpotifyArtist>(spotifyApiRoutes.artists.getArtist(artistId), { headers: withAuthHeader(accessToken) })
    );

    return error || !response
        ? createError('Failed to fetch artist details', { error })
        : createSuccess('Artist details fetched successfully!', response.data);
};

/**
 * Service: Fetch details for multiple Spotify artists by an array of artist IDs.
 */
export const getArtists = async (accessToken: string, artistIds: string[]) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<{ artists: T_SpotifyArtist[] }>(spotifyApiRoutes.artists.getArtists(artistIds), {
            headers: withAuthHeader(accessToken),
        })
    );

    return error || !response
        ? createError('Failed to fetch multiple artist details', { error })
        : createSuccess('Multiple artist details fetched successfully!', response.data.artists);
};

/**
 * Service: Fetch the top tracks for a specific Spotify artist by artist ID.
 */
export const getArtistTopTracks = async (accessToken: string, artistId: string, country?: string) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<{ tracks: T_SpotifyTrack[] }>(spotifyApiRoutes.artists.getArtistTopTracks(artistId, country), {
            headers: withAuthHeader(accessToken),
        })
    );

    return error || !response
        ? createError('Failed to fetch artist top tracks', { error })
        : createSuccess('Artist top tracks fetched successfully!', response.data.tracks);
};

/**
 * Service: Fetch albums for a specific Spotify artist by artist ID.
 */
export const getArtistAlbums = async (accessToken: string, artistId: string, limit?: number) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<T_SpotifyPaging<T_SpotifySimplifiedAlbum>>(spotifyApiRoutes.artists.getArtistAlbums(artistId), {
            headers: withAuthHeader(accessToken),
            params: { limit },
        })
    );

    return error || !response
        ? createError('Failed to fetch artist albums', { error })
        : createSuccess('Artist albums fetched successfully!', response.data);
};

/**
 * Spotify Artist Services: Collection of all Spotify artist-related service functions.
 */
const spotifyArtistServices = {
    getArtist,
    getArtists,
    getArtistTopTracks,
    getArtistAlbums,
} as const;

export default spotifyArtistServices;
