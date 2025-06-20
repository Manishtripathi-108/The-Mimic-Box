import { Metadata } from 'next';

import { spotifyGetAlbum } from '@/actions/spotify.actions';
import MusicSpotifyAlbum from '@/app/(protected)/music/albums/[id]/_component/MusicSpotifyAlbum';
import ErrorCard from '@/components/layout/ErrorCard';

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> => {
    const { id } = await params;

    const res = await spotifyGetAlbum(id);

    if (!res.success || !res.payload) {
        return {
            title: 'Album Not Found',
            description: 'The requested Spotify album could not be found.',
            keywords: ['Music', 'Album', 'Music', 'Mimic', 'Metadata', 'Not Found'],
        };
    }

    const album = res.payload;
    const artistNames = album.artists?.map((artist) => artist.name).filter(Boolean) || ['Unknown'];

    return {
        title: album.name,
        description: `View details of the album "${album.name}" by ${artistNames.join(', ')}.`,
        keywords: ['Music', 'Album', 'Music', 'Mimic', 'Metadata', album.name, ...artistNames],
        openGraph: {
            images: [{ url: album.images?.[0]?.url }],
        },
        twitter: {
            card: 'summary_large_image',
            title: album.name,
            description: `View details of the album "${album.name}" by ${artistNames.join(', ')}.`,
            images: [album.images?.[0]?.url],
        },
    };
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const res = await spotifyGetAlbum(id);

    if (!res.success || !res.payload) {
        return <ErrorCard message={res.message || 'Failed to fetch album'} />;
    }

    return <MusicSpotifyAlbum album={res.payload} />;
};

export default Page;
