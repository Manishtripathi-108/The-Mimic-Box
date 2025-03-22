import { getAnilistUserMedia } from '@/actions/anilist.actions';
import { auth } from '@/auth';
import AnilistMain from '@/components/layout/anilist/AnilistMain';

const AnilistAnime = async () => {
    const session = await auth();
    const anilist = session?.user?.linkedAccounts?.anilist;
    if (!anilist) {
        return null;
    }
    const response = await getAnilistUserMedia(anilist.accessToken, anilist.id, 'ANIME');
    if (response.success) {
        return response.payload ? <AnilistMain mediaLists={response.payload} type="anime" /> : null;
    } else {
        return response.error;
    }
};

export default AnilistAnime;
