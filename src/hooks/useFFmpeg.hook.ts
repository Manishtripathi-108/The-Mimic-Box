'use client';

import { useRef, useState } from 'react';

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

export const useFFmpeg = () => {
    const ffmpegRef = useRef(new FFmpeg());
    const [isLoaded, setIsLoaded] = useState(false);
    const [progress, setProgress] = useState(0);
    const [log, setLog] = useState<string[]>([]);

    const load = async () => {
        const ffmpeg = ffmpegRef.current;
        if (ffmpeg.loaded) {
            setIsLoaded(true);
            return;
        }

        ffmpeg.on('log', ({ message }) => {
            setLog((prev) => [...prev, message]);
            console.log('[ffmpeg]', message);
        });

        ffmpeg.on('progress', ({ progress }) => {
            setProgress(progress * 100);
        });

        await ffmpeg.load({
            coreURL: '/download/ffmpeg-core.js',
            wasmURL: '/download/ffmpeg-core.wasm',
        });
        setIsLoaded(true);
    };

    const exec = async (args: string[]) => {
        if (!ffmpegRef.current.loaded) throw new Error('FFmpeg is not loaded');
        await ffmpegRef.current.exec(args);
    };

    const writeFile = async (name: string, data: string | File | Blob) => {
        if (!ffmpegRef.current.loaded) throw new Error('FFmpeg is not loaded');
        await ffmpegRef.current.writeFile(name, await fetchFile(data));
    };

    const readFile = async (name: string) => {
        if (!ffmpegRef.current.loaded) throw new Error('FFmpeg is not loaded');
        const file = await ffmpegRef.current.readFile(name);
        return file;
    };

    const deleteFile = async (name: string) => {
        if (!ffmpegRef.current.loaded) throw new Error('FFmpeg is not loaded');
        await ffmpegRef.current.deleteFile(name);
    };

    const reset = () => {
        setProgress(0);
        setLog([]);
    };

    return {
        load,
        isLoaded,
        exec,
        writeFile,
        readFile,
        deleteFile,
        progress,
        log,
        reset,
        ffmpeg: ffmpegRef.current,
    };
};
