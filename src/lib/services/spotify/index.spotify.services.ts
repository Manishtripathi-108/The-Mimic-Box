import { AxiosRequestConfig } from 'axios';

import spotifyConfig from '@/lib/config/spotify.config';
import spotifyAlbumServices from '@/lib/services/spotify/album.spotify.services';
import spotifyArtistServices from '@/lib/services/spotify/artist.spotify.services';
import spotifyPlayerServices from '@/lib/services/spotify/player.spotify.services';
import spotifyPlaylistServices from '@/lib/services/spotify/playlist.spotify.services';
import spotifyTrackServices from '@/lib/services/spotify/track.spotify.services';
import spotifyUserServices from '@/lib/services/spotify/user.spotify.services';
import { safeAwait } from '@/lib/utils/safeAwait.utils';
import { withAuthHeader } from '@/lib/utils/server.utils';

/**
 * Fetches Spotify data using the given `token` and `reqConfig`.
 * Will return the response data if the request is successful, otherwise an error.
 */
export const fetchSpotifyData = async <T>({
    token,
    ...reqConfig
}: AxiosRequestConfig & { token: string }): Promise<[Record<string, unknown> | Error, null] | [null, T]> => {
    const headers = { ...reqConfig.headers, ...withAuthHeader(token) };
    const [error, response] = await safeAwait(spotifyConfig<T>({ ...reqConfig, headers }));

    return error || !response ? [error, null] : [null, response.data];
};

/**
 * Main export for Spotify services.
 * This object aggregates all individual Spotify service modules.
 */
const spotifyServices = {
    fetchSpotifyData,
    albums: spotifyAlbumServices,
    artists: spotifyArtistServices,
    player: spotifyPlayerServices,
    playlists: spotifyPlaylistServices,
    tracks: spotifyTrackServices,
    users: spotifyUserServices,
} as const;

export default spotifyServices;
