'use client';

import { useCallback } from 'react';

import toast from 'react-hot-toast';

import MusicDownloadPopover from '@/app/(protected)/music/_components/MusicDownloadPopover';
import { Button } from '@/components/ui/Button';
import { useAudioPlayerContext } from '@/contexts/AudioPlayer.context';
import useAudioSourceTrackMapper from '@/hooks/useAudioSourceTrackMapper';
import { T_AudioSourceContext } from '@/lib/types/client.types';
import { shareUrl } from '@/lib/utils/client.utils';
import cn from '@/lib/utils/cn';
import { buildAudioCacheKey } from '@/lib/utils/music.utils';

const MusicActionBtns = ({ className, context }: { className?: string; context: T_AudioSourceContext }) => {
    const { setQueue, toggleFadePlay, playbackContext, playing } = useAudioPlayerContext();
    const { isPending, getPlayableTracks } = useAudioSourceTrackMapper();
    const isCurrentContext = playbackContext?.id === context?.id;
    const isContextPlaying = isCurrentContext && playing;

    const handlePlay = useCallback(() => {
        if (isCurrentContext) {
            toggleFadePlay();
        } else {
            if (isPending) return;

            getPlayableTracks(context)
                .then((tracks) => {
                    if (!tracks.length) {
                        throw new Error('No valid tracks found. Try Searching instead.');
                    }
                    setQueue(tracks, context);
                    setTimeout(() => toggleFadePlay(), 100);
                })
                .catch((err) => {
                    console.error(err);
                    toast.error(err.message || 'Failed to load tracks');
                });
        }
    }, [isCurrentContext, toggleFadePlay, isPending, getPlayableTracks, setQueue, context]);

    const removeCachedData = useCallback(() => {
        const cacheKey = buildAudioCacheKey(context);
        localStorage.removeItem(cacheKey);
        toast.success('Cache cleared');
    }, [context]);

    return (
        <div className={cn('mx-auto flex items-end justify-center gap-x-6 px-4 sm:justify-between', className)}>
            <Button title="Share" icon="share" aria-label="Share" onClick={() => shareUrl({ url: window.location.href })} />

            <Button
                onClick={handlePlay}
                icon={isPending ? 'loading' : isContextPlaying ? 'play' : 'pause'}
                aria-label={isContextPlaying ? 'Pause' : 'Play'}
                title={isContextPlaying ? 'Pause' : 'Play'}
                variant="highlight"
                className="size-14"
                disabled={isPending}
            />

            <Button popoverTarget="moreOptions-popover" aria-label="More Options" icon="moreDots" iconClassName="rotate-90" />

            <div
                id="moreOptions-popover"
                popover="auto"
                className="bg-tertiary text-text-secondary absolute inset-auto mr-1 rounded-md border shadow-lg [position-area:left_span-top]">
                <ul className="divide-y">
                    <li>
                        <button
                            type="button"
                            onClick={removeCachedData}
                            className="hover:bg-highlight block w-full cursor-pointer px-4 py-2 text-sm capitalize hover:text-white">
                            Remove Cached Data
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            popoverTarget="download-popover"
                            className="hover:bg-highlight block w-full cursor-pointer px-4 py-2 text-sm capitalize hover:text-white">
                            Download {context.type}
                        </button>
                    </li>
                </ul>
            </div>

            <MusicDownloadPopover
                onClose={() => document.getElementById('download-popover')?.hidePopover()}
                context={context}
                popover="auto"
                className="mr-1 [position-area:left_span-top]"
            />
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
