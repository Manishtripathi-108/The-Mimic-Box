import { memo } from 'react';

import Icon from '@/components/ui/Icon';
import IconSet from '@/constants/icons.constants';
import { T_DownloadFile } from '@/lib/types/client.types';

const DownloadItem = ({ file, onCancel }: { file: T_DownloadFile; onCancel: () => void }) => {
    const statusMap: Record<T_DownloadFile['status'], { icon: keyof typeof IconSet; className: string; label: string }> = {
        pending: {
            icon: 'pending',
            className: 'text-yellow-500',
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
            className: 'text-green-600',
            label: 'Ready',
        },
        failed: {
            icon: 'error',
            className: 'text-red-500',
            label: 'Failed',
        },
        cancelled: {
            icon: 'error',
            className: 'text-red-500',
            label: 'Cancelled',
        },
    };

    const status = statusMap[file.status];
    const isCancelable = ['pending', 'processing', 'downloading'].includes(file.status);

    return (
        <div className="from-secondary to-tertiary shadow-floating-xs relative w-full rounded-xl bg-linear-150 p-3">
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
                        <div className="mt-1 text-xs text-red-500" title={`Error: ${file.error}`}>
                            {file.error}
                        </div>
                    )}
                </div>

                {/* Cancel Button */}
                {isCancelable && (
                    <button
                        onClick={onCancel}
                        title={`Cancel download of ${file.title}`}
                        className="ml-2 size-5 shrink-0 cursor-pointer rounded-full text-red-500 hover:text-red-600"
                        aria-label={`Cancel download of ${file.title}`}>
                        <Icon icon="close" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default memo(DownloadItem);
