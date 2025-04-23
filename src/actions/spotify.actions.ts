'use server';

import { auth } from '@/auth';
import spotifyApi from '@/lib/services/spotify.service';
import { createErrorReturn } from '@/lib/utils/createResponse.utils';

export const getSpotifyCurrentUserPlaylists = async () => {
    const session = await auth();
    const accessToken = session?.user?.linkedAccounts?.spotify?.accessToken;
    if (!accessToken) {
        return createErrorReturn('Spotify access token not found');
    }

    const res = await spotifyApi.getUserPlaylists(accessToken);
    return res;
};
