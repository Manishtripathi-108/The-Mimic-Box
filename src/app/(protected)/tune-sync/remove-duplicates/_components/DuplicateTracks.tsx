'use client';

import { useEffect, useState } from 'react';

import DuplicateTrackRemover from '@/app/(protected)/tune-sync/remove-duplicates/_components/DuplicateTrackRemover';
import { AnimatedCircularProgressBar } from '@/components/ui/AnimatedCircularProgressBar';
import useTrackDuplicates from '@/hooks/useTrackDuplicates';
import { T_DuplicateTrack } from '@/lib/types/common.types';
import { T_SpotifyTrack } from '@/lib/types/spotify.types';

const DuplicateTracks = ({ tracks, playlistId }: { tracks: T_SpotifyTrack[]; playlistId: string }) => {
    const { identifyDuplicateTracks, progress } = useTrackDuplicates();
    const [sampleDuplicates, setSampleDuplicates] = useState<T_DuplicateTrack[]>([]);

    useEffect(() => {
        const duplicates = identifyDuplicateTracks({ tracks, source: 'spotify' });
        setSampleDuplicates(duplicates);
    }, [tracks, identifyDuplicateTracks]);

    if (!sampleDuplicates.length)
        return (
            <div className="h-calc-full-height flex items-center justify-center">
                <AnimatedCircularProgressBar max={100} value={progress * 100} min={0} />
            </div>
        );

    return (
        <main className="p-6">
            <h1 className="text-highlight font-alegreya mb-6 text-center text-3xl font-bold sm:text-4xl">Duplicate Tracks</h1>
            <DuplicateTrackRemover duplicates={sampleDuplicates} source="spotify" playlistId={playlistId} />
        </main>
    );
};

export default DuplicateTracks;
