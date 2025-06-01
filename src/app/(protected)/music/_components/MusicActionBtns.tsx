'use client';

import { useCallback } from 'react';

import MusicDownloadPopover from '@/app/(protected)/music/_components/MusicDownloadPopover';
import Icon from '@/components/ui/Icon';
import { useAudioPlayerContext } from '@/contexts/AudioPlayer.context';
import useAudioSourceTrackMapper from '@/hooks/useAudioSourceTrackMapper';
import { T_AudioSourceContext } from '@/lib/types/client.types';
import { shareUrl } from '@/lib/utils/client.utils';
import cn from '@/lib/utils/cn';

const MusicActionBtns = ({ className, context }: { className?: string; context: T_AudioSourceContext }) => {
    const { setQueue, toggleFadePlay, playbackContext, playing } = useAudioPlayerContext();
    const { isPending, getPlayableTracks } = useAudioSourceTrackMapper();
    const isCurrentTrack = playbackContext?.id === context?.id;
    const isTrackPlaying = isCurrentTrack && playing;

    const handlePlay = useCallback(() => {
        if (isCurrentTrack) {
            toggleFadePlay();
        } else {
            if (isPending) return;

            getPlayableTracks(context)
                .then((tracks) => {
                    if (!tracks.length) {
                        throw new Error('No valid tracks found for selected context');
                    }
                    setQueue(tracks, context);
                    setTimeout(() => toggleFadePlay(), 100);
                })
                .catch((err) => {
                    console.error(err);
                    shareUrl({ url: window.location.href });
                });
        }
    }, [isCurrentTrack, toggleFadePlay, isPending, getPlayableTracks, setQueue, context]);

    return (
        <div className={cn('mx-auto flex items-end justify-center gap-x-6 px-4 sm:justify-between', className)}>
            <button
                type="button"
                aria-label="Share"
                onClick={() => shareUrl({ url: window.location.href })}
                className="button inline-flex size-9 rounded-full p-2">
                <Icon icon="share" />
            </button>

            <button
                type="button"
                onClick={handlePlay}
                aria-label={isTrackPlaying ? 'Pause' : 'Play'}
                title={isTrackPlaying ? 'Pause' : 'Play'}
                className="button button-highlight inline-flex size-14 rounded-full p-2"
                disabled={isPending}>
                <Icon icon={isPending ? 'loading' : isTrackPlaying ? 'pauseToPlay' : 'playToPause'} />
            </button>

            <button
                type="button"
                popoverTarget="moreOptions-popover"
                aria-label="More Options"
                className="button inline-flex size-9 rounded-full p-2">
                <Icon icon="moreDots" className="size-full rotate-90" />
            </button>

            <div
                id="moreOptions-popover"
                popover="auto"
                className="bg-tertiary text-text-secondary absolute inset-auto mr-1 rounded-md border shadow-lg [position-area:left_span-bottom]">
                <ul className="divide-y">
                    <li>
                        <button
                            type="button"
                            popoverTarget="download-popover"
                            className="hover:bg-highlight block w-full cursor-pointer px-4 py-2 text-sm capitalize hover:text-white">
                            download {context.type}
                        </button>
                    </li>
                </ul>
            </div>

            <MusicDownloadPopover context={context} popover="auto" className="mr-1 [position-area:left_span-top]" />
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
