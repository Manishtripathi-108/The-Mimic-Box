import { Metadata } from 'next';

import { getAnilistUserMedia } from '@/actions/anilist.actions';
import { auth } from '@/auth';
import AnilistMain from '@/components/layout/anilist/AnilistMain';

export const metadata: Metadata = {
    title: 'Anilist Anime Collection | The Mimic Box',
    description:
        'Explore and manage your anime list from Anilist. Track your progress, discover new titles, and share your favorite anime with friends.',
};

const AnilistAnime = async () => {
    const session = await auth();
    const anilist = session?.user?.linkedAccounts?.anilist;
    if (!anilist) return null;

    const response = await getAnilistUserMedia(anilist.accessToken, anilist.id, 'ANIME');
    if (response.success) {
        return response.payload ? <AnilistMain mediaLists={response.payload} type="anime" /> : null;
    } else {
        return <div>{JSON.stringify(response.error)}</div>;
    }
};

export default AnilistAnime;
