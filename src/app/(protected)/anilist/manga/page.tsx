import { Metadata } from 'next';

import { getAnilistUserMedia } from '@/actions/anilist.actions';
import { auth } from '@/auth';
import AnilistMain from '@/components/layout/anilist/AnilistMain';

export const metadata: Metadata = {
    title: 'Anilist Manga Collection | The Mimic Box',
    description: 'Browse and organize your manga collection from Anilist. Keep up with your reading list, find new series, and share your favorites.',
};

const AnilistManga = async () => {
    const session = await auth();
    const anilist = session?.user?.linkedAccounts?.anilist;
    if (!anilist) return null;

    const response = await getAnilistUserMedia(anilist.accessToken, anilist.id, 'MANGA');
    if (response.success) {
        return response.payload ? <AnilistMain mediaLists={response.payload} type="manga" /> : null;
    } else {
        return <div>{JSON.stringify(response.error)}</div>;
    }
};

export default AnilistManga;
