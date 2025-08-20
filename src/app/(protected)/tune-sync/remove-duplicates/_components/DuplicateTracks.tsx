'use client';

import { useEffect, useRef, useState } from 'react';

import DuplicateTrackRemover from '@/app/(protected)/tune-sync/remove-duplicates/_components/DuplicateTrackRemover';
import AnimatedCircularProgressBar, { AnimatedCircularProgressBarHandle } from '@/components/ui/AnimatedCircularProgressBar';
import useTrackDuplicates from '@/hooks/useTrackDuplicates';
import { T_DuplicateTrack, T_TrackBase } from '@/lib/types/common.types';

type Props = {
    tracks: T_TrackBase[];
    playlistId: string;
};

const DuplicateTracks = ({ tracks, playlistId }: Props) => {
    const ref = useRef<AnimatedCircularProgressBarHandle>(null);
    const { runDuplicateCheck, isProcessing, duplicates } = useTrackDuplicates({ ref });
    const [foundDuplicates, setFoundDuplicates] = useState<T_DuplicateTrack[]>([]);

    useEffect(() => {
        if (tracks.length > 0) {
            runDuplicateCheck(tracks);
        }
    }, [tracks, runDuplicateCheck]);

    useEffect(() => {
        if (duplicates) {
            setFoundDuplicates(duplicates);
        }
    }, [duplicates]);

    if (isProcessing) {
        return (
            <div className="h-calc-full-height flex items-center justify-center">
                <AnimatedCircularProgressBar ref={ref} />
            </div>
        );
    }

    return (
        <main className="p-6">
            <h1 className="text-highlight font-alegreya mb-6 text-center text-3xl font-bold sm:text-4xl">Duplicate Tracks</h1>
            {foundDuplicates.length === 0 ? (
                <div className="mt-8 text-center text-lg text-gray-500">No duplicate tracks found.</div>
            ) : (
                <DuplicateTrackRemover duplicates={foundDuplicates} source="spotify" playlistId={playlistId} />
            )}
        </main>
    );
};

export default DuplicateTracks;
