import anilistConfig from '@/lib/config/anilist.config';
import { T_SpotifyPlayHistory } from '@/lib/types/spotify.types';
import { safeAwait } from '@/lib/utils/safeAwait.utils';

// This function fetches data from the AniList API using a GraphQL query and optional variables.
export const fetchAniListData = async <T>(
    token: string | null,
    query: string,
    variables: Record<string, unknown> = {}
): Promise<[Record<string, unknown> | Error | null, T | null]> => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const [error, response] = await safeAwait(anilistConfig.post<{ data: { data: T } }>('/', { query, variables }, { headers }));

    return [error, (response?.data?.data as T) ?? null];
};

export const extractRecentPlaylists = (items: T_SpotifyPlayHistory[]) => {
    const playlistIds: Set<string> = new Set();

    for (const item of items) {
        const context = item.context;

        if (context?.type === 'playlist' && context.uri) {
            const uriParts = context.uri.split(':');
            if (uriParts[1] === 'playlist') {
                playlistIds.add(uriParts[2]); // playlist ID
            }
        }
    }

    return Array.from(playlistIds);
};
