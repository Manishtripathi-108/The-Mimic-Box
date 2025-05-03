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

export const fetchSpotifyData = async <T>({ token, ...reqConfig }: AxiosRequestConfig & { token: string }): Promise<[Error, null] | [null, T]> => {
    const reqConfigHeaders = { ...reqConfig.headers, Authorization: `Bearer ${token}` };

    const [error, response] = await safeAwait(spotifyConfig<T>({ ...reqConfig, headers: reqConfigHeaders }));

    if (error || !response) {
        return [error || new Error('No response'), null];
    }

    return [null, response.data];
};

/* -------------------------------------------------------------------------- */
/*                                    User                                    */
/* -------------------------------------------------------------------------- */
export const getUserProfile = async (accessToken: string): Promise<[string | null, T_SpotifyPrivateUser | null]> => {
    const [error, data] = await safeAwait(
        spotifyConfig.get<T_SpotifyPrivateUser>(EXTERNAL_ROUTES.SPOTIFY.USER.PROFILE, {
            headers: { Authorization: `Bearer ${accessToken}` },
        })
    );

    if (error || !data) {
        if (axios.isAxiosError(error)) {
            const errors = error.response?.data as T_SpotifyErrorResponse;
            return [errors.error.message, null];
        }

        return ['Failed to fetch user profile', null];
    }

    return [null, data?.data];
};

export const getUserPlaylists = async (accessToken: string, userId?: string) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<T_SpotifyPaging<T_SpotifySimplifiedPlaylist>>(
            userId ? EXTERNAL_ROUTES.SPOTIFY.PLAYLISTS(userId) : EXTERNAL_ROUTES.SPOTIFY.USER.PLAYLISTS,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        )
    );

    if (error || !response) {
        return createErrorReturn('Failed to fetch user playlists', error);
    }

    return createSuccessReturn('User playlists fetched successfully!', response?.data);
};

export const getUserRecentlyPlayedTracks = async (accessToken: string, limit?: number) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<T_SpotifyRecentlyPlayed>(EXTERNAL_ROUTES.SPOTIFY.USER.RECENTLY_PLAYED, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { limit },
        })
    );

    if (error || !response) {
        return createErrorReturn('Failed to fetch user playlists', error);
    }

    return createSuccessReturn('User playlists fetched successfully!', response?.data);
};

export const getUserTopTracks = async (accessToken: string, limit?: number) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<T_SpotifyPaging<T_SpotifyTrack>>(EXTERNAL_ROUTES.SPOTIFY.USER.TOP_TRACKS, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { limit },
        })
    );

    if (error || !response) {
        return createErrorReturn('Failed to fetch user playlists', error);
    }

    return createSuccessReturn('User playlists fetched successfully!', response?.data);
};

export const getUserTopArtists = async (accessToken: string, limit?: number) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<T_SpotifyPaging<T_SpotifyArtist>>(EXTERNAL_ROUTES.SPOTIFY.USER.TOP_ARTISTS, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { limit },
        })
    );

    if (error || !response) {
        return createErrorReturn('Failed to fetch user playlists', error);
    }

    return createSuccessReturn('User playlists fetched successfully!', response?.data);
};

/* -------------------------------------------------------------------------- */
/*                                   No User                                  */
/* -------------------------------------------------------------------------- */
export const getPlaylistDetails = async (accessToken: string, playlistId: string) => {
    const [error, res] = await safeAwait(
        spotifyConfig.get<T_SpotifyPlaylist>(EXTERNAL_ROUTES.SPOTIFY.PLAYLISTS(playlistId), {
            headers: { Authorization: `Bearer ${accessToken}` },
        })
    );

    if (error || !res) {
        return createErrorReturn('Failed to fetch playlist details', error);
    }

    return createSuccessReturn('Playlist details fetched successfully!', res?.data);
};

export const getTrackDetails = async (accessToken: string, trackId: string) => {
    const [error, res] = await safeAwait(
        spotifyConfig.get<T_SpotifyTrack>(EXTERNAL_ROUTES.SPOTIFY.TRACKS(trackId), {
            headers: { Authorization: `Bearer ${accessToken}` },
        })
    );

    if (error || !res) {
        return createErrorReturn('Failed to fetch track details', error);
    }

    return createSuccessReturn('Track details fetched successfully!', res?.data);
};

export const getMultipleTracksDetails = async (accessToken: string, trackIds: string[]) => {
    const [error, res] = await safeAwait(
        spotifyConfig.get<T_SpotifyTrack>(EXTERNAL_ROUTES.SPOTIFY.TRACKS(trackIds), {
            headers: { Authorization: `Bearer ${accessToken}` },
        })
    );

    if (error || !res) {
        return createErrorReturn('Failed to fetch track details', error);
    }

    return createSuccessReturn('Track details fetched successfully!', res?.data);
};

export const getAlbumDetails = async (accessToken: string, trackId: string) => {
    const [error, res] = await safeAwait(
        spotifyConfig.get<T_SpotifyAlbum>(EXTERNAL_ROUTES.SPOTIFY.ALBUM(trackId), {
            headers: { Authorization: `Bearer ${accessToken}` },
        })
    );

    if (error || !res) {
        return createErrorReturn('Failed to fetch track details', error);
    }

    return createSuccessReturn('Track details fetched successfully!', res?.data);
};

export const getArtistDetails = async (accessToken: string, trackId: string) => {
    const [error, res] = await safeAwait(
        spotifyConfig.get<T_SpotifyArtist>(EXTERNAL_ROUTES.SPOTIFY.ARTIST(trackId), {
            headers: { Authorization: `Bearer ${accessToken}` },
        })
    );

    if (error || !res) {
        return createErrorReturn('Failed to fetch track details', error);
    }

    return createSuccessReturn('Track details fetched successfully!', res?.data);
};

export const getArtistTopTracks = async (accessToken: string, trackId: string) => {
    const [error, res] = await safeAwait(
        spotifyConfig.get<{ tracks: T_SpotifyTrack[] }>(EXTERNAL_ROUTES.SPOTIFY.ARTIST_TRACKS(trackId), {
            headers: { Authorization: `Bearer ${accessToken}` },
        })
    );

    if (error || !res) {
        return createErrorReturn('Failed to fetch track details', error);
    }

    return createSuccessReturn('Track details fetched successfully!', res?.data);
};

export const getArtistAlbums = async (accessToken: string, trackId: string, limit?: number) => {
    const [error, res] = await safeAwait(
        spotifyConfig.get<T_SpotifyPaging<T_SpotifySimplifiedAlbum>>(EXTERNAL_ROUTES.SPOTIFY.ARTIST_ALBUMS(trackId), {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { limit },
        })
    );

    if (error || !res) {
        return createErrorReturn('Failed to fetch track details', error);
    }

    return createSuccessReturn('Track details fetched successfully!', res?.data);
};

const spotifyApi = {
    fetchSpotifyData,
    getUserProfile,
    getUserPlaylists,
    getUserRecentlyPlayedTracks,
    getUserTopTracks,
    getUserTopArtists,

    // No User
    getPlaylistDetails,
    getTrackDetails,
    getMultipleTracksDetails,
    getAlbumDetails,
    getArtistDetails,
    getArtistTopTracks,
    getArtistAlbums,
};

export default spotifyApi;
