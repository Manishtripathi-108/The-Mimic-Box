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

/**
 * Converts seconds into a human-readable duration.
 *
 * @param seconds - The number of seconds.
 * @returns A formatted duration string (e.g., "1d 2h 30min 5s").
 */
export const formatDuration = (seconds: number): string => {
    if (seconds < 1) return 'Less than 1s';

    const days = Math.floor(seconds / 86400);
    seconds -= days * 86400;

    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;

    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    const parts: string[] = [];
    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}min`);
    if (seconds) parts.push(`${Math.floor(seconds)}s`);

    return parts.join(' ') || '0s';
};

/**
 * Downloads a file from a URL or a Blob object.
 * @param file - The file to download, either as a URL string or a Blob object.
 * @param filename - The desired filename for the downloaded file.
 */
export const downloadFile = (file: Blob | string, filename: string): void => {
    const url = typeof file === 'string' ? file : URL.createObjectURL(file);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    if (typeof file !== 'string') {
        URL.revokeObjectURL(url);
    }
};
