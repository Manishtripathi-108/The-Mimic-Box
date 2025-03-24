import { Metadata } from 'next';

import Image from 'next/image';
import Link from 'next/link';

import { getAnilistUserMedia } from '@/actions/anilist.actions';
import { auth } from '@/auth';
import AnilistMain from '@/components/layout/anilist/AnilistMain';
import { IMAGE_URL } from '@/constants/client.constants';
import { APP_ROUTES } from '@/constants/routes.constants';

export const metadata: Metadata = {
    title: 'Your Anilist Manga Collection | The Mimic Box',
    description: 'Browse and organize your manga collection from Anilist. Keep up with your reading list, find new series, and share your favorites.',
};

const AnilistManga = async () => {
    const session = await auth();
    const anilist = session?.user?.linkedAccounts?.anilist;

    const response = await getAnilistUserMedia(anilist!.accessToken, anilist!.id, 'MANGA');

    if (response.success) {
        return response.payload && response.payload.length > 0 ? (
            <AnilistMain token={anilist!.accessToken} mediaLists={response.payload} type="manga" />
        ) : (
            <section className="shadow-floating-xs to-tertiary from-secondary grid place-items-center gap-5 rounded-xl bg-linear-150 from-15% to-85% p-6">
                <Image src={IMAGE_URL.NO_DATA} alt="No manga found" width={250} height={250} />
                <h2 className="text-text-primary font-alegreya text-xl font-semibold tracking-wide">Your manga shelf is empty!</h2>
                <p className="text-text-secondary">Start adding manga from Anilist or import your collection.</p>
                <div className="mt-3 flex gap-3">
                    <a target="_blank" href="https://anilist.co/search/manga" className="button">
                        Browse Manga
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

export default AnilistManga;
