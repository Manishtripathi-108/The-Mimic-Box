import AnilistMediaGrid from '@/components/layout/anilist/AnilistMediaGrid';
import AnilistSearchToolbar from '@/components/layout/anilist/AnilistSearchToolbar';
import { AnilistMediaType } from '@/lib/types/anilist.types';

export const generateStaticParams = async () => {
    return [{ type: 'anime' }, { type: 'manga' }];
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
