'use client';

import { useState } from 'react';

import FileUpload from '@/components/ui/FileUpload';
import FileUploadItem from '@/components/ui/FileUploadItem';

export default function FileConverter() {
    const [files, setFiles] = useState<File[] | null>(null);

    return (
        <div className="min-h-calc-full-height text-text-secondary p-2 sm:p-6">
            <div className="mx-auto max-w-4xl text-center">
                <h1 className="font-alegreya text-text-primary text-4xl tracking-wide">File Converter</h1>
                <p className="text-highlight mt-2 mb-10 text-lg">Convert your audio files to any format</p>

                {(files ?? []).length === 0 && <FileUpload onFilesSelected={setFiles} maxFiles={10} accept="audio/*" />}

                {files?.map((file, index) => (
                    <FileUploadItem key={index} file={file} onRemove={() => setFiles((prev) => (prev ? prev.filter((f) => f !== file) : null))} />
                ))}
            </div>
        </div>
    );
}
