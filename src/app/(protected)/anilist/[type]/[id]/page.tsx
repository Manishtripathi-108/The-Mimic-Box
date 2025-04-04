import { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { fetchAnilistMediaDetails } from '@/actions/anilist.actions';
import MediaDetail from '@/app/(protected)/anilist/_components/A_MediaDetail';
import { AnilistMediaType } from '@/lib/types/anilist.types';

export const generateMetadata = async ({ params }: { params: Promise<{ type: 'anime' | 'manga'; id: number }> }): Promise<Metadata> => {
    const { type, id } = await params;
    if (!['anime', 'manga'].includes(type) || isNaN(Number(id))) return {};

    const UpperCaseType = type.toUpperCase() as AnilistMediaType;
    const response = await fetchAnilistMediaDetails(UpperCaseType, Number(id));

    if (!response.success || !response.payload) return {};

    const media = response.payload;

    return {
        title: `${media.title.romaji || media.title.english} - Anilist`,
        description: media.description?.replace(/<[^>]*>/g, '').slice(0, 160) || '',
        openGraph: {
            title: media.title.romaji || media.title.english,
            description: media.description?.replace(/<[^>]*>/g, '').slice(0, 160) || '',
            images: media.coverImage?.large ? [{ url: media.coverImage.large }] : [],
        },
    };
};

const AnilistMediaPage = async ({ params }: { params: Promise<{ type: 'anime' | 'manga'; id: number }> }) => {
    const { type, id } = await params;
    if (!['anime', 'manga'].includes(type) || isNaN(Number(id))) notFound();

    const UpperCaseType = type.toUpperCase() as AnilistMediaType;
    const response = await fetchAnilistMediaDetails(UpperCaseType, Number(id));

    if (!response.success || !response.payload) notFound();
    const media = response.payload;

    return <MediaDetail media={media} />;
};

export default AnilistMediaPage;
