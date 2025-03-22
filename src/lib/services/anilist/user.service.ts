import { AnilistUser } from '@/lib/types/anilist.types';
import { fetchAniListData } from '@/lib/utils/server.utils';

export const getAnilistUserProfile = async (token: string): Promise<AnilistUser | null> => {
    const query = `
        query {
            Viewer {
                id
                name
                avatar { large }
                bannerImage
            }
        }
    `;

    const [error, response] = await fetchAniListData<AnilistUser>(token, query);

    if (error || !response) {
        console.error('Error fetching user data:', error);
        return null;
    }

    return response;
};
