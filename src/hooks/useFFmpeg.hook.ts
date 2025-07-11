'use client';

import { useRef, useState } from 'react';

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

export const useFFmpeg = () => {
    const ffmpegRef = useRef<FFmpeg | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const load = async () => {
        if (!ffmpegRef.current) {
            ffmpegRef.current = new FFmpeg();
        }

        const ffmpeg = ffmpegRef.current;

        if (ffmpeg.loaded) {
            setIsLoaded(true);
            return;
        }

        await ffmpeg.load({
            coreURL: '/download/ffmpeg-core.js',
            wasmURL: '/download/ffmpeg-core.wasm',
            workerURL: '/download/ffmpeg-worker.js',
        });

        setIsLoaded(true);
    };

    const ensureLoaded = async () => {
        if (!ffmpegRef.current || !ffmpegRef.current.loaded) {
            await load();
            if (!ffmpegRef.current) {
                throw new Error('FFmpeg instance is not initialized');
            }
        }
        return ffmpegRef.current;
    };

    const exec = async (args: string[]) => {
        const ffmpeg = await ensureLoaded();
        await ffmpeg.exec(args);
    };

    const writeFile = async (name: string, data: string | File | Blob) => {
        const ffmpeg = await ensureLoaded();
        await ffmpeg.writeFile(name, await fetchFile(data));
    };

    const readFile = async (name: string) => {
        const ffmpeg = await ensureLoaded();
        return await ffmpeg.readFile(name);
    };

    const deleteFile = async (name: string) => {
        const ffmpeg = await ensureLoaded();
        await ffmpeg.deleteFile(name);
    };

    const cleanup = async () => {
        const ffmpeg = ffmpegRef.current;
        if (ffmpeg) {
            try {
                ffmpeg.terminate();
            } catch (err) {
                console.warn('Failed to terminate ffmpeg:', err);
            }
            ffmpegRef.current = null;
            setIsLoaded(false);
        }
    };

    return {
        load,
        isLoaded,
        exec,
        writeFile,
        readFile,
        deleteFile,
        ffmpeg: ffmpegRef.current,
        cleanup,
    };
};
