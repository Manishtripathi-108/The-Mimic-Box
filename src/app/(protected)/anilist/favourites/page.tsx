import { Metadata } from 'next';

import Image from 'next/image';

import { fetchUserFavourites } from '@/actions/anilist.actions';
import { auth } from '@/auth';
import AnilistMain from '@/components/layout/anilist/AnilistMain';
import { IMAGE_URL } from '@/constants/client.constants';

export const metadata: Metadata = {
    title: 'Your Anilist Favorites | The Mimic Box',
    description: 'View and manage your favorite anime and manga from Anilist. Keep track of what you love and share your top picks with friends.',
};

const AnilistFavourites = async () => {
    const session = await auth();
    const anilist = session?.user?.linkedAccounts?.anilist;
    if (!anilist) return null;

    const response = await fetchUserFavourites(anilist.accessToken, anilist.id);

    if (response.success) {
        return response.payload && (response.payload?.anime?.nodes?.length || response.payload?.manga?.nodes?.length || 0) > 0 ? (
            <AnilistMain token={anilist.accessToken} mediaLists={response.payload} type="favourites" />
        ) : (
            <section className="shadow-floating-xs to-tertiary from-secondary grid place-items-center gap-5 rounded-xl bg-linear-150 from-15% to-85% p-6">
                <Image src={IMAGE_URL.NO_DATA} alt="No favorites found" width={250} height={250} />
                <h2 className="text-text-primary font-alegreya text-xl font-semibold tracking-wide">No favorites yet!</h2>
                <p className="text-text-secondary">Add your favorite anime and manga from Anilist to keep track of them here.</p>
                <a target="_blank" href="https://anilist.co/search/anime" className="button">
                    Browse & Add Favorites
                </a>
            </section>
        );
    } else {
        throw new Error(response.message);
    }
};

export default AnilistFavourites;
