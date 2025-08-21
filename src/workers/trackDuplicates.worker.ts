import { exposeWorker } from 'react-hooks-worker';
import stringSimilarity from 'string-similarity';

import { T_DuplicateReason, T_DuplicateTrack, T_TrackBase } from '@/lib/types/common.types';

// Threshold for similarity
const SIMILARITY_THRESHOLD = 0.8;

function isDuplicate(a: T_TrackBase, b: T_TrackBase) {
    const titleScore = stringSimilarity.compareTwoStrings(a.title, b.title);
    const artistScore = stringSimilarity.compareTwoStrings(a.artist, b.artist);
    return titleScore > SIMILARITY_THRESHOLD && artistScore > SIMILARITY_THRESHOLD;
}

async function* identifyDuplicates(tracks: T_TrackBase[]) {
    if (!tracks || tracks.length === 0) {
        return;
    }

    let processed = 0;
    let progress = 0;
    const total = tracks.length;
    const seenIds = new Set<string>();
    const seenTracks: T_TrackBase[] = [];
    const duplicateMap = new Map<string, T_DuplicateTrack>();

    for (const track of tracks) {
        let original = track;
        let reason: T_DuplicateReason | null = null;

        if (seenIds.has(track.id)) {
            reason = 'same-id';
            const seenTrack = seenTracks.find((t) => t.id === track.id);
            if (seenTrack) original = seenTrack;
        } else {
            for (const prev of seenTracks) {
                if (isDuplicate(track, prev)) {
                    original = prev;
                    reason = 'same-name-artist';
                    break;
                }
            }
        }

        if (reason) {
            const key = `${original.artist}|${original.title}`;
            const duplicateEntry = { ...track, reason };

            if (duplicateMap.has(key)) {
                const entry = duplicateMap.get(key)!;
                entry.duplicates.push(duplicateEntry);
                entry.isSameId ||= duplicateEntry.reason === 'same-id';
            } else {
                duplicateMap.set(key, { ...original, duplicates: [duplicateEntry], isSameId: duplicateEntry.reason === 'same-id' });
            }
        } else {
            seenIds.add(track.id);
            seenTracks.push(track);
        }

        const newProgress = Math.round((++processed / total) * 100);

        if (newProgress !== progress) {
            progress = newProgress;
            yield { progress: newProgress, duplicateCount: duplicateMap.size, duplicates: null };
        }
    }

    // final result
    yield {
        progress: 100,
        duplicateCount: duplicateMap.size,
        duplicates: Array.from(duplicateMap.values()),
    };
}

exposeWorker(identifyDuplicates);
