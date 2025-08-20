import { Metadata } from 'next';

import { spotifyGetEntityTracks } from '@/actions/spotify.actions';
import DuplicateTracks from '@/app/(protected)/tune-sync/remove-duplicates/_components/DuplicateTracks';
import ErrorCard from '@/components/layout/ErrorCard';
import { IMAGE_FALLBACKS } from '@/constants/common.constants';
import { T_TrackBase } from '@/lib/types/common.types';
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

    const mappedTracks = res.payload.flatMap<T_TrackBase>((track, i) => {
        if (!track || 'show' in track) return [];

        const t = track as T_SpotifyTrack;

        return [
            {
                id: t.id,
                title: t.name,
                album: t.album.name,
                artist: t.artists.map((a) => a.name).join(', '),
                cover: t.album.images[0]?.url ?? IMAGE_FALLBACKS.AUDIO_COVER,
                position: i,
            },
        ];
    });

    if (mappedTracks.length === 0) return <ErrorCard message="Playlist is empty" />;

    return <DuplicateTracks tracks={mappedTracks} playlistId={id} />;
};

export default Page;
