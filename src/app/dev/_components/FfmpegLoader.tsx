'use client';

import { useRef, useState } from 'react';

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';
import toast, { Toaster } from 'react-hot-toast';

const FfmpegLoader = () => {
    const ffmpegRef = useRef(new FFmpeg());
    const [isFFmpegLoaded, setIsFFmpegLoaded] = useState(false);

    const loadFFmpeg = async () => {
        const ffmpeg = ffmpegRef.current;
        if (ffmpeg.loaded) {
            setIsFFmpegLoaded(true);
            return;
        }
        await ffmpeg.load({
            coreURL: await toBlobURL('/download/ffmpeg-core.js', 'text/javascript'),
            wasmURL: await toBlobURL('/download/ffmpeg-core.wasm', 'application/wasm'),
        });
        setIsFFmpegLoaded(true);
    };

    const handleLoadClick = () => {
        toast.promise(loadFFmpeg(), {
            loading: 'Loading FFmpeg...',
            success: 'FFmpeg loaded successfully!',
            error: 'Failed to load FFmpeg',
        });
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4 p-8">
            <Toaster position="top-center" />
            <button
                onClick={handleLoadClick}
                disabled={isFFmpegLoaded}
                className="rounded-md bg-blue-600 px-4 py-2 text-white transition disabled:opacity-50">
                {isFFmpegLoaded ? 'FFmpeg Loaded' : 'Load FFmpeg'}
            </button>
        </div>
    );
};

export default FfmpegLoader;
