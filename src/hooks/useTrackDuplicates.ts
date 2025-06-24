'use client';

import { useCallback, useState } from 'react';

import stringSimilarity from 'string-similarity';

import { T_DuplicateTrack } from '@/lib/types/common.types';
import { T_SpotifyTrack } from '@/lib/types/spotify.types';

type Props = {
    tracks: T_SpotifyTrack[];
    source: 'spotify';
};

const SIMILARITY_THRESHOLD = 0.8;

const isDuplicate = (a: { artist: string; album: string; title: string }, b: { artist: string; album: string; title: string }): boolean => {
    const titleScore = stringSimilarity.compareTwoStrings(a.title, b.title);
    const artistScore = stringSimilarity.compareTwoStrings(a.artist, b.artist);
    return titleScore > SIMILARITY_THRESHOLD && artistScore > SIMILARITY_THRESHOLD;
};

const useTrackDuplicates = () => {
    const [progress, setProgress] = useState(0);

    const identifyDuplicateTracks = useCallback(({ tracks, source }: Props): T_DuplicateTrack[] => {
        const total = tracks?.length ?? 0;
        if (total === 0) return [];

        setProgress(0);
        let progressIndex = 0;

        const seenIds = new Set<string>();
        const seenMeta: { artist: string; album: string; title: string; id: string; cover: string; position: number }[] = [];
        const duplicateMap = new Map<string, T_DuplicateTrack>();

        switch (source) {
            case 'spotify':
                for (const track of tracks) {
                    // Update progress
                    setProgress(++progressIndex / total);

                    // Skip invalid tracks
                    if (!track.id || !track.name || !track.artists?.length) continue;

                    const id = track.uri;
                    const artist = track.artists.map((a) => a.name).join(', ');
                    const album = track.album?.name || '';
                    const title = track.name;
                    const cover = track.album?.images?.[0]?.url || '';
                    const position = progressIndex;

                    const meta = { id, artist, album, title, cover, position };

                    let original = meta;
                    let reason: 'same-id' | 'same-name-artist' | null = null;

                    if (seenIds.has(id)) {
                        reason = 'same-id';
                    } else {
                        for (const prev of seenMeta) {
                            if (isDuplicate(meta, prev)) {
                                original = prev;
                                reason = 'same-name-artist';
                                break;
                            }
                        }
                    }

                    if (reason) {
                        const key = `${original.artist}|${original.title}`;
                        const duplicateEntry = {
                            ...meta,
                            reason,
                        };

                        if (duplicateMap.has(key)) {
                            duplicateMap.get(key)!.duplicates.push(duplicateEntry);
                        } else {
                            duplicateMap.set(key, {
                                ...original,
                                duplicates: [duplicateEntry],
                            });
                        }
                    } else {
                        seenIds.add(id);
                        seenMeta.push(meta);
                    }
                }
                break;

            default:
                break;
        }

        return Array.from(duplicateMap.values());
    }, []);

    return { progress, identifyDuplicateTracks };
};

export default useTrackDuplicates;
