'use client';

import { useCallback, useState } from 'react';

import stringSimilarity from 'string-similarity';

import { saavnGetEntityTracks } from '@/actions/saavn.actions';
import { spotifyGetEntityTracks } from '@/actions/spotify.actions';
import useSafeApiCall from '@/hooks/useSafeApiCall';
import { T_AudioPlayerTrack, T_AudioSourceContext } from '@/lib/types/client.types';
import { T_SaavnSong } from '@/lib/types/saavn/song.types';
import { T_SpotifySimplifiedTrack } from '@/lib/types/spotify.types';
import { chunkArray } from '@/lib/utils/core.utils';
import { buildAudioCacheKey } from '@/lib/utils/music.utils';

const CACHE_DURATION_MS = 15 * 24 * 60 * 60 * 1000; // 15 days

const normalize = (s: string) => s.trim().toLowerCase();

const getCachedTracks = (cacheKey: string): { data: T_AudioPlayerTrack[]; snapshotId?: string } | null => {
    try {
        const raw = localStorage.getItem(cacheKey);
        if (!raw) return null;

        const { data, timestamp, snapshotId } = JSON.parse(raw);
        if (Date.now() - timestamp < CACHE_DURATION_MS) return { data, snapshotId };

        localStorage.removeItem(cacheKey);
    } catch {
        localStorage.removeItem(cacheKey);
    }
    return null;
};

const saveToCache = (cacheKey: string, tracks: T_AudioPlayerTrack[], snapshotId?: string) => {
    localStorage.setItem(
        cacheKey,
        JSON.stringify({
            data: tracks,
            snapshotId: snapshotId || null,
            timestamp: Date.now(),
        })
    );
};

const matchSaavnTrack = (spotifyTrack: T_SpotifySimplifiedTrack, saavnResults: T_SaavnSong[]): T_SaavnSong | null => {
    const spotifyTitle = normalize(spotifyTrack.name);
    const spotifyArtists = spotifyTrack.artists.map((a) => normalize(a.name));

    let bestMatch: T_SaavnSong | null = null;
    let bestScore = 0;

    for (const saavnTrack of saavnResults) {
        const saavnTitle = normalize(saavnTrack.name);
        const titleScore = stringSimilarity.compareTwoStrings(spotifyTitle, saavnTitle);
        if (titleScore < 0.7) continue;

        const saavnArtists = saavnTrack.artists.primary.map((a) => normalize(a.name));
        const artistMatched = saavnArtists.some((sa) => spotifyArtists.some((sp) => sp.includes(sa) || sa.includes(sp)));
        if (!artistMatched) continue;

        if (titleScore > bestScore) {
            bestMatch = saavnTrack;
            bestScore = titleScore;
        }
    }

    return bestMatch;
};

const useAudioSourceTrackMapper = () => {
    const { makeParallelApiCalls } = useSafeApiCall<null, { total: number; start: number; results: T_SaavnSong[] }>();
    const [isPending, setIsPending] = useState(false);

    const mapSpotifyToSaavnTracks = useCallback(
        async ({
            context,
            spotifyTracks,
            snapshotId,
        }: {
            context: T_AudioSourceContext;
            spotifyTracks: T_SpotifySimplifiedTrack[];
            snapshotId?: string;
        }): Promise<T_AudioPlayerTrack[]> => {
            setIsPending(true);

            const matchedTracks: T_AudioPlayerTrack[] = [];
            const usedSaavnIds = new Map<string, boolean>();
            const cacheKey = buildAudioCacheKey(context);

            const cached = getCachedTracks(cacheKey);
            let remainingTracks = spotifyTracks;

            if (cached && cached.data.length) {
                const cachedSpotifyIds = new Set(cached.data.map((t) => t.id));
                matchedTracks.push(...cached.data);
                remainingTracks = spotifyTracks.filter((t) => !cachedSpotifyIds.has(t.id));

                if (!remainingTracks.length) {
                    setIsPending(false);
                    return cached.data;
                }
            }

            const queries = remainingTracks.map((track) => ({
                url: '/api/saavn/search/songs',
                params: {
                    query: `${track.name} ${track.artists.map((a) => a.name).join(' ')}`,
                },
            }));

            const batchedQueries = chunkArray(queries, 50);

            const responses: { total: number; start: number; results: T_SaavnSong[] }[] = [];

            for (const batch of batchedQueries) {
                try {
                    const res = await makeParallelApiCalls(batch);
                    responses.push(...res);
                } catch (e) {
                    console.warn('Skipping failed batch:', e);
                }
            }

            remainingTracks.forEach((spotifyTrack, i) => {
                const saavnResults = responses[i]?.results;
                if (!saavnResults?.length) return;

                const match = matchSaavnTrack(spotifyTrack, saavnResults);

                if (match && !usedSaavnIds.has(match.id)) {
                    usedSaavnIds.set(match.id, true);
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

            if (matchedTracks.length > 0) {
                saveToCache(cacheKey, matchedTracks, snapshotId);
            }
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
                if (context.type === 'playlist' && context.snapshotId) {
                    const cacheKey = buildAudioCacheKey(context);
                    const cached = getCachedTracks(cacheKey);
                    if (cached && cached.snapshotId === context.snapshotId) {
                        setIsPending(false);
                        return cached.data;
                    }
                }

                const res = await spotifyGetEntityTracks(context.id, context.type);
                if (!res.success || !res.payload) {
                    setIsPending(false);
                    return [];
                }

                const tracks = await mapSpotifyToSaavnTracks({ context, spotifyTracks: res.payload, snapshotId: context.snapshotId });
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
