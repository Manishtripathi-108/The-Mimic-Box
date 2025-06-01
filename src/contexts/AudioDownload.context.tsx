'use client';

import { createContext, useContext, useRef, useState } from 'react';

import axios from 'axios';
import JSZip from 'jszip';
import toast from 'react-hot-toast';
import stringSimilarity from 'string-similarity';

import { API_ROUTES } from '@/constants/routes.constants';
import { useFFmpeg } from '@/hooks/useFFmpeg.hook';
import { T_AudioFile, T_AudioPlayerTrack, T_DownloadFile } from '@/lib/types/client.types';
import { T_ITunesMusicTrack } from '@/lib/types/iTunes/track.types';
import { SuccessResponseOutput } from '@/lib/types/response.types';
import { downloadFile } from '@/lib/utils/file.utils';

type DownloadContextType = {
    downloads: T_DownloadFile[];
    total: number;
    completed: number;
    addDownload: (file: Omit<T_DownloadFile, 'status'> | Omit<T_DownloadFile, 'status'>[]) => void;
    updateDownload: (id: string, updates: Partial<T_DownloadFile>) => void;
    cancelDownload: (id: string) => void;
    cancelAllDownloads: () => void;
    downloadTracks: (tracks: T_AudioPlayerTrack[], quality: string) => Promise<void>;
    clearDownloads: () => void;
};

const DownloadContext = createContext<DownloadContextType | null>(null);

export const useAudioDownload = () => {
    const context = useContext(DownloadContext);
    if (!context) throw new Error('useAudioDownload must be used within an AudioDownloadProvider');
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
            artist: track.artists,
            album: track.album || ' ',
            date: track.year || ' ',
            language: track.language || ' ',
            duration: track.duration || ' ',
        },
    };
};

const getLyrics = async (track: T_AudioFile) => {
    try {
        const res = await axios.get<SuccessResponseOutput<string>>(API_ROUTES.LYRICS.GET, {
            params: {
                track: track.metadata.title,
                artist: track.metadata.artist,
                album: track.metadata.album,
                duration: track.metadata.duration,
                lyricsOnly: 'true',
            },
        });
        if (!res.data.success || !res.data.payload) {
            throw new Error('Failed to fetch lyrics');
        }

        return String(res.data.payload);
    } catch {
        return null;
    }
};

const searchMetadata = async (file: T_AudioFile): Promise<T_AudioFile> => {
    try {
        const res = await axios.get<SuccessResponseOutput<T_ITunesMusicTrack[]>>(API_ROUTES.ITUNES.SEARCH.TRACKS, {
            params: {
                track: file.metadata.title,
                artist: file.metadata.artist,
                album: file.metadata.album,
            },
        });

        if (!res.data.success) {
            throw new Error('Failed to fetch metadata');
        }

        let bestMatch: T_ITunesMusicTrack | null = null;
        let bestScore = 0;

        for (const track of res.data.payload) {
            const titleScore = stringSimilarity.compareTwoStrings(track.title.toLowerCase(), file.metadata.title.toString().toLowerCase());
            const artistScore = stringSimilarity.compareTwoStrings(track.artist.toLowerCase(), file.metadata.artist.toString().toLowerCase());
            const albumScore = stringSimilarity.compareTwoStrings(track.album.toLowerCase(), file.metadata.album.toString().toLowerCase());

            if (titleScore < 0.6) continue;
            const score = titleScore * 0.5 + artistScore * 0.3 + albumScore * 0.2;

            if (score > bestScore) {
                bestScore = score;
                bestMatch = track;
            }
        }

        if (bestMatch) {
            return {
                ...file,
                metadata: {
                    ...file.metadata,
                    genre: bestMatch.genre,
                    track: bestMatch.track,
                },
            };
        } else {
            throw new Error('No suitable metadata found');
        }
    } catch (err) {
        console.warn('🪵 > searchMetadata > err:', err);
        return file;
    }
};

export const AudioDownloadProvider = ({ children }: { children: React.ReactNode }) => {
    const [downloads, setDownloads] = useState<T_DownloadFile[]>([]);
    const [total, setTotal] = useState(0);
    const [completed, setCompleted] = useState(0);

    const abortControllers = useRef<Record<string, AbortController>>({});

    const { isLoaded, load, writeFile, exec, readFile, deleteFile } = useFFmpeg();

    const addDownload: DownloadContextType['addDownload'] = (file) => {
        const entries = Array.isArray(file) ? file : [file];
        const withStatus: T_DownloadFile[] = entries.filter((f) => !downloads.some((d) => d.id === f.id)).map((f) => ({ ...f, status: 'pending' }));
        setDownloads((prev) => [...prev, ...withStatus]);
    };

    const updateDownload: DownloadContextType['updateDownload'] = (id, updates) => {
        setDownloads((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
    };

    const cancelDownload: DownloadContextType['cancelDownload'] = (id) => {
        abortControllers.current[id]?.abort();
    };

    const cancelAllDownloads: DownloadContextType['cancelAllDownloads'] = () => {
        Object.values(abortControllers.current).forEach((controller) => controller.abort());
    };

    const clearDownloads: DownloadContextType['clearDownloads'] = () => {
        setDownloads((prev) => prev.filter((f) => !['ready', 'failed', 'cancelled'].includes(f.status)));
    };

    const processTrack = async (index: number, file: T_AudioFile, zip: JSZip) => {
        const input = `input_${index}.mp4`;
        const output = `${file.filename || `track_${index}`}.m4a`;
        const cover = file.cover ? `cover_${index}.jpg` : null;

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

            updateDownload(file.src, { status: 'processing', progress: 0 });

            const lyrics = await getLyrics(file);

            const metadataFile = await searchMetadata(file);

            await writeFile(input, response.data);
            if (cover) await writeFile(cover, file.cover!);

            const args = ['-i', input];
            if (cover) {
                args.push('-i', cover, '-map', '0:a', '-map', '1', '-disposition:v', 'attached_pic', '-metadata:s:v', 'comment=Cover (front)');
            }

            if (lyrics) {
                args.push('-metadata', `lyrics=${lyrics}`);
            }

            args.push(...Object.entries(metadataFile.metadata).flatMap(([k, v]) => ['-metadata', `${k}=${v}`]), '-codec', 'copy', output);

            await exec(args);
            const outFile = await readFile(output);
            zip.file(output, outFile);

            updateDownload(file.src, { status: 'ready', progress: 100 });
            setCompleted((prev) => prev + 1);
        } catch (err: unknown) {
            updateDownload(file.src, {
                status: axios.isCancel(err) ? 'cancelled' : 'failed',
            });
            if (!axios.isCancel(err)) console.error(`Error processing ${file.src}`, err);
        } finally {
            await Promise.all([deleteFile(input), cover ? deleteFile(cover) : Promise.resolve(), deleteFile(output)]);
            delete abortControllers.current[file.src];
        }
    };

    const downloadTracks: DownloadContextType['downloadTracks'] = async (tracks, quality) => {
        const files = tracks.map((t) => buildAudioFileFromTrack(t, quality)).filter(Boolean) as T_AudioFile[];
        const newFiles = files.filter((f) => !downloads.find((d) => d.id === f.src));
        if (!newFiles.length) {
            toast.error('No valid tracks found for selected quality.');
            return;
        }

        const newDownloads = newFiles.map((file) => ({ id: file.src, title: file.filename || 'Unknown Track', url: file.src }));
        addDownload(newDownloads);
        setTotal(newFiles.length);
        setCompleted(0);

        if (!isLoaded) await load();

        const zip = new JSZip();
        await Promise.allSettled(newFiles.map((file, i) => processTrack(i, file, zip)));

        if (!Object.keys(zip.files).length) return;

        const zipId = `${Date.now()}`;
        const zipName = `Tracks - ${zipId}.zip`;

        addDownload({ id: zipId, title: zipName, url: '' });
        updateDownload(zipId, { status: 'processing' });

        try {
            const blob = await zip.generateAsync({ type: 'blob' });
            const zipUrl = URL.createObjectURL(blob);
            updateDownload(zipId, { url: zipUrl, status: 'ready', progress: 100 });
            downloadFile(blob, zipName);
        } catch {
            updateDownload(zipId, { status: 'failed' });
            toast.error('Failed to generate zip.');
        }
    };

    return (
        <DownloadContext.Provider
            value={{
                downloads,
                total,
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
