import axios from 'axios';

import { EXTERNAL_ROUTES } from '@/constants/routes.constants';
import spotifyConfig from '@/lib/config/spotify.config';
import { T_SpotifyErrorResponse, T_SpotifyPaging, T_SpotifyPrivateUser, T_SpotifySimplifiedPlaylist } from '@/lib/types/spotify.types';
import { createErrorReturn, createSuccessReturn } from '@/lib/utils/createResponse.utils';
import { safeAwait } from '@/lib/utils/safeAwait.utils';

export const getUserProfile = async (accessToken: string): Promise<[string | null, T_SpotifyPrivateUser | null]> => {
    const [error, data] = await safeAwait(
        spotifyConfig.get<T_SpotifyPrivateUser>(EXTERNAL_ROUTES.SPOTIFY.USER.PROFILE, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
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
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )
    );

    if (error || !response) {
        return createErrorReturn('Failed to fetch user playlists', error);
    }

    return createSuccessReturn('User playlists fetched successfully!', response?.data);
};

const spotifyApi = {
    getUserProfile,
    getUserPlaylists,
};

export default spotifyApi;
