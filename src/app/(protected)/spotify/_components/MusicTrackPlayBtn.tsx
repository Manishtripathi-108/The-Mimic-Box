'use client';

import { memo, useMemo } from 'react';

import isEqual from 'lodash.isequal';
import toast from 'react-hot-toast';

import { getSpotifyEntityTracks } from '@/actions/spotify.actions';
import Icon from '@/components/ui/Icon';
import { useAudioPlayerContext } from '@/contexts/AudioPlayer.context';
import useMapSpotifyTracksToSaavn from '@/hooks/useMapSpotifyTracksToSaavn';
import { T_TrackContext } from '@/lib/types/client.types';

const MusicTrackBtn = ({ id, context }: { id: string; context: T_TrackContext }) => {
    const { playbackContext, currentTrack, playing, toggleFadePlay, playTrackById, setQueue } = useAudioPlayerContext();
    const { isPending, mapTracks } = useMapSpotifyTracksToSaavn();

    const isSameContext = useMemo(() => isEqual(playbackContext, context), [playbackContext, context]);
    const isCurrentTrack = useMemo(() => currentTrack?.spotifyId === id, [currentTrack, id]);
    const isPlaying = isSameContext && isCurrentTrack && playing;

    const loadAndPlayTrack = async () => {
        const toastId = toast.loading('Loading tracks, please wait...');
        const res = await getSpotifyEntityTracks(context.id, context.type);
        if (!res.success) return toast.error('Failed to fetch Spotify tracks', { id: toastId });

        const tracks = await mapTracks({ context, spotifyTracks: res.payload });
        if (!tracks.length) {
            return toast.error('No valid tracks found for selected context', { id: toastId });
        }

        setQueue(tracks, context);
        setTimeout(() => playTrackById({ spotifyId: id }), 100);
        toast.success('Tracks loaded and playing', { id: toastId });
    };

    const handlePlayPause = async () => {
        if (isCurrentTrack) return toggleFadePlay();
        if (isSameContext) return playTrackById({ spotifyId: id });
        if (isPending) return;
        await loadAndPlayTrack();
    };

    return (
        <button
            type="button"
            onClick={handlePlayPause}
            className="hover:text-text-primary size-7 shrink-0 cursor-pointer transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play'}>
            <Icon icon={isPlaying ? 'pauseToPlay' : 'playToPause'} />
        </button>
    );
};

export default memo(MusicTrackBtn);
