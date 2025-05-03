import { Metadata } from 'next';

import { getSpotifyAlbumDetails } from '@/actions/spotify.actions';
import MusicAlbum from '@/app/(protected)/spotify/_components/MusicAlbum';
import ErrorCard from '@/components/layout/ErrorCard';

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> => {
    const { id } = await params;

    const res = await getSpotifyAlbumDetails(id);

    if (!res.success || !res.payload) {
        return {
            title: 'Album Not Found',
            description: 'The requested Spotify album could not be found.',
            keywords: ['Spotify', 'Album', 'Music', 'Mimic', 'Metadata', 'Not Found'],
        };
    }

    const album = res.payload;
    const artistNames = album.artists?.map((artist) => artist.name).filter(Boolean) || ['Unknown'];

    return {
        title: album.name,
        description: `View details of the album "${album.name}" by ${artistNames.join(', ')}.`,
        keywords: ['Spotify', 'Album', 'Music', 'Mimic', 'Metadata', album.name, ...artistNames],
        openGraph: {
            images: [
                {
                    url: album.images?.[0]?.url || '',
                    width: 300,
                    height: 300,
                    alt: `Cover for ${album.name}`,
                },
            ],
        },
    };
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const res = await getSpotifyAlbumDetails(id);

    if (!res.success || !res.payload) {
        return <ErrorCard message={res.message || 'Failed to fetch album'} />;
    }

    return <MusicAlbum album={res.payload} />;
};

export default Page;
