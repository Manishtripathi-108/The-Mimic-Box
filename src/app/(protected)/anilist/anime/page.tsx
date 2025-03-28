import { Metadata } from 'next';

import Image from 'next/image';
import Link from 'next/link';

import { getAnilistUserMedia } from '@/actions/anilist.actions';
import { auth } from '@/auth';
import AnilistMain from '@/components/layout/anilist/AnilistMain';
import { IMAGE_URL } from '@/constants/client.constants';
import { APP_ROUTES } from '@/constants/routes.constants';

export const metadata: Metadata = {
    title: 'Your Anilist Anime Collection',
    description:
        'Keep track of your anime with Anilist integration. Manage your collection, track progress, and discover new favorites effortlessly.',
};

const AnilistAnime = async () => {
    const session = await auth();
    const anilist = session?.user?.linkedAccounts?.anilist;
    if (!anilist) return null;

    const response = await getAnilistUserMedia(anilist.accessToken, anilist.id, 'ANIME');

    if (response.success) {
        return response.payload && response.payload.length > 0 ? (
            <AnilistMain token={anilist.accessToken} mediaLists={response.payload} type="anime" />
        ) : (
            <section className="shadow-floating-xs to-tertiary from-secondary grid place-items-center gap-5 rounded-xl bg-linear-150 from-15% to-85% p-6">
                <Image src={IMAGE_URL.NO_DATA} alt="No anime found" width={250} height={250} />
                <h2 className="text-text-primary font-alegreya text-xl font-semibold tracking-wide">Your anime list is looking a little empty!</h2>
                <p className="text-text-secondary">Start adding your favorite anime from Anilist or import an existing list.</p>
                <div className="mt-3 flex gap-3">
                    <a target="_blank" href="https://anilist.co/search/anime" className="button">
                        Browse Anime
                    </a>
                    <Link href={APP_ROUTES.IMPORT_ANIME_MANGA} className="button">
                        Import List
                    </Link>
                </div>
            </section>
        );
    } else {
        throw new Error(response.message);
    }
};

export default AnilistAnime;
