'use client';

import { useCallback, useEffect, useState } from 'react';

import { useWorker } from 'react-hooks-worker';

import { AnimatedCircularProgressBarHandle } from '@/components/ui/AnimatedCircularProgressBar';
import { T_DuplicateTrack, T_TrackBase } from '@/lib/types/common.types';
import { isBrowser } from '@/lib/utils/core.utils';

const createWorker = () => {
    if (!isBrowser) {
        throw new Error('Web Workers are only supported in the browser.');
    }
    return new Worker(new URL('@/workers/trackDuplicates.worker.ts', import.meta.url), { type: 'module' });
};

type WorkerResult = {
    progress: number;
    duplicateCount: number;
    duplicates: T_DuplicateTrack[] | null;
};

type UseTrackDuplicatesProps = {
    ref?: React.Ref<AnimatedCircularProgressBarHandle>;
};

export function useTrackDuplicates({ ref }: UseTrackDuplicatesProps) {
    const [input, setInput] = useState<T_TrackBase[] | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const { result, error } = useWorker<T_TrackBase[] | null, WorkerResult>(createWorker, input);

    // update progress bar via ref
    useEffect(() => {
        if (result?.progress !== undefined && ref && 'current' in ref && ref.current) {
            ref.current.value(result.progress);
        }
    }, [result?.progress, ref]);

    // track processing state safely
    useEffect(() => {
        if (!result) return;
        if (result.progress === 100 || result.duplicates) {
            setIsProcessing(false);
        }
    }, [result]);

    // trigger worker
    const runDuplicateCheck = useCallback((tracks: T_TrackBase[]) => {
        setIsProcessing(true);
        setInput(tracks);
    }, []);

    return {
        isProcessing,
        progressPercent: result?.progress ?? 0,
        duplicateCount: result?.duplicateCount ?? 0,
        duplicates: result?.duplicates ?? null,
        error,
        runDuplicateCheck,
    };
}

export default useTrackDuplicates;
