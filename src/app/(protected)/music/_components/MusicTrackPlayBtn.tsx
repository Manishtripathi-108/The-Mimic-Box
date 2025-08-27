'use client';

import { memo, useMemo } from 'react';

import deepEqual from 'fast-deep-equal';
import toast from 'react-hot-toast';

import Icon from '@/components/ui/Icon';
import { useAudioPlayerContext } from '@/contexts/AudioPlayer.context';
import useAudioSourceTrackMapper from '@/hooks/useAudioSourceTrackMapper';
import { T_AudioSourceContext } from '@/lib/types/client.types';

const MusicTrackPlayBtn = ({ id, context }: { id: string; context: T_AudioSourceContext }) => {
    const { playbackContext, currentTrack, playing, toggleFadePlay, playTrackById, setQueue } = useAudioPlayerContext();
    const { isPending, getPlayableTracks } = useAudioSourceTrackMapper();

    const isSameContext = useMemo(() => deepEqual(playbackContext, context), [playbackContext, context]);
    const isCurrentTrack = useMemo(() => currentTrack?.id === id, [currentTrack, id]);
    const isPlaying = isSameContext && isCurrentTrack && playing;

    const loadAndPlayTrack = async () => {
        const toastId = toast.loading('Loading tracks, please wait...');
        const tracks = await getPlayableTracks(context);
        if (!tracks?.length) {
            toast.error('No valid tracks found. Try Searching instead.', { id: toastId });
            return;
        }

        setQueue(tracks, context);
        setTimeout(() => playTrackById(id), 100);
        toast.success('Tracks loaded and playing', { id: toastId });
    };

    const handlePlayPause = async () => {
        if (isCurrentTrack) return toggleFadePlay();
        if (isSameContext) return playTrackById(id);
        if (isPending) return;
        await loadAndPlayTrack();
    };

    return (
        <button
            type="button"
            onClick={handlePlayPause}
            className="hover:text-text-primary size-5 shrink-0 cursor-pointer transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play'}>
            <Icon icon={isPlaying ? 'pause' : 'play'} />
        </button>
    );
};

export default memo(MusicTrackPlayBtn);
