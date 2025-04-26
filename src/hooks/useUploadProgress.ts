'use client';

import { useState } from 'react';

import { AxiosProgressEvent } from 'axios';

import { T_UploadState } from '@/lib/types/client.types';
import { formatDurationInReadableFormat } from '@/lib/utils/core.utils';
import { formatFileSize } from '@/lib/utils/file.utils';

// Default upload progress state
const UPLOAD_PROGRESS: T_UploadState = {
    loaded: 0,
    total: 0,
    progress: 0,
    bytes: 0,
    rate: 0,
    upload: undefined,
    estimated: 0,
    lengthComputable: false,
    event: {
        isTrusted: null,
    },

    // customs
    formattedLoaded: '0 B',
    formattedTotal: '0 B',
    formattedProgress: '0.00%',
    formattedRate: 'Calculating...',
    formattedEstimated: 'Calculating...',
};

/**
 * Custom hook to manage file upload progress.
 */
function useUploadProgress() {
    const [uploadState, setUploadState] = useState<T_UploadState>(UPLOAD_PROGRESS);

    const onUploadProgress = (event: AxiosProgressEvent) => {
        if (!event.lengthComputable || !event.total) return;

        const progress = event.progress ?? event.loaded / event.total;
        const rate = event.rate ?? 0;
        const estimated = event.estimated ?? 0;

        setUploadState((prev) => ({
            ...prev,
            ...event,
            progress: progress * 100,
            formattedLoaded: formatFileSize(event.loaded),
            formattedTotal: formatFileSize(event.total!),
            formattedProgress: `${(progress * 100).toFixed(2)}%`,
            formattedRate: rate > 0 ? `${formatFileSize(rate)}/s` : '0 B/s',
            formattedEstimated: estimated > 0 ? formatDurationInReadableFormat(estimated * 1000) : '0s',
        }));
    };

    const resetUploadProgress = () => setUploadState(UPLOAD_PROGRESS);

    return { uploadState, resetUploadProgress, onUploadProgress };
}

export default useUploadProgress;
