import React from 'react';

import FileUploadItem from '@/components/ui/FileUploadItem';
import Icon from '@/components/ui/Icon';
import Waves from '@/components/ui/Waves';
import { useFileUpload } from '@/hooks/useFileUpload';
import cn from '@/lib/utils/cn';

interface FileUploadProps {
    onFilesSelected: (files: File[]) => void;
    accept?: string;
    maxSizeMB?: number;
    maxFiles?: number;
    description?: string;
    className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected, accept = '*', maxSizeMB = 50, maxFiles = 5, description, className = '' }) => {
    const { files, error, dragActive, dropRef, handleDrop, handleDragOver, handleDragLeave, handleFileSelect } = useFileUpload({
        accept,
        maxSizeMB,
        maxFiles,
        onFilesAccepted: onFilesSelected,
    });

    return (
        <>
            <div
                className={cn('from-secondary to-tertiary shadow-floating-sm mt-10 rounded-2xl bg-linear-150 from-15% to-85% p-2 sm:p-6', className)}>
                <div
                    className={cn(
                        'border-highlight flex flex-col items-center space-y-4 rounded-lg border-2 border-dashed p-6',
                        dragActive && 'border-highlight/50 bg-primary'
                    )}
                    ref={dropRef}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    aria-label="File upload area">
                    <Waves className="mx-auto my-20 block">
                        <label className="shadow-raised-sm button button-secondary relative aspect-square w-full cursor-pointer rounded-full p-6">
                            <input id="file-upload" type="file" multiple accept={accept} className="hidden" onChange={handleFileSelect} />
                            <Icon icon="upload" className="text-highlight size-full" />
                        </label>
                    </Waves>
                    <p>Drop files here. {maxSizeMB}MB maximum file size</p>
                    <p className="text-text-secondary text-sm">{description}</p>
                    {error && <p className="text-red-500">{error}</p>}
                </div>
            </div>

            <div>
                {files?.map((file, index) => (
                    <FileUploadItem
                        key={index}
                        file={file}
                        error={error}
                        className="first:mt-4"
                        onRemove={() => {
                            const newFiles = [...files];
                            newFiles.splice(index, 1);
                            onFilesSelected(newFiles);
                        }}
                    />
                ))}
            </div>
        </>
    );
};

export default FileUpload;
