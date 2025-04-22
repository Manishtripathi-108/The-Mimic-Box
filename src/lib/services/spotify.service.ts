import axios from 'axios';

import { EXTERNAL_ROUTES } from '@/constants/routes.constants';
import { T_SpotifyErrorResponse, T_SpotifyPrivateUser } from '@/lib/types/spotify.types';
import { safeAwait } from '@/lib/utils/safeAwait.utils';

export const getSpotifyUserProfile = async (accessToken: string): Promise<[string | null, T_SpotifyPrivateUser | null]> => {
    const [error, data] = await safeAwait(
        axios.get<T_SpotifyPrivateUser>(EXTERNAL_ROUTES.SPOTIFY.USER.PROFILE, {
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
