'use client';

import { useCallback } from 'react';

import toast from 'react-hot-toast';

import MusicDownloads from '@/app/(protected)/spotify/_components/MusicDownloads';
import Icon from '@/components/ui/Icon';
import { useAudioPlayerContext } from '@/contexts/audioPlayer.context';
import useMapSpotifyTracksToSaavn from '@/hooks/useMapSpotifyTracksToSaavn';
import { T_TrackContext } from '@/lib/types/client.types';
import { T_SpotifySimplifiedTrack } from '@/lib/types/spotify.types';
import { shareUrl } from '@/lib/utils/client.utils';
import cn from '@/lib/utils/cn';

type Props = {
    className?: string;
    context: T_TrackContext;
    spotifyTracks: T_SpotifySimplifiedTrack[];
};

const MusicActionBtns = ({ className, context, spotifyTracks }: Props) => {
    const { setQueue, toggleFadePlay, playbackContext, playing } = useAudioPlayerContext();
    const { isPending, mapTracks } = useMapSpotifyTracksToSaavn({ context, spotifyTracks });
    const isCurrentTrack = playbackContext?.id === context?.id;
    const isTrackPlaying = isCurrentTrack && playing;

    const handlePlay = useCallback(() => {
        if (isCurrentTrack) {
            toggleFadePlay();
        } else {
            mapTracks().then((playableQueue) => {
                if (playableQueue.length > 0) {
                    setQueue(playableQueue, context, true);
                } else {
                    toast.error('No playable tracks found');
                }
            });
        }
    }, [isCurrentTrack, mapTracks, setQueue, toggleFadePlay, context]);

    return (
        <div className={cn('mx-auto flex items-end justify-center gap-x-6 px-4 sm:justify-between', className)}>
            <button
                type="button"
                aria-label="Share"
                onClick={() => shareUrl({ url: window.location.href })}
                className="button inline-flex size-9 rounded-full p-2">
                <Icon icon="share" className="size-full" />
            </button>

            <button
                type="button"
                onClick={handlePlay}
                aria-label={isTrackPlaying ? 'Pause' : 'Play'}
                title={isTrackPlaying ? 'Pause' : 'Play'}
                className="button button-highlight inline-flex size-14 rounded-full p-2"
                disabled={isPending}>
                <Icon icon={isPending ? 'loading' : isTrackPlaying ? 'pauseToPlay' : 'playToPause'} className="size-full" />
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
            <MusicDownloads context={context} popover="auto" className="mr-1 [position-area:left_span-top]" />
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
