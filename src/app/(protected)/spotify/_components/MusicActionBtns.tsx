'use client';

import { useCallback } from 'react';

import Icon from '@/components/ui/Icon';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { T_AudioPlayerTrack, T_TrackContext } from '@/lib/types/client.types';
import cn from '@/lib/utils/cn';

type Props = {
    className?: string;
    context: T_TrackContext;
    queue: T_AudioPlayerTrack[];
};

const MusicActionBtns = ({ className, context, queue }: Props) => {
    const { setQueue, isPlaying, play, trackContext, togglePlay } = useAudioPlayer();

    const isCurrentTrack = trackContext?.id === context.id;
    const isTrackPlaying = isCurrentTrack && isPlaying;

    const handlePlay = useCallback(() => {
        if (isCurrentTrack) {
            togglePlay();
        } else {
            setQueue(queue, context);
            play();
        }
    }, [isCurrentTrack, togglePlay, setQueue, queue, context, play]);

    return (
        <div className={cn('mx-auto flex items-end justify-center gap-x-6 px-4 sm:justify-between', className)}>
            <button type="button" aria-label="Share Track" className="button inline-flex size-9 rounded-full p-2">
                <Icon icon="share" className="size-full" />
            </button>

            <button
                type="button"
                onClick={handlePlay}
                aria-label={isTrackPlaying ? 'Pause' : 'Play'}
                title={isTrackPlaying ? 'Pause' : 'Play'}
                className="button button-highlight inline-flex size-14 rounded-full p-2">
                <Icon icon={isTrackPlaying ? 'pauseToPlay' : 'playToPause'} className="size-full" />
            </button>

            <button type="button" aria-label="More Options" className="button inline-flex size-9 rounded-full p-2">
                <Icon icon="moreDots" className="size-full rotate-90" />
            </button>
        </div>
    );
};

export const MusicActionBtnsSkeleton = ({ className }: { className?: string }) => (
    <div className={cn('mx-auto flex animate-pulse items-end justify-center gap-x-6 px-4 sm:justify-between', className)}>
        <div className="bg-secondary size-9 rounded-full" />
        <div className="bg-secondary size-14 rounded-full" />
        <div className="bg-secondary size-9 rounded-full" />
    </div>
);

export default MusicActionBtns;
