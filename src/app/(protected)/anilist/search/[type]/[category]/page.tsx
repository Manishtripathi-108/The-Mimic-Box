import { Metadata } from 'next';

import AnilistSearchToolbar from '@/components/layout/anilist/AnilistSearchToolbar';
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

    return (
        <main className="container mx-auto p-2 sm:p-6">
            <AnilistSearchToolbar type={UpperCaseType} category={category} />
        </main>
    );
};

export default AnilistSearch;
