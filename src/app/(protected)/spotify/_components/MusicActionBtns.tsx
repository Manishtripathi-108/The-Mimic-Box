'use client';

import { useCallback } from 'react';

import toast from 'react-hot-toast';
import stringSimilarity from 'string-similarity';

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
    const { setQueue, toggleFadePlay, playbackContext, playing } = useAudioPlayerContext();
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
        const cacheKey = `saavn:${context.type}:${context.id}`;
        const storedQueue = sessionStorage.getItem(cacheKey);

        if (storedQueue && JSON.parse(storedQueue).length === spotifyTracks.length) {
            const storedQueueList = JSON.parse(storedQueue) as T_AudioPlayerTrack[];
            return storedQueueList;
        }

        const saavnResults = await makeParallelApiCalls(
            spotifyTracks.map((track) => {
                const name = track.name;
                const artistNames = track.artists.map((a) => a.name).join(' ');
                return {
                    url: '/api/saavn/search/songs',
                    params: { query: `${name} ${artistNames}` },
                };
            })
        );

        const playableQueue: T_AudioPlayerTrack[] = [];
        const seenTrackIds = new Set<string>();

        spotifyTracks.forEach((spotifyTrack, i) => {
            const saavnRes = saavnResults[i];
            if (!saavnRes?.results?.length) return;

            const spotifyTitle = spotifyTrack.name.trim().toLowerCase();
            const spotifyArtists = spotifyTrack.artists.map((a) => a.name.toLowerCase());

            const match = saavnRes.results.find((saavnTrack) => {
                const saavnTitle = saavnTrack.name.trim().toLowerCase();
                const similarity = stringSimilarity.compareTwoStrings(spotifyTitle, saavnTitle);

                if (similarity < 0.6) return false; // skip low-confidence matches

                const saavnArtists = saavnTrack.artists.primary.map((a) => a.name.toLowerCase());
                const hasOverlap = saavnArtists.some((a) => spotifyArtists.includes(a));
                return hasOverlap;
            });

            if (match && !seenTrackIds.has(match.id)) {
                seenTrackIds.add(match.id);

                const newTrack: T_AudioPlayerTrack = {
                    id: match.id,
                    urls: match.downloadUrl,
                    title: match.name,
                    album: match.album.name,
                    artists: match.artists.primary.map((a) => a.name).join(', '),
                    covers: match.image,
                };

                playableQueue.push(newTrack);
            }
        });

        sessionStorage.setItem(cacheKey, JSON.stringify(playableQueue));

        const end = performance.now();
        console.log(`⏱️ Took ${(end - start) / 1000}s`);
        return playableQueue;
    }, [spotifyTracks, context, makeParallelApiCalls]);

    const handlePlay = useCallback(() => {
        if (isCurrentTrack) {
            toggleFadePlay();
        } else {
            mapSpotifyToSaavn().then((playableQueue) => {
                if (playableQueue.length > 0) {
                    setQueue(playableQueue, context, true);
                } else {
                    toast.error('No playable tracks found');
                }
            });
        }
    }, [isCurrentTrack, mapSpotifyToSaavn, setQueue, toggleFadePlay, context]);

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
                className="bg-tertiary text-text-secondary absolute inset-auto mt-2 rounded-md border shadow-lg [position-area:bottom]">
                <ul className="divide-y">
                    <li>download</li>
                    <li>do something</li>
                </ul>
            </div>
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
