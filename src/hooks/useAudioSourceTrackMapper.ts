'use client';

import { useCallback, useState } from 'react';

import stringSimilarity from 'string-similarity';

import { saavnGetEntityTracks } from '@/actions/saavn.actions';
import { spotifyGetEntityTracks } from '@/actions/spotify.actions';
import useSafeApiCall from '@/hooks/useSafeApiCall';
import { T_AudioPlayerTrack, T_AudioSourceContext } from '@/lib/types/client.types';
import { T_SaavnSong } from '@/lib/types/saavn/song.types';
import { T_SpotifySimplifiedTrack } from '@/lib/types/spotify.types';

const CACHE_DURATION_MS = 15 * 24 * 60 * 60 * 1000; // 15 days

const useAudioSourceTrackMapper = () => {
    const { makeParallelApiCalls } = useSafeApiCall<null, { total: number; start: number; results: T_SaavnSong[] }>();
    const [isPending, setIsPending] = useState(false);

    const buildCacheKey = (context: T_AudioSourceContext) => `${context.source}:${context.type}:${context.id}`;

    const getCachedTracks = (cacheKey: string): T_AudioPlayerTrack[] | null => {
        try {
            const raw = localStorage.getItem(cacheKey);
            if (!raw) return null;

            const { data, timestamp } = JSON.parse(raw);
            if (Date.now() - timestamp < CACHE_DURATION_MS) return data;

            localStorage.removeItem(cacheKey);
        } catch {
            localStorage.removeItem(cacheKey);
        }
        return null;
    };

    const saveToCache = (cacheKey: string, tracks: T_AudioPlayerTrack[]) => {
        localStorage.setItem(
            cacheKey,
            JSON.stringify({
                data: tracks,
                timestamp: Date.now(),
            })
        );
    };

    const matchSaavnTrack = (spotifyTrack: T_SpotifySimplifiedTrack, saavnResults: T_SaavnSong[]): T_SaavnSong | null => {
        const spotifyTitle = spotifyTrack.name.trim().toLowerCase();
        const spotifyArtists = spotifyTrack.artists.map((a) => a.name.toLowerCase());

        let bestMatch: T_SaavnSong | null = null;
        let bestScore = 0;

        for (const saavnTrack of saavnResults) {
            const saavnTitle = saavnTrack.name.trim().toLowerCase();
            const titleScore = stringSimilarity.compareTwoStrings(spotifyTitle, saavnTitle);
            if (titleScore < 0.7) continue;

            const saavnArtists = saavnTrack.artists.primary.map((a) => a.name.toLowerCase());
            const artistMatched = saavnArtists.some((a) => spotifyArtists.includes(a));
            if (!artistMatched) continue;

            if (titleScore > bestScore) {
                bestMatch = saavnTrack;
                bestScore = titleScore;
            }
        }

        return bestMatch;
    };

    const mapSpotifyToSaavnTracks = useCallback(
        async ({
            context,
            spotifyTracks,
        }: {
            context: T_AudioSourceContext;
            spotifyTracks: T_SpotifySimplifiedTrack[];
        }): Promise<T_AudioPlayerTrack[]> => {
            setIsPending(true);

            const matchedTracks: T_AudioPlayerTrack[] = [];
            const usedSaavnIds = new Set<string>();
            const cacheKey = buildCacheKey(context);

            const cached = getCachedTracks(cacheKey);
            let remainingTracks = spotifyTracks;

            if (cached?.length) {
                const cachedSpotifyIds = new Set(cached.map((t) => t.id));
                matchedTracks.push(...cached);
                remainingTracks = spotifyTracks.filter((t) => !cachedSpotifyIds.has(t.id));

                if (!remainingTracks.length) {
                    setIsPending(false);
                    return cached;
                }
            }

            const queries = remainingTracks.map((track) => ({
                url: '/api/saavn/search/songs',
                params: {
                    query: `${track.name} ${track.artists.map((a) => a.name).join(' ')}`,
                },
            }));

            const start = performance.now();
            const batchedQueries = queries.reduce(
                (acc, _, i) => {
                    if (i % 50 === 0) acc.push([]);
                    acc[acc.length - 1].push(queries[i]);
                    return acc;
                },
                [] as { url: string; params: Record<string, string> }[][]
            );

            const responses: {
                total: number;
                start: number;
                results: T_SaavnSong[];
            }[] = [];

            for (const batch of batchedQueries) {
                const res = await makeParallelApiCalls(batch);
                responses.push(...res);
            }

            const end = performance.now();
            console.log(`[useAudioSourceTrackMapper] Saavn API calls took ${((end - start) / 1000).toFixed(2)} seconds`);

            remainingTracks.forEach((spotifyTrack, i) => {
                const saavnResults = responses[i]?.results;
                if (!saavnResults?.length) return;

                const match = matchSaavnTrack(spotifyTrack, saavnResults);

                // this check ensures we only add unique Saavn tracks
                if (match && !usedSaavnIds.has(match.id)) {
                    usedSaavnIds.add(match.id);
                    matchedTracks.push({
                        id: spotifyTrack.id,
                        title: match.name,
                        album: match.album.name,
                        year: match.year,
                        duration: match.duration,
                        language: match.language,
                        artists: match.artists.primary.map((a) => a.name).join(', '),
                        urls: match.downloadUrl,
                        covers: match.image,
                    });
                }
            });

            saveToCache(cacheKey, matchedTracks);
            setIsPending(false);
            return matchedTracks;
        },
        [makeParallelApiCalls]
    );

    const getPlayableTracks = useCallback(
        async (context: T_AudioSourceContext) => {
            setIsPending(true);

            if (context.source === 'saavn') {
                const res = await saavnGetEntityTracks(context.id, context.type);
                setIsPending(false);

                if (!res.success || !res.payload.length) return [];

                return res.payload.map((track) => ({
                    id: track.id,
                    title: track.name,
                    album: track.album?.name,
                    year: track.year,
                    duration: track.duration,
                    language: track.language,
                    artists: track.artists.primary.map((a) => a.name).join(', '),
                    urls: track.downloadUrl,
                    covers: track.image,
                }));
            }

            if (context.source === 'spotify') {
                const res = await spotifyGetEntityTracks(context.id, context.type);
                if (!res.success || !res.payload) {
                    setIsPending(false);
                    return [];
                }

                const tracks = await mapSpotifyToSaavnTracks({ context, spotifyTracks: res.payload });
                setIsPending(false);
                return tracks;
            }

            setIsPending(false);
            return [];
        },
        [mapSpotifyToSaavnTracks]
    );

    return { isPending, mapSpotifyToSaavnTracks, getPlayableTracks };
};

export default useAudioSourceTrackMapper;
