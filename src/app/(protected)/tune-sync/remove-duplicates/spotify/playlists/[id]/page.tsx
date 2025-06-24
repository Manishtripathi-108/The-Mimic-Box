import { Metadata } from 'next';

import { spotifyGetEntityTracks } from '@/actions/spotify.actions';
import DuplicateTracks from '@/app/(protected)/tune-sync/remove-duplicates/_components/DuplicateTracks';
import ErrorCard from '@/components/layout/ErrorCard';
import { T_SpotifyTrack } from '@/lib/types/spotify.types';

export const metadata: Metadata = {
    title: 'Remove Duplicates - Tune Sync',
    description: 'Remove duplicate tracks from your Spotify playlists.',
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const res = await spotifyGetEntityTracks(id, 'playlist');

    if (!res.success || !res.payload) {
        return <ErrorCard message={res.message || 'Failed to fetch playlist'} />;
    }

    const tracks = res.payload.map((track) => (track && !('show' in track) ? track : null)).filter((t) => t !== null);

    return <DuplicateTracks tracks={tracks as T_SpotifyTrack[]} playlistId={id} />;
};

export default Page;
