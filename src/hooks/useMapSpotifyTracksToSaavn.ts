'use client';

import { useCallback } from 'react';

import stringSimilarity from 'string-similarity';

import useSafeApiCall from '@/hooks/useSafeApiCall';
import { T_AudioPlayerTrack, T_TrackContext } from '@/lib/types/client.types';
import { T_Song } from '@/lib/types/saavn/song.types';
import { T_SpotifySimplifiedTrack } from '@/lib/types/spotify.types';

const CACHE_DURATION_MS = 15 * 24 * 60 * 60 * 1000; // 15 days

const useMapSpotifyTracksToSaavn = () => {
    const { isPending, makeParallelApiCalls } = useSafeApiCall<null, { total: number; start: number; results: T_Song[] }>();

    const mapTracks = useCallback(
        async ({ context, spotifyTracks }: { context: T_TrackContext; spotifyTracks: T_SpotifySimplifiedTrack[] }): Promise<T_AudioPlayerTrack[]> => {
            const matchedTracks: T_AudioPlayerTrack[] = [];
            const usedSaavnTrackIds = new Set<string>();

            const cacheKey = `saavn:${context.type}:${context.id}`;
            const cachedDataRaw = localStorage.getItem(cacheKey);
            let remainingSpotifyTracks = spotifyTracks;

            // Check cached value with expiry
            if (cachedDataRaw) {
                try {
                    const { data: cached, timestamp } = JSON.parse(cachedDataRaw);
                    if (Date.now() - timestamp < CACHE_DURATION_MS) {
                        const cachedSpotifyIds = new Set(cached.map((t: T_AudioPlayerTrack) => t.spotifyId));
                        matchedTracks.push(...cached);

                        remainingSpotifyTracks = spotifyTracks.filter((t) => !cachedSpotifyIds.has(t.id));
                        if (remainingSpotifyTracks.length === 0) return cached;
                    } else {
                        localStorage.removeItem(cacheKey); // Invalidate old cache
                    }
                } catch (err) {
                    console.warn('Invalid cache, ignoring.', err);
                    localStorage.removeItem(cacheKey);
                }
            }

            if (remainingSpotifyTracks.length === 0) return matchedTracks;

            const searchQueries = remainingSpotifyTracks.map((track) => ({
                url: '/api/saavn/search/songs',
                params: { query: `${track.name} ${track.artists.map((a) => a.name).join(' ')}` },
            }));

            const saavnResponses = await makeParallelApiCalls(searchQueries);

            remainingSpotifyTracks.forEach((spotifyTrack, index) => {
                const saavnResult = saavnResponses[index];
                if (!saavnResult?.results?.length) return;

                const spotifyTitle = spotifyTrack.name.trim().toLowerCase();
                const spotifyArtists = spotifyTrack.artists.map((a) => a.name.toLowerCase());

                let bestMatch: T_Song | null = null;
                let bestScore = 0;

                for (const saavnTrack of saavnResult.results) {
                    const saavnTitle = saavnTrack.name.trim().toLowerCase();
                    const titleScore = stringSimilarity.compareTwoStrings(spotifyTitle, saavnTitle);
                    if (titleScore < 0.6) continue;

                    const saavnArtists = saavnTrack.artists.primary.map((a) => a.name.toLowerCase());
                    const artistMatched = saavnArtists.some((a) => spotifyArtists.includes(a));

                    if (!artistMatched) continue;

                    if (titleScore > bestScore) {
                        bestMatch = saavnTrack;
                        bestScore = titleScore;
                    }
                }

                if (bestMatch && !usedSaavnTrackIds.has(bestMatch.id)) {
                    usedSaavnTrackIds.add(bestMatch.id);
                    matchedTracks.push({
                        spotifyId: spotifyTrack.id,
                        saavnId: bestMatch.id,
                        title: bestMatch.name,
                        album: bestMatch.album.name,
                        year: bestMatch.year,
                        duration: bestMatch.duration,
                        language: bestMatch.language,
                        artists: bestMatch.artists.primary.map((a) => a.name).join(', '),
                        urls: bestMatch.downloadUrl,
                        covers: bestMatch.image,
                    });
                }
            });

            // Cache updated result with timestamp
            localStorage.setItem(
                cacheKey,
                JSON.stringify({
                    data: matchedTracks,
                    timestamp: Date.now(),
                })
            );

            return matchedTracks;
        },
        [makeParallelApiCalls]
    );

    return { isPending, mapTracks };
};

export default useMapSpotifyTracksToSaavn;
