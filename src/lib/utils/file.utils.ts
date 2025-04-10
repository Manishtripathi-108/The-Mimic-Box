import path from 'path';

import { FILE_TYPES_MAP } from '@/constants/client.constants';

/**
 * Sanitizes a file name to remove any characters that are not alphanumeric, periods, or hyphens.
 * Also removes any duplicate underscores and converts the file name to lower case.
 * This is useful when generating a file name from user-provided data.
 */
export const sanitizeFileName = (fileName: string): string => {
    const name = path.basename(fileName);
    return name
        .toLowerCase()
        .replace(/[^a-z0-9.-]/g, '_')
        .replace(/_+/g, '_');
};

/**
 * Formats a file size in bytes into a human-readable string.
 * For example, if the input is 123456789, the output will be "123.46 MB".
 */
export const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Returns the file extension of a file name.
 * For example, if the file name is `example.txt`, this function will return `txt`.
 */
export const getFileExtension = (fileName: string): string => {
    return path.extname(fileName).slice(1);
};

/**
 * Detects the general file type based on its extension.
 * Returns categories like 'audio', 'video', 'document', etc.
 */
export const getFileType = (fileName: string) => {
    const extension = getFileExtension(fileName).toLowerCase();
    return FILE_TYPES_MAP[extension] || 'unknown';
};
