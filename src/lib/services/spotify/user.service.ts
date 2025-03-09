import { SpotifyUserProfile, SpotifyUserProfileErrors } from '@/lib/types/spotify.types';
import axios from 'axios';

export const getSpotifyUserProfile = async (accessToken: string): Promise<SpotifyUserProfile> => {
    try {
        const { data } = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errors = error.response?.data as SpotifyUserProfileErrors;
            throw new Error(errors.error.message);
        }
        throw new Error('Failed to fetch Spotify user profile');
    }
};
