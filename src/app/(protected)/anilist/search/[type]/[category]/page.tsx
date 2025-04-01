import AnilistSearchToolbar from '@/components/layout/anilist/AnilistSearchToolbar';
import { AnilistMediaType, AnilistSearchCategories } from '@/lib/types/anilist.types';

export const generateStaticParams = async () => {
    return ['trending', 'this-season', 'next-season', 'popular'].flatMap((category) => [
        { category, type: 'anime' },
        { category, type: 'manga' },
    ]);
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
