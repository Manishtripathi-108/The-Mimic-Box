import { Metadata } from 'next';

import A_MediaExplorer from '@/app/(protected)/anilist/_components/A_MediaExplorer';
import A_MediaGrid from '@/app/(protected)/anilist/_components/A_MediaGrid';
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
        <>
            <A_MediaExplorer type={UpperCaseType} />
            <A_MediaGrid type={UpperCaseType} category="trending" className="mt-6" />
            <A_MediaGrid type={UpperCaseType} category="this-season" className="mt-6" />
            <A_MediaGrid type={UpperCaseType} category="next-season" className="mt-6" />
            <A_MediaGrid type={UpperCaseType} category="popular" className="mt-6" />
        </>
    );
};

export default AnilistSearch;
