import { Metadata } from 'next';

import AnilistMediaGrid from '@/components/layout/anilist/AnilistMediaGrid';
import AnilistSearchToolbar from '@/components/layout/anilist/AnilistSearchToolbar';
import { AnilistMediaType } from '@/lib/types/anilist.types';

export const dynamicParams = false;

export const generateStaticParams = async () => {
    return [{ type: 'anime' }, { type: 'manga' }];
};

export const generateMetadata = async ({ params }: { params: Promise<{ type: 'anime' | 'manga' }> }): Promise<Metadata> => {
    const { type } = await params;
    const title = type.charAt(0).toUpperCase() + type.slice(1);

    return {
        title: `${title} - Anilist`,
        description: `Browse your ${title} collection from Anilist.`,
        keywords: [`${title}`, 'Anilist', 'Anime', 'Manga', 'Favorites', 'Anilist Mimic Box'],
    };
};

const AnilistSearch = async ({ params }: { params: Promise<{ type: 'anime' | 'manga' }> }) => {
    const { type } = await params;
    const UpperCaseType = type.toUpperCase() as AnilistMediaType;

    return (
        <main className="container mx-auto p-2 sm:p-6">
            <AnilistSearchToolbar type={UpperCaseType} />
            <AnilistMediaGrid type={UpperCaseType} category="trending" className="mt-6" />
            <AnilistMediaGrid type={UpperCaseType} category="this-season" className="mt-6" />
            <AnilistMediaGrid type={UpperCaseType} category="next-season" className="mt-6" />
            <AnilistMediaGrid type={UpperCaseType} category="popular" className="mt-6" />
        </main>
    );
};

export default AnilistSearch;
