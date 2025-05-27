'use client';

import { createContext, useContext, useState } from 'react';

import axios from 'axios';
import JSZip from 'jszip';
import toast from 'react-hot-toast';

import { useFFmpeg } from '@/hooks/useFFmpeg.hook';
import { T_AudioFile, T_AudioPlayerTrack, T_DownloadFile } from '@/lib/types/client.types';
import { downloadFile } from '@/lib/utils/file.utils';

type DownloadContextType = {
    downloads: T_DownloadFile[];
    addDownload: (file: Omit<T_DownloadFile, 'status'>) => void;
    downloadTracks: (tracks: T_AudioPlayerTrack[], quality: string) => Promise<void>;
    updateDownload: (id: string, updates: Partial<T_DownloadFile>) => void;
};

const DownloadContext = createContext<DownloadContextType | null>(null);

export const useAudioDownload = () => {
    const context = useContext(DownloadContext);
    if (!context) {
        throw new Error('useAudioDownload must be used within a AudioDownloadProvider');
    }
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

const batchSize = 5;

export const AudioDownloadProvider = ({ children }: { children: React.ReactNode }) => {
    const [downloads, setDownloads] = useState<T_DownloadFile[]>([]);
    const { isLoaded, load, writeFile, exec, readFile, deleteFile } = useFFmpeg();

    const addDownload = (file: Omit<T_DownloadFile, 'status'>) => {
        setDownloads((prev) => [...prev, { ...file, status: 'pending' }]);
    };

    const updateDownload = (id: string, updates: Partial<T_DownloadFile>) => {
        setDownloads((prev) => prev.map((file) => (file.id === id ? { ...file, ...updates } : file)));
    };

    const downloadTracks = async (tracks: T_AudioPlayerTrack[], quality: string) => {
        if (!isLoaded) await load();

        const audioFiles = tracks.map((track) => buildAudioFileFromTrack(track, quality)).filter(Boolean) as T_AudioFile[];
        if (!audioFiles.length) {
            toast.error('No valid tracks found for selected quality.');
            return;
        }

        const downloads: T_DownloadFile[] = audioFiles.map((file) => ({
            id: file.src,
            title: file.filename || 'Unknown Track',
            url: file.src,
            status: 'pending',
        }));

        setDownloads((prev) => [...prev, ...downloads]);

        const zip = new JSZip();
        for (let i = 0; i < audioFiles.length; i += batchSize) {
            const batch = audioFiles.slice(i, i + batchSize);
            for (let j = 0; j < batch.length; j++) {
                const file = batch[j];
                const idx = i + j;
                const inputName = `input_${idx}.mp4`;
                const outputName = `${file.filename || `output_${idx}`}.m4a`;
                const coverName = file.cover ? `cover_${idx}.jpg` : null;

                updateDownload(file.src, { status: 'downloading', progress: 0 });

                const response = await axios.get(file.src, {
                    responseType: 'blob',
                    onDownloadProgress: ({ progress }) => {
                        updateDownload(file.src, { status: 'downloading', progress: (progress || 0) * 100 });
                    },
                });

                await writeFile(inputName, response.data);
                updateDownload(file.src, { status: 'processing', progress: 0 });

                const args = ['-i', inputName];

                if (coverName && file.cover) {
                    await writeFile(coverName, file.cover);
                    args.push(
                        '-i',
                        coverName,
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

                args.push(...Object.entries(file.metadata).flatMap(([k, v]) => ['-metadata', `${k}=${v}`]), '-codec', 'copy', outputName);
                await exec(args);

                const output = await readFile(outputName);
                zip.file(outputName, output);

                await deleteFile(inputName);
                if (coverName) await deleteFile(coverName);
                await deleteFile(outputName);
                updateDownload(file.src, { status: 'ready', progress: 100 });
            }
        }
        const zipId = new Date().getTime().toString();

        const zipFilename = `Tracks - ${zipId}.zip`;

        setDownloads([{ id: zipId, title: zipFilename, url: '', status: 'processing' }]);

        const zipBlob = await zip.generateAsync({ type: 'blob' });

        updateDownload(zipId, { status: 'ready', url: URL.createObjectURL(zipBlob), progress: 100 });

        downloadFile(zipBlob, zipFilename);
    };

    return <DownloadContext.Provider value={{ downloads, addDownload, downloadTracks, updateDownload }}>{children}</DownloadContext.Provider>;
};
