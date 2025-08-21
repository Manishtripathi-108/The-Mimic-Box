'use client';

import ErrorMessage from '@/components/ui/ErrorMessage';
import FileUploadItem from '@/components/ui/FileUploadItem';
import Icon from '@/components/ui/Icon';
import Waves from '@/components/ui/Waves';
import { useFileUpload } from '@/hooks/useFileUpload';
import cn from '@/lib/utils/cn';

interface FileUploadProps {
    id?: string;
    onFilesSelected: (files: File[]) => void;
    accept?: string;
    showList?: boolean;
    maxSizeMB?: number;
    maxFiles?: number;
    description?: string;
    className?: string;
    errorMessage?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
    id = 'file-upload',
    onFilesSelected,
    accept = '*',
    showList = false,
    maxSizeMB = 50,
    maxFiles = 5,
    description,
    errorMessage,
    className,
}) => {
    const { files, error, dragActive, dropRef, handleDrop, handleDragOver, handleDragLeave, handleFileSelect } = useFileUpload({
        accept,
        maxSizeMB,
        maxFiles,
        onFilesAccepted: onFilesSelected,
    });

    return (
        <>
            <div className={cn('bg-gradient-secondary-to-tertiary shadow-floating-sm mt-10 rounded-2xl p-2 sm:p-6', className)}>
                <div
                    className={cn(
                        'border-highlight flex cursor-pointer flex-col items-center space-y-4 rounded-lg border-2 border-dashed p-6',
                        dragActive && 'border-highlight/50 bg-primary'
                    )}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            document.getElementById(id)?.click();
                        }
                    }}
                    ref={dropRef}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    aria-label="File upload area">
                    <Waves className="mx-auto my-20 block">
                        <label
                            htmlFor={id}
                            className="shadow-raised-sm relative flex aspect-square w-full cursor-pointer items-center justify-center rounded-full p-6">
                            <input id={id} type="file" name={id} multiple accept={accept} className="hidden" onChange={handleFileSelect} />
                            <Icon icon="upload" className="text-highlight size-full" />
                        </label>
                    </Waves>
                    <p>
                        Drop file{maxFiles > 1 ? 's' : ''} here. {maxSizeMB}MB maximum file size
                    </p>
                    <p className="text-text-secondary text-sm">{description}</p>
                    <ErrorMessage message={error || errorMessage} />
                </div>
            </div>

            {showList && (
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
            )}
        </>
    );
};

export default FileUpload;
