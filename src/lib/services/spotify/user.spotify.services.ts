import { isAxiosError } from 'axios';

import spotifyApiRoutes from '@/constants/external-routes/spotify.routes';
import spotifyConfig from '@/lib/config/spotify.config';
import { T_ErrorCode } from '@/lib/types/response.types';
import { T_SpotifyArtist, T_SpotifyPaging, T_SpotifyPrivateUser, T_SpotifyTrack } from '@/lib/types/spotify.types';
import { createError, createSuccess } from '@/lib/utils/createResponse.utils';
import { safeAwait } from '@/lib/utils/safeAwait.utils';
import { withAuthHeader } from '@/lib/utils/server.utils';

/**
 * Service: Fetch the current user's Spotify profile.
 */
export const getMe = async (accessToken: string) => {
    const [error, data] = await safeAwait(
        spotifyConfig.get<T_SpotifyPrivateUser>(spotifyApiRoutes.users.getMyProfile(), { headers: withAuthHeader(accessToken) })
    );

    if (error || !data?.data) {
        const message = isAxiosError(error) ? error.response?.data?.message || 'Failed to fetch user profile' : 'Failed to fetch user profile';
        let errorCode: T_ErrorCode = 'server_error';
        if (isAxiosError(error)) {
            switch (error.response?.status) {
                case 400:
                    errorCode = 'invalid_token';
                    break;
                case 401:
                    errorCode = 'invalid_grant';
                    break;
                case 403:
                    errorCode = 'invalid_client';
                    break;
                default:
                    errorCode = 'server_error';
                    break;
            }
        }
        return createError(message, { code: errorCode, error });
    }

    return createSuccess('User profile fetched successfully!', data.data);
};

/**
 * Service: Fetch a Spotify user's profile by user ID.
 */
export const getUser = async (accessToken: string, userId: string) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<T_SpotifyPrivateUser>(spotifyApiRoutes.users.getUser(userId), { headers: withAuthHeader(accessToken) })
    );

    return error || !response
        ? createError('Failed to fetch user profile', { error })
        : createSuccess('User profile fetched successfully!', response.data);
};

/**
 * Service: Fetch the current user's top tracks from Spotify.
 */
export const getTopTracks = async (accessToken: string, limit?: number) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<T_SpotifyPaging<T_SpotifyTrack>>(spotifyApiRoutes.users.getTop('tracks'), {
            headers: withAuthHeader(accessToken),
            params: { limit },
        })
    );

    return error || !response
        ? createError('Failed to fetch top tracks', { error })
        : createSuccess('Top tracks fetched successfully!', response.data);
};

/**
 * Service: Fetch the current user's top artists from Spotify.
 */
export const getTopArtists = async (accessToken: string, limit?: number) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<T_SpotifyPaging<T_SpotifyArtist>>(spotifyApiRoutes.users.getTop('artists'), {
            headers: withAuthHeader(accessToken),
            params: { limit },
        })
    );

    return error || !response
        ? createError('Failed to fetch top artists', { error })
        : createSuccess('Top artists fetched successfully!', response.data);
};

/**
 * Service: Follow one or more Spotify users.
 */
export const followUsers = async (accessToken: string, userId: string[]) => {
    const [error, response] = await safeAwait(
        spotifyConfig.put(spotifyApiRoutes.users.follow('user', userId), {}, { headers: withAuthHeader(accessToken) })
    );

    return error || !response ? createError('Failed to follow user', { error }) : createSuccess('User followed successfully!', response.data);
};

/**
 * Service: Unfollow one or more Spotify users.
 */
export const unfollowUsers = async (accessToken: string, userId: string[]) => {
    const [error, response] = await safeAwait(
        spotifyConfig.delete(spotifyApiRoutes.users.unfollow('user', userId), { headers: withAuthHeader(accessToken) })
    );

    return error || !response ? createError('Failed to unfollow user', { error }) : createSuccess('User unfollowed successfully!', response.data);
};

/**
 * Service: Follow one or more Spotify artists.
 */
export const followArtists = async (accessToken: string, artistIds: string[]) => {
    const [error, response] = await safeAwait(
        spotifyConfig.put(spotifyApiRoutes.users.follow('artist', artistIds), {}, { headers: withAuthHeader(accessToken) })
    );

    return error || !response ? createError('Failed to follow artists', { error }) : createSuccess('Artists followed successfully!', response.data);
};

/**
 * Service: Unfollow one or more Spotify artists.
 */
export const unfollowArtists = async (accessToken: string, artistIds: string[]) => {
    const [error, response] = await safeAwait(
        spotifyConfig.delete(spotifyApiRoutes.users.unfollow('artist', artistIds), { headers: withAuthHeader(accessToken) })
    );

    return error || !response
        ? createError('Failed to unfollow artists', { error })
        : createSuccess('Artists unfollowed successfully!', response.data);
};

/**
 * Service: Follow a Spotify playlist by playlist ID.
 */
export const followPlaylist = async (accessToken: string, playlistId: string) => {
    const [error, response] = await safeAwait(
        spotifyConfig.put(spotifyApiRoutes.users.followPlaylist(playlistId), {}, { headers: withAuthHeader(accessToken) })
    );

    return error || !response ? createError('Failed to follow playlist', { error }) : createSuccess('Playlist followed successfully!', response.data);
};

/**
 * Service: Unfollow a Spotify playlist by playlist ID.
 */
export const unfollowPlaylist = async (accessToken: string, playlistId: string) => {
    const [error, response] = await safeAwait(
        spotifyConfig.delete(spotifyApiRoutes.users.unfollowPlaylist(playlistId), { headers: withAuthHeader(accessToken) })
    );

    return error || !response
        ? createError('Failed to unfollow playlist', { error })
        : createSuccess('Playlist unfollowed successfully!', response.data);
};

/**
 * Service: Fetch the artists followed by the current user.
 */
export const getFollowedArtists = async (accessToken: string, limit?: number) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<T_SpotifyPaging<T_SpotifyArtist>>(spotifyApiRoutes.users.getFollowedArtists(), {
            headers: withAuthHeader(accessToken),
            params: { limit },
        })
    );

    return error || !response
        ? createError('Failed to fetch followed artists', { error })
        : createSuccess('Followed artists fetched successfully!', response.data);
};

/**
 * Service: Check if the current user is following specific Spotify users.
 */
export const checkFollowingUsers = async (accessToken: string, userIds: string[]) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<boolean[]>(spotifyApiRoutes.users.checkFollowing('user', userIds), {
            headers: withAuthHeader(accessToken),
        })
    );

    return error || !response
        ? createError('Failed to check if following users', { error })
        : createSuccess('Following users check completed successfully!', response.data);
};

/**
 * Service: Check if the current user is following specific Spotify artists.
 */
export const checkFollowingArtists = async (accessToken: string, artistIds: string[]) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<boolean[]>(spotifyApiRoutes.users.checkFollowing('artist', artistIds), {
            headers: withAuthHeader(accessToken),
        })
    );

    return error || !response
        ? createError('Failed to check if following artists', { error })
        : createSuccess('Following artists check completed successfully!', response.data);
};

/**
 * Service: Check if the current user is following a specific Spotify playlist.
 */
export const checkFollowingPlaylist = async (accessToken: string, playlistId: string) => {
    const [error, response] = await safeAwait(
        spotifyConfig.get<boolean>(spotifyApiRoutes.users.checkFollowingPlaylist(playlistId), {
            headers: withAuthHeader(accessToken),
        })
    );

    return error || !response
        ? createError('Failed to check if following playlist', { error })
        : createSuccess('Following playlist check completed successfully!', response.data);
};

/**
 * Spotify User Services: Collection of all Spotify user-related service functions.
 */
const spotifyUserServices = {
    getMe,
    getUser,
    getTopTracks,
    getTopArtists,
    followUsers,
    unfollowUsers,
    followArtists,
    unfollowArtists,
    followPlaylist,
    unfollowPlaylist,
    getFollowedArtists,
    checkFollowingUsers,
    checkFollowingArtists,
    checkFollowingPlaylist,
} as const;

export default spotifyUserServices;
