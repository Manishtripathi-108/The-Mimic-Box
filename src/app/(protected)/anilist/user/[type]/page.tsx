import { Metadata } from 'next';

import Link from 'next/link';

import { getUserFavourites, getUserMediaCollections } from '@/actions/anilist.actions';
import A_Main from '@/app/(protected)/anilist/_components/A_Main';
import { auth } from '@/auth';
import ErrorCard from '@/components/layout/ErrorCard';
import { NoDataCard } from '@/components/layout/NoDataCard';
import { APP_ROUTES } from '@/constants/routes.constants';

interface AnilistMediaPageProps {
    params: Promise<{ type: 'anime' | 'manga' | 'favourites' }>;
}

export const dynamicParams = false;

export const generateStaticParams = async () => {
    return [{ type: 'anime' }, { type: 'manga' }, { type: 'favourites' }];
};

export const generateMetadata = async ({ params }: AnilistMediaPageProps): Promise<Metadata> => {
    const { type } = await params;
    const title = type.charAt(0).toUpperCase() + type.slice(1);

    return {
        title: `${title} - Anilist`,
        description: `Browse your ${title} collection from Anilist.`,
        keywords: [`${title}`, 'Anilist', 'Anime', 'Manga', 'Favorites', 'Anilist Mimic Box'],
    };
};

const AnilistMediaPage = async ({ params }: AnilistMediaPageProps) => {
    const session = await auth();
    const anilist = session?.user?.linkedAccounts?.anilist;
    if (!anilist) return null;

    const { type } = await params;
    let response;

    try {
        response =
            type === 'favourites'
                ? await getUserFavourites(anilist.accessToken, anilist.id)
                : await getUserMediaCollections(anilist.accessToken, anilist.id, type.toUpperCase() as 'ANIME' | 'MANGA');
    } catch {
        return <ErrorCard message="Failed to load data. Please try again later." />;
    }

    if (!response.success) return <ErrorCard message={response.message} />;

    const hasMedia =
        (response.payload &&
            (Array.isArray(response.payload)
                ? response.payload.length
                : response.payload.anime?.nodes?.length || response.payload.manga?.nodes?.length)) ||
        0 > 0;

    return hasMedia ? (
        <A_Main token={anilist.accessToken} mediaLists={response.payload!} type={type} />
    ) : (
        <NoDataCard message={`Your ${type} list is looking a little empty!`}>
            <p className="text-text-secondary">Start adding your favorite anime/manga to your list or import an existing list.</p>
            <div className="mt-3 flex gap-3">
                <Link target="_blank" href={APP_ROUTES.ANILIST_SEARCH(type === 'favourites' ? 'anime' : type)} className="button">
                    Browse
                </Link>
                <Link href={APP_ROUTES.IMPORT_ANIME_MANGA} className="button">
                    Import List
                </Link>
            </div>
        </NoDataCard>
    );
};

export default AnilistMediaPage;
