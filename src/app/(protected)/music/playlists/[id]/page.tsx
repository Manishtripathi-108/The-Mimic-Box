import { Metadata } from 'next';

import { getSpotifyPlaylistDetails } from '@/actions/spotify.actions';
import MusicSpotifyPlaylist from '@/app/(protected)/music/playlists/[id]/_component/MusicSpotifyPlayList';
import ErrorCard from '@/components/layout/ErrorCard';

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> => {
    const { id } = await params;
    const res = await getSpotifyPlaylistDetails(id);

    if (!res.success || !res.payload) {
        return {
            title: 'Playlist Not Found',
            description: 'The requested Spotify playlist could not be found.',
            keywords: ['Music', 'Playlist', 'Music', 'Mimic', 'Metadata', 'Not Found'],
        };
    }

    const playlist = res.payload;
    const ownerName = playlist.owner?.display_name || 'Unknown';

    return {
        title: playlist.name,
        description: `View details of the playlist "${playlist.name}" curated by ${ownerName}.`,
        keywords: ['Music', 'Playlist', 'Music', 'Mimic', 'Metadata', playlist.name, ownerName],
        openGraph: {
            images: [{ url: playlist.images?.[0]?.url }],
        },
        twitter: {
            card: 'summary_large_image',
            title: playlist.name,
            description: `View details of the playlist "${playlist.name}" curated by ${ownerName}.`,
            images: [playlist.images?.[0]?.url],
        },
    };
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const res = await getSpotifyPlaylistDetails(id);

    if (!res.success || !res.payload) {
        return <ErrorCard message={res.message || 'Failed to fetch playlist'} />;
    }

    return <MusicSpotifyPlaylist playlist={res.payload} />;
};

export default Page;
