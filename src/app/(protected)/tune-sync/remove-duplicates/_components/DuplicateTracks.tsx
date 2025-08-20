'use client';

import { useEffect, useRef } from 'react';

import DuplicateTrackRemover from '@/app/(protected)/tune-sync/remove-duplicates/_components/DuplicateTrackRemover';
import ErrorCard from '@/components/layout/ErrorCard';
import AnimatedCircularProgressBar, { AnimatedCircularProgressBarHandle } from '@/components/ui/AnimatedCircularProgressBar';
import useTrackDuplicates from '@/hooks/useTrackDuplicates';
import { T_TrackBase } from '@/lib/types/common.types';

type Props = {
    tracks: T_TrackBase[];
    playlistId: string;
};

const DuplicateTracks = ({ tracks, playlistId }: Props) => {
    const ref = useRef<AnimatedCircularProgressBarHandle>(null);
    const { runDuplicateCheck, isProcessing, duplicates, duplicateCount, error } = useTrackDuplicates({ ref });

    useEffect(() => {
        if (tracks.length > 0) runDuplicateCheck(tracks);
    }, [tracks, runDuplicateCheck]);

    if (error) {
        <ErrorCard message={error} />;
    }

    if (isProcessing) {
        return (
            <div className="h-calc-full-height flex flex-col items-center justify-center p-6">
                <h1 className="text-highlight font-alegreya mb-6 text-center text-3xl font-bold sm:text-4xl">Duplicate Tracks</h1>
                <AnimatedCircularProgressBar ref={ref} />
                <p className="text-text-secondary mt-4 text-lg">Finding duplicates...</p>
                <p className="text-text-secondary mt-2 text-sm">{duplicateCount} duplicates found.</p>
            </div>
        );
    }

    return (
        <main className="p-6">
            <h1 className="text-highlight font-alegreya mb-6 text-center text-3xl font-bold sm:text-4xl">Duplicate Tracks</h1>
            {!duplicates || duplicates.length === 0 ? (
                <div className="text-text-secondary mt-8 text-center text-lg">No duplicate tracks found.</div>
            ) : (
                <DuplicateTrackRemover duplicates={duplicates} source="spotify" playlistId={playlistId} />
            )}
        </main>
    );
};

export default DuplicateTracks;
