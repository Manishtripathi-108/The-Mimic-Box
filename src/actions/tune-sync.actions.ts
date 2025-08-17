'use server';

import { auth } from '@/auth';
import { removeItems } from '@/lib/services/spotify/playlist.spotify.services';
import { T_RemoveDuplicates } from '@/lib/types/common.types';
import { createUnauthorized, createValidationError } from '@/lib/utils/createResponse.utils';

export const deduplicatePlaylistItems = async ({ playlistId, data, source }: T_RemoveDuplicates) => {
    const session = await auth();
    if (!session || !session.user) {
        return createUnauthorized('User not authenticated.');
    }

    switch (source) {
        case 'spotify':
            if (!session.user.linkedAccounts?.spotify?.accessToken) {
                return createUnauthorized('Spotify access token not found.');
            }
            return await removeItems(session.user.linkedAccounts.spotify.accessToken, playlistId, data);

        default:
            return createValidationError('Invalid source.');
    }
};
