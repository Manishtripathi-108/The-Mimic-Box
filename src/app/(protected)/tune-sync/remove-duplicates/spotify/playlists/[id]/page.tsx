import { Metadata } from 'next';

import { getSpotifyPlaylistDetails } from '@/actions/spotify.actions';
import GroupedDuplicateTrackList from '@/app/(protected)/tune-sync/remove-duplicates/_components/GroupedDuplicateTrackList';
import ErrorCard from '@/components/layout/ErrorCard';
import { T_DuplicateTrack } from '@/lib/types/common.types';

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
    const ownerName = playlist.owner?.display_name || 'Unknown';

    return {
        title: `Remove Duplicates | Playlist - ${playlist.name} by ${ownerName}`,
    };
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const res = await getSpotifyPlaylistDetails(id);

    if (!res.success || !res.payload) {
        return <ErrorCard message={res.message || 'Failed to fetch playlist'} />;
    }

    const playlistTracks = res.payload.tracks.items;

    const tracks = playlistTracks.map(({ track }) => (track && !('show' in track) ? track : null)).filter((t) => t !== null);

    const sampleDuplicates: T_DuplicateTrack[] = tracks.map((track) => ({
        id: track.id,
        title: track.name,
        artist: track.artists.map((a) => a.name).join(', '),
        album: track.album.name,
        cover: track.album.images[0]?.url || '',
        duplicates: [
            {
                id: track.id,
                title: track.name,
                artist: track.artists.map((a) => a.name).join(', '),
                album: track.album.name,
                cover: track.album.images[0]?.url || '',
            },
            {
                id: track.id,
                title: track.name,
                artist: track.artists.map((a) => a.name).join(', '),
                album: track.album.name,
                cover: track.album.images[0]?.url || '',
            },
        ],
    }));

    return (
        <main className="p-6">
            <h1 className="text-highlight font-alegreya mb-6 text-center text-3xl font-bold sm:text-4xl">Duplicate Tracks</h1>
            <GroupedDuplicateTrackList duplicates={sampleDuplicates} source="spotify" />
        </main>
    );
};

export default Page;
