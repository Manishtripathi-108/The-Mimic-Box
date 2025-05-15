import toast from 'react-hot-toast';

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
 * If a URL is passed, it fetches the file and forces a download using a Blob.
 */
export const downloadFile = async (file: Blob | string, filename: string): Promise<void> => {
    const toastId = toast.loading('Downloading file...');
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
        toast.success('File downloaded successfully!', { id: toastId });

        URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error('Download failed:', error);
        toast.error('Failed to download file.', { id: toastId });
    }
};
