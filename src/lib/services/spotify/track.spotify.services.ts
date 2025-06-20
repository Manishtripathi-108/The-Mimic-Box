import spotifyApiRoutes from '@/constants/external-routes/spotify.routes';
import spotifyConfig from '@/lib/config/spotify.config';
import { T_SpotifyTrack } from '@/lib/types/spotify.types';
import { createErrorReturn, createSuccessReturn } from '@/lib/utils/createResponse.utils';
import { safeAwait } from '@/lib/utils/safeAwait.utils';
import { withAuthHeader } from '@/lib/utils/server.utils';

/**
 * Service: Fetch details for a single Spotify track by track ID.
 */
export const getTrack = async (accessToken: string, trackId: string) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<T_SpotifyTrack>(spotifyApiRoutes.tracks.getTrack(trackId), { headers: withAuthHeader(accessToken) })
    );

    return error || !response
        ? createErrorReturn('Failed to fetch track details', error)
        : createSuccessReturn('Track details fetched successfully!', response.data);
};

/**
 * Service: Fetch details for multiple Spotify tracks by an array of track IDs.
 */
export const getTracks = async (accessToken: string, trackIds: string[]) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<{ tracks: T_SpotifyTrack[] }>(spotifyApiRoutes.tracks.getTracks(trackIds), { headers: withAuthHeader(accessToken) })
    );

    return error || !response
        ? createErrorReturn('Failed to fetch multiple track details', error)
        : createSuccessReturn('Multiple track details fetched successfully!', response.data.tracks);
};

/**
 * Service: Fetch the current user's saved tracks from Spotify.
 */
export const getMyTracks = async (accessToken: string, limit?: number, offset?: number) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<{ items: { track: T_SpotifyTrack }[] }>(spotifyApiRoutes.tracks.getMySavedTracks(), {
            headers: withAuthHeader(accessToken),
            params: { limit, offset },
        })
    );

    return error || !response
        ? createErrorReturn('Failed to fetch saved tracks', error)
        : createSuccessReturn(
              'Saved tracks fetched successfully!',
              response.data.items.map((item) => item.track)
          );
};

/**
 * Service: Save one or more tracks to the current user's Spotify library.
 */
export const saveTracks = async (accessToken: string, trackIds: string[]) => {
    const chunks = trackIds.reduce<string[][]>(
        (acc, _, i) => (i % 50 === 0 ? acc.push([trackIds[i]]) : acc[acc.length - 1].push(trackIds[i]), acc),
        []
    );

    const promises = chunks.map(async (chunk) => {
        const [error, response] = await safeAwait(
            spotifyConfig.put(spotifyApiRoutes.tracks.saveTracks(chunk), { headers: withAuthHeader(accessToken) })
        );

        if (error || !response) {
            return createErrorReturn('Failed to save tracks', error);
        }
    });

    const results = await Promise.all(promises);

    if (results.some((result) => result?.error)) {
        return createErrorReturn('Failed to save tracks', results.find((result) => result?.error)?.error);
    }

    return createSuccessReturn('Tracks saved successfully!');
};

/**
 * Service: Remove one or more tracks from the current user's Spotify library.
 */
export const removeTracks = async (accessToken: string, trackIds: string[]) => {
    const chunks = trackIds.reduce<string[][]>(
        (acc, _, i) => (i % 50 === 0 ? acc.push([trackIds[i]]) : acc[acc.length - 1].push(trackIds[i]), acc),
        []
    );

    const promises = chunks.map(async (chunk) => {
        const [error, response] = await safeAwait(
            spotifyConfig.delete(spotifyApiRoutes.tracks.removeTracks(chunk), { headers: withAuthHeader(accessToken) })
        );

        if (error || !response) {
            return createErrorReturn('Failed to remove tracks', error);
        }

        return createSuccessReturn('Tracks removed successfully!');
    });

    const results = await Promise.all(promises);

    if (results.some((result) => !result?.success)) {
        return createErrorReturn('Failed to remove tracks', results.find((result) => !result?.success)?.error);
    }

    return createSuccessReturn('Tracks removed successfully!');
};

/**
 * Service: Check if one or more tracks are saved in the current user's Spotify library.
 */
export const checkSavedTracks = async (accessToken: string, trackIds: string[]) => {
    const chunks = trackIds.reduce<string[][]>(
        (acc, _, i) => (i % 50 === 0 ? acc.push([trackIds[i]]) : acc[acc.length - 1].push(trackIds[i]), acc),
        []
    );

    const promises = chunks.map(async (chunk) => {
        const [error, response] = await safeAwait(
            spotifyConfig.get<boolean[]>(spotifyApiRoutes.tracks.checkSavedTracks(chunk), { headers: withAuthHeader(accessToken) })
        );

        if (error || !response) {
            return createErrorReturn<Error | Record<string, unknown>>('Failed to check saved tracks', error);
        }

        return createSuccessReturn('Saved tracks checked successfully!', response.data);
    });

    const results = await Promise.all(promises);

    if (results.some((result) => !result?.success)) {
        return createErrorReturn('Failed to check saved tracks', results.find((result) => !result?.success)?.error);
    }

    return createSuccessReturn(
        'All checks completed successfully!',
        results.flatMap((result) => result.success && result.payload)
    );
};

/**
 * Spotify Track Services: Collection of all Spotify track-related service functions.
 */
const spotifyTrackServices = {
    getTrack,
    getTracks,
    getMyTracks,
    saveTracks,
    removeTracks,
    checkSavedTracks,
} as const;

export default spotifyTrackServices;
