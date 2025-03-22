import { getAnilistUserMedia } from '@/actions/anilist.actions';
import { auth } from '@/auth';
import AnilistMain from '@/components/layout/anilist/AnilistMain';

const AnilistManga = async () => {
    const session = await auth();
    const anilist = session?.user?.linkedAccounts?.anilist;
    if (!anilist) {
        return null;
    }
    const response = await getAnilistUserMedia(anilist.accessToken, anilist.id, 'MANGA');
    if (response.success) {
        return response.payload ? <AnilistMain mediaLists={response.payload} type="manga" /> : null;
    } else {
        return response.error;
    }
};

export default AnilistManga;
