'use client';

import { useCallback } from 'react';

import stringSimilarity from 'string-similarity';

import useSafeApiCall from '@/hooks/useSafeApiCall';
import { T_AudioPlayerTrack, T_TrackContext } from '@/lib/types/client.types';
import { T_Song } from '@/lib/types/jio-saavn/song.types';
import { T_SpotifySimplifiedTrack } from '@/lib/types/spotify.types';

const useMapSpotifyTracksToSaavn = () => {
    const { isPending, makeParallelApiCalls } = useSafeApiCall<
        null,
        {
            total: number;
            start: number;
            results: T_Song[];
        }
    >();

    const mapTracks = useCallback(
        async ({ context, spotifyTracks }: { context: T_TrackContext; spotifyTracks: T_SpotifySimplifiedTrack[] }) => {
            const cacheKey = `saavn:${context.type}:${context.id}`;
            const cachedData = sessionStorage.getItem(cacheKey);

            // Use cached version if already matched
            if (cachedData && JSON.parse(cachedData).length === spotifyTracks.length) {
                const cachedTracks = JSON.parse(cachedData) as T_AudioPlayerTrack[];
                return cachedTracks;
            }

            // Fetch matching Saavn songs for each Spotify track
            const saavnResponses = await makeParallelApiCalls(
                spotifyTracks.map((spotifyTrack) => {
                    const trackName = spotifyTrack.name;
                    const artistNames = spotifyTrack.artists.map((artist) => artist.name).join(' ');
                    return {
                        url: '/api/saavn/search/songs',
                        params: { query: `${trackName} ${artistNames}` },
                    };
                })
            );

            const matchedTracks: T_AudioPlayerTrack[] = [];
            const usedTrackIds = new Set<string>();

            spotifyTracks.forEach((spotifyTrack, index) => {
                const saavnSearchResult = saavnResponses[index];
                if (!saavnSearchResult?.results?.length) return;

                const spotifyTitle = spotifyTrack.name.trim().toLowerCase();
                const spotifyArtistNames = spotifyTrack.artists.map((a) => a.name.toLowerCase());

                const bestMatch = saavnSearchResult.results.find((saavnTrack) => {
                    const saavnTitle = saavnTrack.name.trim().toLowerCase();
                    const similarityScore = stringSimilarity.compareTwoStrings(spotifyTitle, saavnTitle);

                    if (similarityScore < 0.6) return false;

                    const saavnArtistNames = saavnTrack.artists.primary.map((a) => a.name.toLowerCase());
                    const hasMatchingArtist = saavnArtistNames.some((artist) => spotifyArtistNames.includes(artist));

                    return hasMatchingArtist;
                });

                if (bestMatch && !usedTrackIds.has(bestMatch.id)) {
                    usedTrackIds.add(bestMatch.id);

                    const audioTrack: T_AudioPlayerTrack = {
                        spotifyId: spotifyTrack.id,
                        saavnId: bestMatch.id,
                        urls: bestMatch.downloadUrl,
                        title: bestMatch.name,
                        album: bestMatch.album.name,
                        artists: bestMatch.artists.primary.map((a) => a.name).join(', '),
                        covers: bestMatch.image,
                    };

                    matchedTracks.push(audioTrack);
                }
            });

            sessionStorage.setItem(cacheKey, JSON.stringify(matchedTracks));
            return matchedTracks;
        },
        [makeParallelApiCalls]
    );

    return {
        isPending,
        mapTracks,
    };
};

export default useMapSpotifyTracksToSaavn;
