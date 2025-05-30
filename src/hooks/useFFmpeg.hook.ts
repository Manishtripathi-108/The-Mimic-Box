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

        // ffmpeg.on('log', ({ message }) => {
        //     setLog((prev) => [...prev, message]);
        //     console.log('[ffmpeg]', message);
        // });

        // ffmpeg.on('progress', ({ progress }) => {
        //     console.log('[ffmpeg] Progress:', progress * 100);
        // });

        await ffmpeg.load({
            coreURL: '/download/ffmpeg-core.js',
            wasmURL: '/download/ffmpeg-core.wasm',
            workerURL: '/download/ffmpeg-worker.js',
        });

        setIsLoaded(true);
    };

    const ensureLoaded = () => {
        if (!ffmpegRef.current || !ffmpegRef.current.loaded) {
            throw new Error('FFmpeg is not loaded');
        }
        return ffmpegRef.current;
    };

    const exec = async (args: string[]) => {
        const ffmpeg = ensureLoaded();
        await ffmpeg.exec(args);
    };

    const writeFile = async (name: string, data: string | File | Blob) => {
        const ffmpeg = ensureLoaded();
        await ffmpeg.writeFile(name, await fetchFile(data));
    };

    const readFile = async (name: string) => {
        const ffmpeg = ensureLoaded();
        return await ffmpeg.readFile(name);
    };

    const deleteFile = async (name: string) => {
        const ffmpeg = ensureLoaded();
        await ffmpeg.deleteFile(name);
    };

    return {
        load,
        isLoaded,
        exec,
        writeFile,
        readFile,
        deleteFile,
        ffmpeg: ffmpegRef.current,
    };
};
