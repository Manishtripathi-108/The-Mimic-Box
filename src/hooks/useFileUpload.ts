'use client';

import { useCallback, useRef, useState } from 'react';

interface UseFileUploadProps {
    accept?: string;
    maxSizeMB?: number;
    maxFiles?: number;
    onFilesAccepted?: (files: File[]) => void;
}

export const useFileUpload = ({ accept = '*', maxSizeMB = 50, maxFiles = 5, onFilesAccepted }: UseFileUploadProps) => {
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const dropRef = useRef<HTMLDivElement | null>(null);

    const validateFiles = useCallback(
        (newFiles: File[]) => {
            const validFiles: File[] = [];
            const acceptRegex = accept === '*' ? /.*/ : new RegExp(accept.replace(/\*/g, '.*'));
            setError(null);

            for (const file of newFiles) {
                if (file.size > maxSizeMB * 1024 * 1024) {
                    setError(`File ${file.name} exceeds ${maxSizeMB}MB.`);
                    continue;
                }
                if (!acceptRegex.test(file.type)) {
                    setError(`File ${file.name} is not a valid type.`);
                    continue;
                }
                if (!files.some((f) => f.name === file.name && f.size === file.size)) {
                    validFiles.push(file);
                }
            }

            const allFiles = [...files, ...validFiles].slice(0, maxFiles);
            setFiles(allFiles);
            onFilesAccepted?.(allFiles);
        },
        [accept, files, maxFiles, maxSizeMB, onFilesAccepted]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setDragActive(false);
            if (!e.dataTransfer?.files.length) return;
            validateFiles(Array.from(e.dataTransfer.files));
        },
        [validateFiles]
    );

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setDragActive(false);
    }, []);

    const handleFileSelect = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!e.target.files?.length) return;
            validateFiles(Array.from(e.target.files));
        },
        [validateFiles]
    );

    return {
        files,
        error,
        dragActive,
        dropRef,
        handleDrop,
        handleDragOver,
        handleDragLeave,
        handleFileSelect,
    };
};
