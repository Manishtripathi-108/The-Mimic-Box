'use client';

import { useCallback } from 'react';

import Icon from '@/components/ui/Icon';
import { useAudioPlayerContext } from '@/contexts/audioPlayer.context';
import useSafeApiCall from '@/hooks/useSafeApiCall';
import { T_AudioPlayerTrack, T_TrackContext } from '@/lib/types/client.types';
import { T_Song } from '@/lib/types/jio-saavn/song.types';
import { T_SpotifySimplifiedTrack } from '@/lib/types/spotify.types';
import cn from '@/lib/utils/cn';

type Props = {
    className?: string;
    context: T_TrackContext;
    spotifyTracks: T_SpotifySimplifiedTrack[];
};

const MusicActionBtns = ({ className, context, spotifyTracks }: Props) => {
    const { setQueue, toggleFadePlay, addToQueue, playbackContext, playing } = useAudioPlayerContext();
    const { isPending, makeParallelApiCalls } = useSafeApiCall<
        null,
        {
            total: number;
            start: number;
            results: T_Song[];
        }
    >();
    const isCurrentTrack = playbackContext?.id === context?.id;
    const isTrackPlaying = isCurrentTrack && playing;

    const mapSpotifyToSaavn = useCallback(async () => {
        const start = performance.now();
        const cacheKey = `saavn:${context.type}${context.id}`;

        let playableQueue: T_AudioPlayerTrack[] = [];

        const saavnResults = await makeParallelApiCalls(
            spotifyTracks.map((track, i) => {
                const name = track.name;
                const artistNames = track.artists.map((artist) => artist.name).join(' ');
                return {
                    url: '/api/saavn/search/songs',
                    params: {
                        query: `${name} ${artistNames}`,
                        limit: 5,
                    },
                    onSuccess:
                        i === 0
                            ? (data) => {
                                  setQueue(
                                      [
                                          {
                                              id: data.results[0].id,
                                              urls: data.results[0].downloadUrl,
                                              title: data.results[0].name,
                                              album: data.results[0].album.name,
                                              artists: artistNames,
                                              covers: data.results[0].image,
                                          },
                                      ],
                                      context,
                                      true
                                  );
                              }
                            : undefined,
                };
            })
        );

        console.log(saavnResults);

        playableQueue = saavnResults
            .map((res) => {
                return (
                    res.results.length > 0 && {
                        id: res.results[0].id,
                        urls: res.results[0].downloadUrl,
                        title: res.results[0].name,
                        album: res.results[0].album.name,
                        artists: res.results[0].artists.primary.map((artist) => artist.name).join(', '),
                        covers: res.results[0].image,
                    }
                );
            })
            .filter((track) => track !== false && track !== null);

        localStorage.setItem(cacheKey, JSON.stringify(playableQueue));

        const end = performance.now();
        console.log(`⏱️ Took ${(end - start) / 1000}s`);
        return playableQueue;
    }, [spotifyTracks, context, setQueue, makeParallelApiCalls]);

    const handlePlay = useCallback(() => {
        if (isCurrentTrack) {
            toggleFadePlay();
        } else {
            const queue = mapSpotifyToSaavn();
            queue.then((playableQueue) => {
                if (playableQueue.length > 0) {
                    addToQueue(playableQueue);
                }
            });
        }
    }, [isCurrentTrack, addToQueue, mapSpotifyToSaavn]);

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
