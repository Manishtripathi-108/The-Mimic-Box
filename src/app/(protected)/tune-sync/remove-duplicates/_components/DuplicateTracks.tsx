'use client';

import { useEffect, useRef } from 'react';

import { useRouter } from 'next/navigation';

import DuplicateTrackRemover from '@/app/(protected)/tune-sync/remove-duplicates/_components/DuplicateTrackRemover';
import ErrorCard from '@/components/layout/ErrorCard';
import { NoDataCard } from '@/components/layout/NoDataCard';
import AnimatedCircularProgressBar, { AnimatedCircularProgressBarHandle } from '@/components/ui/AnimatedCircularProgressBar';
import { Button } from '@/components/ui/Button';
import useTrackDuplicates from '@/hooks/useTrackDuplicates';
import { T_TrackBase } from '@/lib/types/common.types';

type Props = {
    tracks: T_TrackBase[];
    playlistId: string;
};

const DuplicateTracks = ({ tracks, playlistId }: Props) => {
    const ref = useRef<AnimatedCircularProgressBarHandle>(null);
    const { runDuplicateCheck, isProcessing, duplicates, duplicateCount, error } = useTrackDuplicates({ ref });
    const router = useRouter();

    useEffect(() => {
        if (tracks.length > 0) runDuplicateCheck(tracks);
    }, [tracks, runDuplicateCheck]);

    if (error) {
        <ErrorCard message={error} />;
    }

    return (
        <main className="min-h-calc-full-height p-6">
            <h1 className="text-highlight font-alegreya mb-6 text-center text-3xl font-bold sm:text-4xl">Duplicate Tracks</h1>

            {isProcessing ? (
                <div className="flex flex-col items-center justify-center">
                    <AnimatedCircularProgressBar ref={ref} />
                    <p className="text-text-secondary mt-4 text-lg">Finding duplicates...</p>
                    <p className="text-text-secondary mt-2 text-sm">{duplicateCount} duplicates found.</p>
                </div>
            ) : !duplicates || duplicates.length === 0 ? (
                <NoDataCard message="No duplicate tracks found." className="mx-auto w-full max-w-md">
                    <Button onClick={() => router.back()}>Go Back</Button>
                </NoDataCard>
            ) : (
                <DuplicateTrackRemover duplicates={duplicates} source="spotify" playlistId={playlistId} />
            )}
        </main>
    );
};

export default DuplicateTracks;
