'use client';

import { createContext, useContext, useRef, useState } from 'react';

import axios from 'axios';
import JSZip from 'jszip';
import toast from 'react-hot-toast';

import { useFFmpeg } from '@/hooks/useFFmpeg.hook';
import { T_AudioFile, T_AudioPlayerTrack, T_DownloadFile } from '@/lib/types/client.types';
import { downloadFile } from '@/lib/utils/file.utils';

type DownloadContextType = {
    downloads: T_DownloadFile[];
    total: number;
    completed: number;
    addDownload: (file: Omit<T_DownloadFile, 'status'>) => void;
    updateDownload: (id: string, updates: Partial<T_DownloadFile>) => void;
    cancelDownload: (id: string) => void;
    downloadTracks: (tracks: T_AudioPlayerTrack[], quality: string) => Promise<void>;
};

const DownloadContext = createContext<DownloadContextType | null>(null);

export const useAudioDownload = () => {
    const context = useContext(DownloadContext);
    if (!context) throw new Error('useAudioDownload must be used within a AudioDownloadProvider');
    return context;
};

const buildAudioFileFromTrack = (track: T_AudioPlayerTrack, quality: string): T_AudioFile | null => {
    const url = track.urls.find((u) => u.quality === quality);
    if (!url) return null;

    return {
        src: url.url,
        filename: track.title,
        cover: track.covers?.find((c) => c.quality === '500x500')?.url,
        metadata: {
            title: track.title,
            artist: track.artists || 'Unknown Artist',
            album: track.album || 'Unknown Album',
            year: track.year || 'Unknown Year',
            language: track.language || 'Unknown Language',
        },
    };
};

export const AudioDownloadProvider = ({ children }: { children: React.ReactNode }) => {
    const [downloads, setDownloads] = useState<T_DownloadFile[]>([]);
    const [total, setTotal] = useState(0);
    const [completed, setCompleted] = useState(0);

    const abortControllers = useRef<Record<string, AbortController>>({});

    const { isLoaded, load, writeFile, exec, readFile, deleteFile } = useFFmpeg();

    const addDownload = (file: Omit<T_DownloadFile, 'status'>) => {
        setDownloads((prev) => [...prev, { ...file, status: 'pending' }]);
    };

    const updateDownload = (id: string, updates: Partial<T_DownloadFile>) => {
        setDownloads((prev) => prev.map((file) => (file.id === id ? { ...file, ...updates } : file)));
    };

    const cancelDownload = (id: string) => {
        abortControllers.current[id]?.abort();
        setTimeout(() => {
            updateDownload(id, { status: 'cancelled' });
        }, 100);
    };

    const processTrack = async (file: T_AudioFile, index: number, zip: JSZip) => {
        const inputName = `input_${index}.mp4`;
        const outputName = `${file.filename || `track_${index}`}.m4a`;
        const coverName = file.cover ? `cover_${index}.jpg` : null;

        const controller = new AbortController();
        abortControllers.current[file.src] = controller;

        try {
            const response = await axios.get(file.src, {
                responseType: 'blob',
                signal: controller.signal,
                onDownloadProgress: ({ progress }) => {
                    updateDownload(file.src, { status: 'downloading', progress: (progress || 0) * 100 });
                },
            });

            await writeFile(inputName, response.data);
            if (coverName && file.cover) await writeFile(coverName, file.cover);

            updateDownload(file.src, { status: 'processing', progress: 0 });

            const args = ['-i', inputName];

            if (coverName) {
                args.push('-i', coverName, '-map', '0:a', '-map', '1', '-disposition:v', 'attached_pic', '-metadata:s:v', 'comment=Cover (front)');
            }

            args.push(...Object.entries(file.metadata).flatMap(([k, v]) => ['-metadata', `${k}=${v}`]), '-codec', 'copy', outputName);

            await exec(args);
            const output = await readFile(outputName);

            zip.file(outputName, output);
            updateDownload(file.src, { status: 'ready', progress: 100 });
            setCompleted((prev) => prev + 1);

            // Cleanup
            await deleteFile(inputName);
            if (coverName) await deleteFile(coverName);
            await deleteFile(outputName);
        } catch (err: unknown) {
            if (axios.isCancel(err)) {
                updateDownload(file.src, { status: 'cancelled' });
            } else {
                updateDownload(file.src, { status: 'failed' });
                console.error(`Error processing ${file.src}`, err);
            }
        } finally {
            delete abortControllers.current[file.src];
        }
    };

    const downloadTracks = async (tracks: T_AudioPlayerTrack[], quality: string) => {
        const audioFiles = tracks.map((t) => buildAudioFileFromTrack(t, quality)).filter(Boolean) as T_AudioFile[];
        if (!audioFiles.length) {
            toast.error('No valid tracks found for selected quality.');
            return;
        }

        const files: T_DownloadFile[] = audioFiles.map((f) => ({
            id: f.src,
            title: f.filename || 'Unknown Track',
            url: f.src,
            status: 'pending',
        }));

        setDownloads((prev) => [...prev, ...files]);
        setTotal(audioFiles.length);
        setCompleted(0);

        if (!isLoaded) await load();

        const zip = new JSZip();

        await Promise.allSettled(audioFiles.map((file, i) => processTrack(file, i, zip)));

        const zipId = Date.now().toString();
        const zipFilename = `Tracks - ${zipId}.zip`;

        setDownloads((prev) => [...prev, { id: zipId, title: zipFilename, url: '', status: 'processing' }]);

        try {
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const zipUrl = URL.createObjectURL(zipBlob);
            updateDownload(zipId, { url: zipUrl, status: 'ready', progress: 100 });
            downloadFile(zipBlob, zipFilename);
        } catch {
            updateDownload(zipId, { status: 'failed' });
            toast.error('Failed to generate zip.');
        }
    };

    return (
        <DownloadContext.Provider value={{ downloads, total, completed, addDownload, updateDownload, cancelDownload, downloadTracks }}>
            {children}
        </DownloadContext.Provider>
    );
};
