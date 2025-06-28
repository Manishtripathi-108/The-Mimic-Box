'use client';

import { createContext, useContext, useRef, useState } from 'react';

import axios from 'axios';
import JSZip from 'jszip';
import toast from 'react-hot-toast';

import { useFFmpeg } from '@/hooks/useFFmpeg.hook';
import { T_AudioFile, T_AudioPlayerTrack, T_DownloadFile } from '@/lib/types/client.types';
import { sleep } from '@/lib/utils/core.utils';
import { downloadFile, sanitizeFilename } from '@/lib/utils/file.utils';
import { buildAudioFileFromTrack, getLyrics, searchMetadata } from '@/lib/utils/music.utils';

type DownloadContextType = {
    downloads: T_DownloadFile[];
    total: number;
    completed: number;
    addDownload: (file: Omit<T_DownloadFile, 'status'> | Omit<T_DownloadFile, 'status'>[]) => void;
    updateDownload: (id: string, updates: Partial<T_DownloadFile>) => void;
    cancelDownload: (id: string) => void;
    cancelAllDownloads: () => void;
    downloadTracks: (tracks: T_AudioPlayerTrack[], quality: string, zipName?: string) => Promise<void>;
    clearDownloads: () => void;
};

const DownloadContext = createContext<DownloadContextType | null>(null);
export const useAudioDownload = () => {
    const context = useContext(DownloadContext);
    if (!context) throw new Error('useAudioDownload must be used within an AudioDownloadProvider');
    return context;
};

const BATCH_SIZE = 30;

export const AudioDownloadProvider = ({ children }: { children: React.ReactNode }) => {
    const [downloads, setDownloads] = useState<T_DownloadFile[]>([]);
    const [completed, setCompleted] = useState(0);

    const abortControllers = useRef<Record<string, AbortController>>({});
    const zipUrlsRef = useRef<string[]>([]);
    const isCancelledAllRef = useRef(false);
    const cancelledTracksRef = useRef<Record<string, boolean>>({});

    const { isLoaded, load, writeFile, exec, readFile, deleteFile, cleanup } = useFFmpeg();

    const addDownload: DownloadContextType['addDownload'] = (file) => {
        const entries = Array.isArray(file) ? file : [file];
        const newFiles: T_DownloadFile[] = entries.filter((f) => !downloads.some((d) => d.id === f.id)).map((f) => ({ ...f, status: 'pending' }));
        if (newFiles.length) setDownloads((prev) => [...prev, ...newFiles]);
    };

    const updateDownload: DownloadContextType['updateDownload'] = (id, updates) => {
        setDownloads((prev) => {
            const alreadyCompleted = prev.find((d) => d.id === id && d.status === 'ready');
            if (updates.status === 'ready' && !alreadyCompleted) {
                setCompleted((prevCompleted) => prevCompleted + 1);
                updates.progress = 100;
            }
            return prev.map((d) => (d.id === id ? { ...d, ...updates } : d));
        });
    };

    const cancelDownload = (id: string) => {
        abortControllers.current[id]?.abort();
        delete abortControllers.current[id];
        updateDownload(id, { status: 'cancelled', error: 'cancelled' });
        cancelledTracksRef.current[id] = true;
    };

    const cancelAllDownloads = () => {
        isCancelledAllRef.current = true;
        Object.values(abortControllers.current).forEach((controller) => controller.abort());
        abortControllers.current = {};

        cleanup();

        downloads.forEach((d, i) => {
            const base = sanitizeFilename(d.title || `track_${i}`);
            deleteFile(`input_${i}.mp4`);
            deleteFile(`${base}.m4a`);
        });

        zipUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
        zipUrlsRef.current = [];

        setDownloads([]);
        setCompleted(0);

        toast.success('All downloads cancelled.');
    };

    const clearDownloads = () => {
        setDownloads((prev) => prev.filter((d) => !['ready', 'failed', 'cancelled'].includes(d.status)));
        setCompleted(0);
    };

    const processTrack = async (index: number, file: T_AudioFile, zip: JSZip) => {
        const inputFile = `input_${index}.mp4`;
        const outputFile = `${sanitizeFilename(file.filename || `track_${index}`)}.m4a`;
        const coverFile = file.cover ? `cover_${index}.jpg` : null;

        const abortController = new AbortController();
        abortControllers.current[file.src] = abortController;

        try {
            if (isCancelledAllRef.current || cancelledTracksRef.current[file.src]) return;

            const response = await axios.get(file.src, {
                responseType: 'blob',
                signal: abortController.signal,
                onDownloadProgress: ({ progress }) => {
                    updateDownload(file.src, {
                        status: 'downloading',
                        progress: Math.floor((progress || 0) * 100),
                    });
                },
            });

            if (isCancelledAllRef.current) throw new Error('Cancelled');

            updateDownload(file.src, { status: 'processing', progress: 0 });

            const [lyrics, metadata] = await Promise.all([getLyrics(file), searchMetadata(file)]);

            await writeFile(inputFile, response.data);
            if (coverFile) await writeFile(coverFile, file.cover!);

            const ffmpegArgs = ['-i', inputFile];
            if (coverFile) {
                ffmpegArgs.push(
                    '-i',
                    coverFile,
                    '-map',
                    '0:a',
                    '-map',
                    '1',
                    '-disposition:v',
                    'attached_pic',
                    '-metadata:s:v',
                    'comment=Cover (front)'
                );
            }
            if (lyrics) ffmpegArgs.push('-metadata', `lyrics=${lyrics}`);
            ffmpegArgs.push(...Object.entries(metadata.metadata).flatMap(([k, v]) => ['-metadata', `${k}=${v}`]), '-codec', 'copy', outputFile);

            await exec(ffmpegArgs);

            if (isCancelledAllRef.current) throw new Error('Cancelled');

            const result = await readFile(outputFile);
            zip.file(outputFile, result);

            updateDownload(file.src, { status: 'ready', progress: 100 });
        } catch (error) {
            const isCancelled = axios.isCancel(error) || (error instanceof Error && error.message === 'Cancelled');
            const errorMessage = axios.isAxiosError(error) ? error.message : error instanceof Error ? error.message : 'Unknown error';

            setTimeout(() => {
                updateDownload(file.src, {
                    status: isCancelled ? 'cancelled' : 'failed',
                    error: errorMessage,
                });
            }, 100);

            console.error(`Error processing ${file.src}:`, errorMessage, error);
        } finally {
            try {
                await deleteFile(inputFile);
                if (coverFile) await deleteFile(coverFile);
                await deleteFile(outputFile);
            } catch (e) {
                console.warn('FFmpeg file cleanup failed:', e);
            }
            delete abortControllers.current[file.src];
            delete cancelledTracksRef.current[file.src];
        }
    };

    const downloadTracks: DownloadContextType['downloadTracks'] = async (tracks, quality, zipName = 'Tracks') => {
        isCancelledAllRef.current = false;

        const files = tracks.map((t) => buildAudioFileFromTrack(t, quality)).filter(Boolean) as T_AudioFile[];
        const freshFiles = files.filter((f) => !downloads.some((d) => d.id === f.src));
        if (!freshFiles.length) {
            toast.error('No valid tracks found.');
            return;
        }

        const pending = freshFiles.map((f) => ({ id: f.src, title: f.filename || 'Unknown Track', url: '' }));
        addDownload(pending);
        setCompleted(0);

        if (!isLoaded) await load();

        let batchIndex = 1;

        for (let i = 0; i < freshFiles.length; i += BATCH_SIZE) {
            if (isCancelledAllRef.current) break;

            const batch = freshFiles.slice(i, i + BATCH_SIZE);
            const zip = new JSZip();

            await Promise.allSettled(batch.map((file, i) => processTrack(i, file, zip)));
            if (isCancelledAllRef.current) break;
            await cleanup();
            const zipFilesLength = Object.keys(zip.files).length;

            if (zipFilesLength === 0) continue;

            if (zipFilesLength === 1) {
                const file = zip.files[Object.keys(zip.files)[0]];
                const blob = await file.async('blob');
                downloadFile(blob, file.name);
                continue;
            }

            const zipId = `zip_${Date.now()}_${batchIndex}`;
            const zipFilename = `${zipName}_Part_${batchIndex}.zip`;

            addDownload({ id: zipId, title: zipFilename, url: '' });
            updateDownload(zipId, { status: 'processing' });

            try {
                const blob = await zip.generateAsync({
                    type: 'blob',
                    compression: 'STORE',
                    // streamFiles: true,
                    encodeFileName: sanitizeFilename,
                });

                const zipUrl = URL.createObjectURL(blob);
                zipUrlsRef.current.push(zipUrl);
                updateDownload(zipId, { url: zipUrl, status: 'ready', progress: 100 });
                downloadFile(blob, zipFilename);
            } catch (err) {
                console.error('Zip error:', err);
                updateDownload(zipId, { status: 'failed', error: 'Failed to generate zip file' });
                toast.error(`Failed to generate ${zipFilename}`);
            }

            batchIndex++;
            await cleanup();
            await sleep(100);
        }
    };

    return (
        <DownloadContext.Provider
            value={{
                downloads,
                total: downloads.length,
                completed,
                addDownload,
                updateDownload,
                cancelDownload,
                cancelAllDownloads,
                downloadTracks,
                clearDownloads,
            }}>
            {children}
        </DownloadContext.Provider>
    );
};
