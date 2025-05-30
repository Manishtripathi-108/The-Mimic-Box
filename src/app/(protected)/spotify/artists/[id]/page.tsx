import { Metadata } from 'next';

import { getSpotifyArtistDetails } from '@/actions/spotify.actions';
import MusicMediaHeader from '@/app/(protected)/spotify/_components/MusicMediaHeader';
import ErrorMessage from '@/components/ui/ErrorMessage';

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> => {
    const { id } = await params;
    const res = await getSpotifyArtistDetails(id);

    if (!res.success || !res.payload) {
        return {
            title: 'Artist Not Found',
            description: 'The requested Spotify artist could not be found.',
            keywords: ['Spotify', 'Artist', 'Music', 'Mimic', 'Metadata', 'Not Found'],
        };
    }

    const artist = res.payload;

    return {
        title: artist.name,
        description: `Explore artist profile for ${artist.name} — with ${artist.followers?.total?.toLocaleString()} followers and a popularity score of ${artist.popularity}%.`,
        keywords: ['Spotify', 'Artist', 'Music', 'Mimic', 'Metadata', artist.name, ...(artist.genres || [])],
        openGraph: {
            images: [
                {
                    url: artist.images?.[0]?.url || '',
                    width: 300,
                    height: 300,
                    alt: `Photo of ${artist.name}`,
                },
            ],
        },
    };
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const res = await getSpotifyArtistDetails(id);

    if (!res.success || !res.payload) {
        return <ErrorMessage message={res.message || 'Failed to fetch artist details'} />;
    }

    const { name, images, followers, popularity } = res.payload;

    return <MusicMediaHeader title={name} coverImage={images?.[0]?.url} metadata={`Followers: ${followers.total} • Popularity: ${popularity}%`} />;
};

export default Page;
