'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

import axios from 'axios';
import JSZip from 'jszip';
import toast from 'react-hot-toast';

import { useFFmpeg } from '@/hooks/useFFmpeg.hook';
import { T_AudioDownloadFile, T_AudioFile, T_AudioPlayerTrack } from '@/lib/types/client.types';
import { buildAudioFileFromTrack, getLyrics, searchMetadata } from '@/lib/utils/audio.cleint.utils';
import { sleep } from '@/lib/utils/core.utils';
import { downloadFile, sanitizeFilename } from '@/lib/utils/file.utils';

type DownloadContextType = {
    downloads: T_AudioDownloadFile[];
    total: number;
    completed: number;
    updateDownload: (id: string, updates: Partial<T_AudioDownloadFile>) => void;
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
    const [downloads, setDownloads] = useState<T_AudioDownloadFile[]>([]);
    const [completed, setCompleted] = useState(0);

    const abortControllers = useRef<Record<string, AbortController>>({});
    const zipUrlsRef = useRef<string[]>([]);
    const isCancelledAllRef = useRef(false);
    const cancelledTracksRef = useRef<Record<string, boolean>>({});

    const downloadQueue = useRef<T_AudioDownloadFile[]>([]);
    const isProcessingRef = useRef(false);

    const { isLoaded, load, writeFile, exec, readFile, deleteFile, cleanup } = useFFmpeg();

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

    const cancelDownload = useCallback((id: string) => {
        abortControllers.current[id]?.abort();
        delete abortControllers.current[id];
        updateDownload(id, { status: 'cancelled', error: 'cancelled' });
        cancelledTracksRef.current[id] = true;
    }, []);

    const cancelAllDownloads = useCallback(() => {
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

        cancelledTracksRef.current = {};
        isProcessingRef.current = false;
        downloadQueue.current = [];
        setDownloads([]);
        setCompleted(0);

        toast.success('All downloads cancelled.');
    }, [cleanup, deleteFile, downloads]);

    const clearDownloads = useCallback(() => {
        setDownloads((prev) => prev.filter((d) => !['ready', 'failed', 'cancelled'].includes(d.status)));
        setCompleted(0);
    }, []);

    const processTrack = async (index: number, file: T_AudioDownloadFile, zip: JSZip) => {
        const inputFile = `input_${index}.mp4`;
        const outputFile = `${sanitizeFilename(file.title || `track_${index}`)}.m4a`;
        const coverFile = file.cover ? `cover_${index}.jpg` : null;

        const abortController = new AbortController();
        abortControllers.current[file.id] = abortController;

        try {
            if (isCancelledAllRef.current || cancelledTracksRef.current[file.id]) return;

            const response = await axios.get(file.id, {
                responseType: 'blob',
                signal: abortController.signal,
                onDownloadProgress: ({ progress }) => {
                    updateDownload(file.id, {
                        status: 'downloading',
                        progress: Math.floor((progress || 0) * 100),
                    });
                },
            });

            if (isCancelledAllRef.current) throw new Error('Cancelled');

            updateDownload(file.id, { status: 'processing', progress: 0 });

            const [lyrics, metadata] = await Promise.all([
                getLyrics({
                    title: file.metadata.title as string,
                    artist: file.metadata.artist as string,
                    album: file.metadata.album as string,
                    duration: file.metadata.duration,
                }),
                searchMetadata(file.metadata),
            ]);

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
            ffmpegArgs.push(...Object.entries(metadata).flatMap(([k, v]) => ['-metadata', `${k}=${v}`]), '-codec', 'copy', outputFile);

            await exec(ffmpegArgs);

            if (isCancelledAllRef.current) throw new Error('Cancelled');

            const result = await readFile(outputFile);
            zip.file(outputFile, result);

            updateDownload(file.id, { status: 'ready' });
        } catch (error) {
            const isCancelled = axios.isCancel(error) || (error instanceof Error && error.message === 'Cancelled');
            const message = axios.isAxiosError(error) ? error.message : error instanceof Error ? error.message : 'Unknown error';
            setTimeout(() => {
                updateDownload(file.id, {
                    status: isCancelled ? 'cancelled' : 'failed',
                    error: message,
                });
            }, 100);

            console.error(`Error processing ${file.id}:`, message, error);
        } finally {
            try {
                await deleteFile(inputFile);
                if (coverFile) await deleteFile(coverFile);
                await deleteFile(outputFile);
            } catch (e) {
                console.warn('Cleanup failed:', e);
            }
            delete abortControllers.current[file.id];
            delete cancelledTracksRef.current[file.id];
        }
    };

    const startQueueProcessor = async () => {
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;

        if (!isLoaded) await load();

        let batchIndex = 1;
        try {
            while (downloadQueue.current.length && !isCancelledAllRef.current) {
                const batch = downloadQueue.current.splice(0, BATCH_SIZE);
                const zip = new JSZip();

                await Promise.allSettled(batch.map((file, i) => processTrack(i, file, zip)));
                await cleanup();

                if (isCancelledAllRef.current) break;

                const files = Object.keys(zip.files);
                if (!files.length) continue;

                if (files.length === 1) {
                    const file = zip.files[Object.keys(zip.files)[0]];
                    const blob = await file.async('blob');
                    downloadFile(blob, file.name);
                    continue;
                }

                const zipId = `zip_${Date.now()}_${batchIndex}`;
                const zipFilename = `Batch_${batchIndex}.zip`;

                setDownloads((prev) => [...prev, { id: zipId, title: zipFilename, url: '', status: 'pending', metadata: {} }]);
                updateDownload(zipId, { status: 'processing' });

                try {
                    const blob = await zip.generateAsync({
                        type: 'blob',
                        compression: 'STORE',
                        encodeFileName: sanitizeFilename,
                    });

                    const zipUrl = URL.createObjectURL(blob);
                    zipUrlsRef.current.push(zipUrl);
                    updateDownload(zipId, { url: zipUrl, status: 'ready' });
                    downloadFile(blob, zipFilename);
                } catch (err) {
                    console.error('Zip error:', err);
                    updateDownload(zipId, { status: 'failed', error: 'Zip generation failed' });
                }

                batchIndex++;
                await sleep(100);
            }
        } finally {
            isProcessingRef.current = false;
        }
    };

    const downloadTracks: DownloadContextType['downloadTracks'] = async (tracks, quality) => {
        const files = tracks.map((t) => buildAudioFileFromTrack(t, quality)).filter(Boolean) as T_AudioFile[];
        const pending: T_AudioDownloadFile[] = files.map((f) => ({
            id: f.src,
            url: '',
            title: f.filename || 'Unknown Track',
            cover: f.cover,
            metadata: f.metadata,
            status: 'pending',
        }));
        const newFiles = pending.filter((f) => !downloads.some((d) => d.id === f.id));

        if (newFiles.length) {
            setDownloads((prev) => [...prev, ...newFiles]);
            downloadQueue.current.push(...newFiles);
            startQueueProcessor();
        } else {
            toast.error('No valid audio files found for download.');
        }
    };

    return (
        <DownloadContext.Provider
            value={{
                downloads,
                total: useMemo(() => downloads.length, [downloads.length]),
                completed,
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
