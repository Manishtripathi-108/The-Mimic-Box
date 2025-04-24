import { AxiosRequestConfig } from 'axios';

import anilistConfig from '@/lib/config/anilist.config';
import spotifyConfig from '@/lib/config/spotify.config';
import { safeAwait } from '@/lib/utils/safeAwait.utils';

// This function fetches data from the AniList API using a GraphQL query and optional variables.
export const fetchAniListData = async <T>(
    token: string | null,
    query: string,
    variables: Record<string, unknown> = {}
): Promise<[Error | null, T | null]> => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const [error, response] = await safeAwait(anilistConfig.post<{ data: { data: T } }>('/', { query, variables }, { headers }));

    return [error, (response?.data?.data as T) ?? null];
};

export const fetchSpotifyData = async <T>({ token, ...reqConfig }: AxiosRequestConfig & { token: string }): Promise<[Error, null] | [null, T]> => {
    const reqConfigHeaders = { ...reqConfig.headers, Authorization: `Bearer ${token}` };

    const [error, response] = await safeAwait(spotifyConfig<T>({ ...reqConfig, headers: reqConfigHeaders }));

    if (error || !response) {
        return [error || new Error('No response'), null];
    }

    return [null, response.data];
};
