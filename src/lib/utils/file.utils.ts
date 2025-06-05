import { v4 as uuidV4 } from 'uuid';

import { FILE_TYPES_MAP } from '@/constants/client.constants';

/**
 * Formats a file size in bytes into a human-readable string.
 */
export const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

/**
 * Returns the file extension of a file name.
 */
export const getFileExtension = (fileName: string): string => {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
};

/**
 * Detects the general file type based on its extension.
 */
export const getFileType = (fileName: string) => {
    const extension = getFileExtension(fileName);
    return FILE_TYPES_MAP[extension] || 'unknown';
};

/**
 * Sanitizes a filename by removing invalid characters and optionally adding a UUID.
 * If the filename exceeds 100 characters, it truncates it to 100 characters.
 *
 * @example
 * sanitizeFilename('example file name.txt'); // 'example file name.txt'
 * sanitizeFilename('example file name.txt', true); // '123e4567-e89b-12d3-a456-426614174000-example file name.txt'
 */
export const sanitizeFilename = (fileName: string, addUuid = false): string => {
    const normalized = fileName.normalize('NFC');
    const sanitized = normalized
        .replace(/[/\\?%*:|"<>]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    if (addUuid) return `${uuidV4()}-${sanitized}`;
    else return sanitized.length > 100 ? sanitized.slice(0, 100) : sanitized;
};

/**
 * Downloads a file from a URL or Blob with a custom filename.
 * If a URL is passed, it fetches the file and forces a download using a Blob.
 */
export const downloadFile = async (file: Blob | string, filename: string): Promise<void> => {
    try {
        let blob: Blob;

        if (typeof file === 'string') {
            const response = await fetch(file, { mode: 'cors' });

            if (!response.ok) {
                throw new Error(`Failed to fetch file: ${response.statusText}`);
            }

            blob = await response.blob();
        } else {
            blob = file;
        }

        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        a.style.display = 'none';

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error('Download failed:', error);
    }
};
