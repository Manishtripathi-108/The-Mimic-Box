import { Metadata } from 'next';

import { getSpotifyPlaylistDetails } from '@/actions/spotify.actions';
import Playlist from '@/app/(protected)/spotify/_components/PlayList';
import ErrorCard from '@/components/layout/ErrorCard';

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> => {
    const { id } = await params;

    const res = await getSpotifyPlaylistDetails(id);

    if (!res.success || !res.payload) {
        return {
            title: 'Playlist Not Found',
            description: 'The requested Spotify playlist could not be found.',
        };
    }

    const playlist = res.payload;

    return {
        title: `${playlist.name}`,
        description: `View details of the playlist "${playlist.name}" by ${playlist.owner.display_name || 'Unknown'}.`,
        keywords: ['Spotify', 'Playlist', 'Music', playlist.name],
        openGraph: {
            images: [
                {
                    url: playlist.images?.[0]?.url || '',
                    width: 300,
                    height: 300,
                    alt: `Cover for ${playlist.name}`,
                },
            ],
        },
    };
};

const PlayListDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const res = await getSpotifyPlaylistDetails(id);
    if (!res.success || !res.payload) {
        return <ErrorCard message={res.message || 'Failed to fetch playlist'} />;
    }

    return <Playlist playlist={res.payload} />;
};

export default PlayListDetails;
