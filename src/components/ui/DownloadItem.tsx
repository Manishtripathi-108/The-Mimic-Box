import { memo } from 'react';

import Icon from '@/components/ui/Icon';
import { T_AudioDownloadFile, T_IconType } from '@/lib/types/client.types';

const DownloadItem = ({ file, onCancel }: { file: T_AudioDownloadFile; onCancel: () => void }) => {
    const statusMap: Record<T_AudioDownloadFile['status'], { icon: T_IconType; className: string; label: string }> = {
        pending: {
            icon: 'pending',
            className: 'text-warning',
            label: 'Pending',
        },
        processing: {
            icon: 'processing',
            className: 'text-highlight',
            label: 'Processing',
        },
        downloading: {
            icon: 'downloading',
            className: 'text-accent',
            label: 'Downloading',
        },
        ready: {
            icon: 'success',
            className: 'text-success',
            label: 'Ready',
        },
        failed: {
            icon: 'error',
            className: 'text-danger',
            label: 'Failed',
        },
        cancelled: {
            icon: 'error',
            className: 'text-danger',
            label: 'Cancelled',
        },
    };

    const status = statusMap[file.status];
    const isCancelable = ['pending', 'processing', 'downloading'].includes(file.status);

    return (
        <div className="shadow-floating-xs bg-gradient-secondary-to-tertiary relative w-full rounded-xl p-3">
            <div className="flex items-center justify-between">
                {/* Title and Progress */}
                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                        <span className="text-text-primary truncate text-sm font-medium">{file.title}</span>

                        <div
                            className={`ml-2 flex size-5 shrink-0 items-center justify-center ${status.className}`}
                            aria-label={`Status: ${status.label}`}
                            title={status.label}>
                            <Icon icon={status.icon} />
                        </div>
                    </div>

                    {/* Progress Bar */}
                    {file.status === 'downloading' && (
                        <div className="shadow-pressed-xs relative mt-2 h-1 w-full overflow-hidden rounded-full">
                            <div
                                className="bg-accent absolute top-0 left-0 h-full rounded-full transition-all duration-300 ease-in-out"
                                style={{ width: `${file.progress || 0}%` }}
                            />
                        </div>
                    )}

                    {/* error msg  */}
                    {file.error && (
                        <div className="text-danger mt-1 text-xs" title={`Error: ${file.error}`}>
                            {file.error}
                        </div>
                    )}
                </div>

                {/* Cancel Button */}
                {isCancelable && (
                    <button
                        type="button"
                        onClick={onCancel}
                        title={`Cancel download of ${file.title}`}
                        className="text-danger ml-2 size-5 shrink-0 cursor-pointer rounded-full hover:text-red-600"
                        aria-label={`Cancel download of ${file.title}`}>
                        <Icon icon="close" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default memo(DownloadItem);
