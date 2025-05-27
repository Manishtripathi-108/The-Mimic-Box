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
            icon: 'loading',
            className: 'text-blue-500',
            label: 'Processing',
        },
        downloading: {
            icon: 'loading',
            className: 'text-green-500',
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
        <div className="from-secondary to-tertiary shadow-floating-xs flex w-full items-center justify-between gap-4 rounded-xl bg-linear-150 p-3">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="text-text-primary truncate text-sm">{file.title}</span>

                {file.status === 'downloading' && (
                    <div className="shadow-pressed-xs relative h-1 w-full rounded-full">
                        <div
                            className="bg-highlight absolute top-0 left-0 h-full rounded-full transition-all duration-300 ease-in-out"
                            style={{ width: `${file.progress || 0}%` }}
                        />
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2">
                <div
                    className={`flex size-5 shrink-0 items-center justify-center ${status.className}`}
                    aria-label={`Status: ${status.label}`}
                    title={status.label}>
                    <Icon icon={status.icon} className="size-full" />
                </div>

                {isCancelable && (
                    <button
                        onClick={() => onCancel()}
                        className="rounded px-1 py-0.5 text-xs text-red-500 transition hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                        aria-label={`Cancel download of ${file.title}`}>
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
};

export default memo(DownloadItem);
