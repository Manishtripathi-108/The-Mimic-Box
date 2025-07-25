import { Metadata } from 'next';

import { spotifyGetArtist } from '@/actions/spotify.actions';
import MusicMediaHeader from '@/app/(protected)/music/_components/MusicMediaHeader';
import ErrorMessage from '@/components/ui/ErrorMessage';

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> => {
    const { id } = await params;
    const res = await spotifyGetArtist(id);

    if (!res.success || !res.payload) {
        return {
            title: 'Artist Not Found',
            description: 'The requested Spotify artist could not be found.',
            keywords: ['Music', 'Artist', 'Music', 'Mimic', 'Metadata', 'Not Found'],
        };
    }

    const artist = res.payload;

    return {
        title: artist.name,
        description: `Explore artist profile for ${artist.name} — with ${artist.followers?.total?.toLocaleString()} followers and a popularity score of ${artist.popularity}%.`,
        keywords: ['Music', 'Artist', 'Music', 'Mimic', 'Metadata', artist.name, ...(artist.genres || [])],
        openGraph: {
            images: [{ url: artist.images?.[0]?.url }],
        },
        twitter: {
            card: 'summary_large_image',
            title: artist.name,
            description: `Explore artist profile for ${artist.name} — with ${artist.followers?.total?.toLocaleString()} followers and a popularity score of ${artist.popularity}%.`,
            images: [artist.images?.[0]?.url],
        },
    };
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const res = await spotifyGetArtist(id);

    if (!res.success || !res.payload) {
        return <ErrorMessage message={res.message || 'Failed to fetch artist details'} />;
    }

    const { name, images, followers, popularity } = res.payload;

    return <MusicMediaHeader title={name} coverImage={images?.[0]?.url} metadata={`Followers: ${followers.total} • Popularity: ${popularity}%`} />;
};

export default Page;
