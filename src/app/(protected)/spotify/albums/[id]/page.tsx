import { Metadata } from 'next';

import { getSpotifyAlbumDetails } from '@/actions/spotify.actions';
import Album from '@/app/(protected)/spotify/_components/Album';
import ErrorCard from '@/components/layout/ErrorCard';

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> => {
    const { id } = await params;

    const res = await getSpotifyAlbumDetails(id);

    if (!res.success || !res.payload) {
        return {
            title: 'album Not Found',
            description: 'The requested Spotify album could not be found.',
        };
    }

    const album = res.payload;

    return {
        title: `${album.name}`,
        description: `View details of the album "${album.name}" by ${album.artists[0].name || 'Unknown'}.`,
        keywords: ['Spotify', 'album', 'Music', album.name],
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

export default async function albumDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const res = await getSpotifyAlbumDetails(id);
    if (!res.success || !res.payload) {
        return <ErrorCard message={res.message || 'Failed to fetch album'} />;
    }

    return <Album album={res.payload} />;
}
