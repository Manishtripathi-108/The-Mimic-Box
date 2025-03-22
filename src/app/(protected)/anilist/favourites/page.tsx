import { Metadata } from 'next';

import { fetchUserFavourites } from '@/actions/anilist.actions';
import { auth } from '@/auth';
import AnilistMain from '@/components/layout/anilist/AnilistMain';

export const metadata: Metadata = {
    title: 'Anilist Favorites | The Mimic Box',
    description: 'View and manage your favorite anime and manga from Anilist. Keep track of what you love and share your top picks with friends.',
};

const AnilistFavourites = async () => {
    const session = await auth();
    const anilist = session?.user?.linkedAccounts?.anilist;
    if (!anilist) return null;

    const response = await fetchUserFavourites(anilist.accessToken, anilist.id);
    if (response.success) {
        return response.payload ? <AnilistMain mediaLists={response.payload} type="favourites" /> : null;
    } else {
        return <div>{JSON.stringify(response.error)}</div>;
    }
};

export default AnilistFavourites;
