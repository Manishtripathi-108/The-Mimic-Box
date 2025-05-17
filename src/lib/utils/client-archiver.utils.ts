import JSZip from 'jszip';
import { toast } from 'react-hot-toast';

/**
 * Downloads multiple files, zips them, and triggers a download of the ZIP file.
 *
 * This function fetches each file from the provided URLs, adds them to a ZIP archive,
 * and initiates a download of the ZIP file. It displays a loading toast while processing
 * and provides success or error notifications based on the outcome.
 */

export const downloadZip = async (files: { url: string; filename: string }[], zipName = 'downloads.zip') => {
    const toastId = toast.loading('Zipping files...');

    try {
        const zip = new JSZip();

        for (const file of files) {
            const response = await fetch(file.url, { mode: 'cors' });
            if (!response.ok) continue;

            const blob = await response.blob();
            zip.file(file.filename, blob);
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const blobUrl = URL.createObjectURL(zipBlob);

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = zipName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(blobUrl);
        toast.success('ZIP file downloaded!', { id: toastId });
    } catch (err) {
        console.error(err);
        toast.error('ZIP download failed.', { id: toastId });
    }
};
