'use client';

import { useCallback } from 'react';

import toast from 'react-hot-toast';

import MusicDownloadPopover from '@/app/(protected)/spotify/_components/MusicDownloadPopover';
import Icon from '@/components/ui/Icon';
import { useAudioPlayerContext } from '@/contexts/AudioPlayer.context';
import useMapSpotifyTracksToSaavn from '@/hooks/useMapSpotifyTracksToSaavn';
import { T_AudioPlayerTrack, T_AudioSourceContext } from '@/lib/types/client.types';
import { T_Song } from '@/lib/types/saavn/song.types';
import { T_SpotifySimplifiedTrack } from '@/lib/types/spotify.types';
import { shareUrl } from '@/lib/utils/client.utils';
import cn from '@/lib/utils/cn';

type Props = {
    className?: string;
    context: T_AudioSourceContext;
    spotifyTracks?: T_SpotifySimplifiedTrack[];
    saavnTracks?: T_Song[];
    playTracks?: T_AudioPlayerTrack[];
};

const MusicActionBtns = ({ className, context, spotifyTracks, saavnTracks }: Props) => {
    const { setQueue, toggleFadePlay, playbackContext, playing } = useAudioPlayerContext();
    const { isPending, mapTracks } = useMapSpotifyTracksToSaavn();
    const isCurrentTrack = playbackContext?.id === context?.id;
    const isTrackPlaying = isCurrentTrack && playing;

    const handlePlay = useCallback(() => {
        if (isCurrentTrack) {
            toggleFadePlay();
        } else {
            if (spotifyTracks) {
                mapTracks({ context, spotifyTracks }).then((playableQueue) => {
                    if (playableQueue.length > 0) {
                        setQueue(playableQueue, context, true);
                    } else {
                        toast.error('No playable tracks found');
                    }
                });
            } else if (saavnTracks) {
                const saavnPlayableTracks: T_AudioPlayerTrack[] = saavnTracks.map((track) => {
                    return {
                        saavnId: track.id,
                        title: track.name,
                        album: track.album.name,
                        year: track.year,
                        duration: track.duration,
                        language: track.language,
                        artists: track.artists.primary.map((a) => a.name).join(', '),
                        urls: track.downloadUrl,
                        covers: track.image,
                    };
                });
                setQueue(saavnPlayableTracks, context, true);
            }
        }
    }, [isCurrentTrack, mapTracks, setQueue, toggleFadePlay, context, spotifyTracks, saavnTracks]);

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
            {spotifyTracks && <MusicDownloadPopover context={context} popover="auto" className="mr-1 [position-area:left_span-top]" />}
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
