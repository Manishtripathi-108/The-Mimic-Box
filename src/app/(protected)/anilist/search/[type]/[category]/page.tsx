import { Metadata } from 'next';

import A_MediaExplorer from '@/app/(protected)/anilist/_components/A_MediaExplorer';
import { AnilistMediaType, AnilistSearchCategories } from '@/lib/types/anilist.types';

export const dynamicParams = false;

export const generateStaticParams = async () => {
    return ['trending', 'this-season', 'next-season', 'popular'].flatMap((category) => [
        { category, type: 'anime' },
        { category, type: 'manga' },
    ]);
};

export const generateMetadata = async ({
    params,
}: {
    params: Promise<{ category: AnilistSearchCategories; type: 'anime' | 'manga' }>;
}): Promise<Metadata> => {
    const { category, type } = await params;
    const title = category.charAt(0).toUpperCase() + category.slice(1) + ' ' + type.charAt(0).toUpperCase() + type.slice(1);

    return {
        title: `${title} - Anilist`,
        description: `Browse your ${title} collection from Anilist.`,
        keywords: [`${title}`, 'Anilist', 'Anime', 'Manga', 'Favorites', 'Anilist Mimic Box'],
    };
};

const AnilistSearch = async ({ params }: { params: Promise<{ category: AnilistSearchCategories; type: 'anime' | 'manga' }> }) => {
    const { category, type } = await params;
    const UpperCaseType = type.toUpperCase() as AnilistMediaType;

    return <A_MediaExplorer type={UpperCaseType} category={category} />;
};

export default AnilistSearch;
