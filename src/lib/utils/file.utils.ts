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
 * Downloads a file from a URL or Blob with a custom filename.
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
