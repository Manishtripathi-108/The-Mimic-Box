'use client';

import { memo } from 'react';

import Icon from '@/components/ui/Icon';
import cn from '@/lib/utils/cn';
import { formatFileSize, getFileExtension, getFileType } from '@/lib/utils/file.utils';

type FileUploadItemProps = {
    file: File;
    error?: string | null;
    onRemove: () => void;
    children?: React.ReactNode;
    className?: string;
};

const FileUploadItem = ({ file, error, onRemove, children, className }: FileUploadItemProps) => {
    const fileName = file.name;
    const fileExt = getFileExtension(fileName).toUpperCase();
    const fileType = getFileType(fileName);

    return (
        <section
            className={cn(
                'shadow-floating-xs relative flex w-full flex-col items-center justify-between gap-4 rounded-xl p-4 sm:flex-row',
                className
            )}
            role="listitem"
            aria-label={`Uploaded file: ${fileName}`}>
            {/* File Info */}
            <div className="flex w-full min-w-0 shrink items-center gap-4">
                <div className="shadow-raised-xs block size-9 shrink-0 rounded-lg border p-1.5" aria-hidden="true">
                    <Icon icon={fileType} className="size-full" />
                </div>

                <div className="overflow-hidden">
                    <p className="text-text-primary mr-10 line-clamp-1 text-start text-sm font-medium" title={fileName}>
                        {fileName}
                    </p>
                    <p className="text-text-secondary mt-0.5 text-start text-xs">{`${fileExt} — ${formatFileSize(file.size)}`}</p>

                    {error && (
                        <p className="mt-0.5 text-xs text-red-500" role="alert">
                            {error}
                        </p>
                    )}
                </div>
            </div>

            {children}

            {/* Remove Button */}
            <button
                type="button"
                title="Remove file"
                aria-label="Remove uploaded file"
                onClick={onRemove}
                className="sm:button absolute top-4 right-3 size-5 shrink-0 cursor-pointer text-red-500 sm:relative sm:top-0 sm:right-0 sm:size-9 sm:rounded-xl sm:p-1 dark:text-red-500">
                <Icon icon="closeAnimated" className="size-full" />
            </button>
        </section>
    );
};

export default memo(FileUploadItem);
