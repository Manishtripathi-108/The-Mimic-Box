'use client';

import { useCallback, useState } from 'react';

import { saavnSearchSongs } from '@/actions/jio-saavn.actions';
import Icon from '@/components/ui/Icon';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { T_AudioPlayerTrack, T_TrackContext } from '@/lib/types/client.types';
import { T_SpotifySimplifiedTrack } from '@/lib/types/spotify.types';
import cn from '@/lib/utils/cn';

type Props = {
    className?: string;
    context: T_TrackContext;
    spotifyTracks: T_SpotifySimplifiedTrack[];
};

const MusicActionBtns = ({ className, context, spotifyTracks }: Props) => {
    const { setQueue, isPlaying, trackContext, togglePlay } = useAudioPlayer();
    const [isPending, setIsPending] = useState(false);

    const isCurrentTrack = trackContext?.id === context?.id;
    const isTrackPlaying = isCurrentTrack && isPlaying;

    const mapSpotifyToSaavn = useCallback(async () => {
        const start = performance.now();
        setIsPending(true);
        const cacheKey = `saavn:${context.type}${context.id}`;

        let playableQueue: T_AudioPlayerTrack[] = [];

        if (localStorage.getItem(cacheKey)) {
            const saavnResults = await Promise.allSettled(
                spotifyTracks.map(async (track, i) => {
                    console.log(`🎵 Starting fetch for track ${i}`);
                    const artistNames = track.artists.map((artist) => artist.name).join(' ');
                    const saavnRes = await saavnSearchSongs({
                        query: `${track.name} ${artistNames}`,
                        limit: 5,
                    });

                    if (!saavnRes.success || !saavnRes.payload?.results?.length) return null;

                    const saavnTrack = saavnRes.payload.results[0];

                    return {
                        id: saavnTrack.id,
                        urls: saavnTrack.downloadUrl,
                        title: saavnTrack.name,
                        album: saavnTrack.album.name,
                        artists: artistNames,
                        covers: saavnTrack.image,
                    } satisfies T_AudioPlayerTrack;
                })
            );

            playableQueue = saavnResults
                .filter((res) => res.status === 'fulfilled' && res.value)
                .map((res) => (res as PromiseFulfilledResult<T_AudioPlayerTrack>).value);

            localStorage.setItem(cacheKey, JSON.stringify(playableQueue));
        } else {
            playableQueue = JSON.parse(localStorage.getItem(cacheKey) || '[]');
        }

        setIsPending(false);
        const end = performance.now();
        console.log(`⏱️ Took ${(end - start) / 1000}s`);
        return playableQueue;
    }, [spotifyTracks, context]);

    const handlePlay = useCallback(() => {
        if (isCurrentTrack) {
            togglePlay();
        } else {
            const queue = mapSpotifyToSaavn();
            queue.then((playableQueue) => {
                if (playableQueue.length > 0) {
                    setQueue(playableQueue, context, true);
                }
            });
        }
    }, [isCurrentTrack, togglePlay, setQueue, mapSpotifyToSaavn, context]);

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
                className="button button-highlight inline-flex size-14 rounded-full p-2"
                disabled={isPending}>
                <Icon icon={isPending ? 'loading' : isTrackPlaying ? 'pauseToPlay' : 'playToPause'} className="size-full" />
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
