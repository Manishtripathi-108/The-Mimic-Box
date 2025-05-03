import axios, { AxiosRequestConfig } from 'axios';

import { EXTERNAL_ROUTES } from '@/constants/routes.constants';
import spotifyConfig from '@/lib/config/spotify.config';
import {
    T_SpotifyAlbum,
    T_SpotifyArtist,
    T_SpotifyErrorResponse,
    T_SpotifyPaging,
    T_SpotifyPlaylist,
    T_SpotifyPrivateUser,
    T_SpotifyRecentlyPlayed,
    T_SpotifySimplifiedAlbum,
    T_SpotifySimplifiedPlaylist,
    T_SpotifyTrack,
} from '@/lib/types/spotify.types';
import { createErrorReturn, createSuccessReturn } from '@/lib/utils/createResponse.utils';
import { safeAwait } from '@/lib/utils/safeAwait.utils';

const withAuthHeader = (token: string): AxiosRequestConfig['headers'] => ({
    Authorization: `Bearer ${token}`,
});

/* -------------------------------------------------------------------------- */
/*                            Generic Spotify Fetcher                         */
/* -------------------------------------------------------------------------- */

export const fetchSpotifyData = async <T>({ token, ...reqConfig }: AxiosRequestConfig & { token: string }): Promise<[Error, null] | [null, T]> => {
    const headers = { ...reqConfig.headers, ...withAuthHeader(token) };
    const [error, response] = await safeAwait(spotifyConfig<T>({ ...reqConfig, headers }));

    return error || !response ? [error || new Error('No response'), null] : [null, response.data];
};

/* -------------------------------------------------------------------------- */
/*                                  User Scope                                */
/* -------------------------------------------------------------------------- */

export const getUserProfile = async (accessToken: string): Promise<[string | null, T_SpotifyPrivateUser | null]> => {
    const [error, data] = await safeAwait(
        spotifyConfig.get<T_SpotifyPrivateUser>(EXTERNAL_ROUTES.SPOTIFY.USER.PROFILE, { headers: withAuthHeader(accessToken) })
    );

    if (error || !data) {
        const message = axios.isAxiosError(error)
            ? ((error.response?.data as T_SpotifyErrorResponse)?.error?.message ?? 'Failed to fetch user profile')
            : 'Failed to fetch user profile';
        return [message, null];
    }

    return [null, data.data];
};

export const getUserPlaylists = async (accessToken: string, userId?: string) => {
    const url = userId ? EXTERNAL_ROUTES.SPOTIFY.PLAYLISTS(userId) : EXTERNAL_ROUTES.SPOTIFY.USER.PLAYLISTS;
    const [error, response] = await safeAwait(
        spotifyConfig.get<T_SpotifyPaging<T_SpotifySimplifiedPlaylist>>(url, { headers: withAuthHeader(accessToken) })
    );

    return error || !response
        ? createErrorReturn('Failed to fetch user playlists', error)
        : createSuccessReturn('User playlists fetched successfully!', response.data);
};

export const getUserRecentlyPlayedTracks = async (accessToken: string, limit?: number) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<T_SpotifyRecentlyPlayed>(EXTERNAL_ROUTES.SPOTIFY.USER.RECENTLY_PLAYED, {
            headers: withAuthHeader(accessToken),
            params: { limit },
        })
    );

    return error || !response
        ? createErrorReturn('Failed to fetch recently played tracks', error)
        : createSuccessReturn('Recently played tracks fetched successfully!', response.data);
};

export const getUserTopTracks = async (accessToken: string, limit?: number) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<T_SpotifyPaging<T_SpotifyTrack>>(EXTERNAL_ROUTES.SPOTIFY.USER.TOP_TRACKS, {
            headers: withAuthHeader(accessToken),
            params: { limit },
        })
    );

    return error || !response
        ? createErrorReturn('Failed to fetch top tracks', error)
        : createSuccessReturn('Top tracks fetched successfully!', response.data);
};

export const getUserTopArtists = async (accessToken: string, limit?: number) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<T_SpotifyPaging<T_SpotifyArtist>>(EXTERNAL_ROUTES.SPOTIFY.USER.TOP_ARTISTS, {
            headers: withAuthHeader(accessToken),
            params: { limit },
        })
    );

    return error || !response
        ? createErrorReturn('Failed to fetch top artists', error)
        : createSuccessReturn('Top artists fetched successfully!', response.data);
};

/* -------------------------------------------------------------------------- */
/*                                  Global Scope                              */
/* -------------------------------------------------------------------------- */

export const getPlaylistDetails = async (accessToken: string, playlistId: string) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<T_SpotifyPlaylist>(EXTERNAL_ROUTES.SPOTIFY.PLAYLISTS(playlistId), { headers: withAuthHeader(accessToken) })
    );

    return error || !response
        ? createErrorReturn('Failed to fetch playlist details', error)
        : createSuccessReturn('Playlist details fetched successfully!', response.data);
};

export const getTrackDetails = async (accessToken: string, trackId: string) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<T_SpotifyTrack>(EXTERNAL_ROUTES.SPOTIFY.TRACKS(trackId), { headers: withAuthHeader(accessToken) })
    );

    return error || !response
        ? createErrorReturn('Failed to fetch track details', error)
        : createSuccessReturn('Track details fetched successfully!', response.data);
};

export const getMultipleTracksDetails = async (accessToken: string, trackIds: string[]) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<{ tracks: T_SpotifyTrack[] }>(EXTERNAL_ROUTES.SPOTIFY.TRACKS(trackIds), { headers: withAuthHeader(accessToken) })
    );

    return error || !response
        ? createErrorReturn('Failed to fetch multiple track details', error)
        : createSuccessReturn('Multiple track details fetched successfully!', response.data.tracks);
};

export const getAlbumDetails = async (accessToken: string, albumId: string) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<T_SpotifyAlbum>(EXTERNAL_ROUTES.SPOTIFY.ALBUM(albumId), { headers: withAuthHeader(accessToken) })
    );

    return error || !response
        ? createErrorReturn('Failed to fetch album details', error)
        : createSuccessReturn('Album details fetched successfully!', response.data);
};

export const getArtistDetails = async (accessToken: string, artistId: string) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<T_SpotifyArtist>(EXTERNAL_ROUTES.SPOTIFY.ARTIST(artistId), { headers: withAuthHeader(accessToken) })
    );

    return error || !response
        ? createErrorReturn('Failed to fetch artist details', error)
        : createSuccessReturn('Artist details fetched successfully!', response.data);
};

export const getArtistTopTracks = async (accessToken: string, artistId: string) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<{ tracks: T_SpotifyTrack[] }>(EXTERNAL_ROUTES.SPOTIFY.ARTIST_TRACKS(artistId), {
            headers: withAuthHeader(accessToken),
        })
    );

    return error || !response
        ? createErrorReturn('Failed to fetch artist top tracks', error)
        : createSuccessReturn('Artist top tracks fetched successfully!', response.data.tracks);
};

export const getArtistAlbums = async (accessToken: string, artistId: string, limit?: number) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<T_SpotifyPaging<T_SpotifySimplifiedAlbum>>(EXTERNAL_ROUTES.SPOTIFY.ARTIST_ALBUMS(artistId), {
            headers: withAuthHeader(accessToken),
            params: { limit },
        })
    );

    return error || !response
        ? createErrorReturn('Failed to fetch artist albums', error)
        : createSuccessReturn('Artist albums fetched successfully!', response.data);
};

/* -------------------------------------------------------------------------- */
/*                                   Export                                   */
/* -------------------------------------------------------------------------- */

const spotifyApi = {
    fetchSpotifyData,
    getUserProfile,
    getUserPlaylists,
    getUserRecentlyPlayedTracks,
    getUserTopTracks,
    getUserTopArtists,
    getPlaylistDetails,
    getTrackDetails,
    getMultipleTracksDetails,
    getAlbumDetails,
    getArtistDetails,
    getArtistTopTracks,
    getArtistAlbums,
};

export default spotifyApi;
