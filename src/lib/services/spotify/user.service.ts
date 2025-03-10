import { EXTERNAL_ROUTES } from '@/constants/routes.constants';
import { SpotifyUserProfile, SpotifyUserProfileErrors } from '@/lib/types/spotify.types';
import { safeAwait } from '@/lib/utils/safeAwait.utils';
import axios from 'axios';

export const getSpotifyUserProfile = async (accessToken: string): Promise<[string | null, SpotifyUserProfile | null]> => {
    const [error, data] = await safeAwait(
        axios.get<SpotifyUserProfile>(EXTERNAL_ROUTES.SPOTIFY.USER_PROFILE, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
    );

    if (error || !data) {
        if (axios.isAxiosError(error)) {
            const errors = error.response?.data as SpotifyUserProfileErrors;
            return [errors.error.message, null];
        }

        return ['Failed to fetch user profile', null];
    }

    return [null, data?.data];
};
