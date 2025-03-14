import anilistConfig from '@/lib/config/anilist.config';
import { safeAwait } from '@/lib/utils/safeAwait.utils';

export const fetchAniListData = async <T>(
    token: string,
    query: string,
    variables: Record<string, unknown> = {}
): Promise<[Error | null, T | null]> => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const [error, response] = await safeAwait(anilistConfig.post<{ data: { data: T } }>('/', { query, variables }, { headers }));

    return [error, (response?.data?.data as T) ?? null];
};
