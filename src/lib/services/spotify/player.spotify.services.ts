import spotifyApiRoutes from '@/constants/external-routes/spotify.routes';
import spotifyConfig from '@/lib/config/spotify.config';
import { T_SpotifyRecentlyPlayed } from '@/lib/types/spotify.types';
import { createError, createSuccess } from '@/lib/utils/createResponse.utils';
import { safeAwait } from '@/lib/utils/safeAwait.utils';
import { withAuthHeader } from '@/lib/utils/server.utils';

/**
 * Service: Fetch the current user's recently played tracks from Spotify.
 */
export const getRecentTracks = async (accessToken: string, limit?: number, after?: number, before?: number) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<T_SpotifyRecentlyPlayed>(spotifyApiRoutes.player.getRecentlyPlayedTracks(), {
            headers: withAuthHeader(accessToken),
            params: { limit, after, before },
        })
    );

    return error || !response
        ? createError('Failed to fetch recently played tracks', { error })
        : createSuccess('Recently played tracks fetched successfully!', response.data);
};

/**
 * Service: Fetch the current user's Spotify player state.
 */
const spotifyPlayerServices = {
    getRecentTracks,
} as const;

export default spotifyPlayerServices;
