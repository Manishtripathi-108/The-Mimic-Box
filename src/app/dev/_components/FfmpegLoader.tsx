'use client';

import { useState } from 'react';

import JSZip from 'jszip';
import toast from 'react-hot-toast';

import { useFFmpeg } from '@/hooks/useFFmpeg.hook';

type AudioFile = {
    src: string;
    cover?: string;
    metadata: Record<string, string>;
    filename?: string;
};

const batchSize = 5;

const FfmpegLoader = () => {
    const { isLoaded, load, writeFile, exec, readFile, deleteFile } = useFFmpeg();
    const [progress, setProgress] = useState(0);

    const handleLoadClick = () => {
        toast.promise(load(), {
            loading: 'Loading FFmpeg...',
            success: 'FFmpeg loaded successfully!',
            error: 'Failed to load FFmpeg',
        });
    };

    const audioFiles: AudioFile[] = [
        {
            filename: 'pretty_little_baby',
            src: 'http://aac.saavncdn.com/784/f88a62ad1ec403f550d6aa27c0af6970_320.mp4',
            cover: 'https://c.saavncdn.com/784/Connie-Francis-Sings-Second-Hand-Love-Other-Hits-English-2022-20250513072638-500x500.jpg',
            metadata: {
                title: 'Pretty Little Baby (Stereo Mix)',
                artist: 'Connie Francis',
                album: 'Connie Francis Sings Second Hand Love & Other Hits',
            },
        },
    ];

    const processBatch = async (files: AudioFile[]) => {
        const zip = new JSZip();
        const total = files.length;
        let completed = 0;

        for (let i = 0; i < total; i += batchSize) {
            const batch = files.slice(i, i + batchSize);
            for (const file of batch) {
                const inputName = `input_${i}.mp4`;
                const coverName = `cover_${i}.jpg`;
                const outputName = `${file.filename || `output_${i}`}.m4a`;

                await writeFile(inputName, file.src);
                if (file.metadata.cover) await writeFile(coverName, file.metadata.cover);

                const metaArgs = Object.entries(file.metadata).flatMap(([k, v]) => ['-metadata', `${k}=${v}`]);

                const args = ['-i', inputName];
                if (file.cover) {
                    args.push('-i', coverName);
                    args.push('-map', '0:a', '-map', '1');
                    args.push('-disposition:v', 'attached_pic');
                    args.push('-metadata:s:v', 'comment=Cover (front)');
                }

                args.push(...metaArgs);
                args.push('-codec', 'copy', outputName);

                await exec(args);

                const output = await readFile(outputName);
                zip.file(outputName, output);

                await deleteFile(inputName);
                if (file.metadata.cover) await deleteFile(coverName);
                await deleteFile(outputName);

                completed++;
                setProgress((completed / total) * 100);
            }
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });

        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'processed_audio.zip';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex items-center justify-center gap-4 p-8">
            <button onClick={handleLoadClick} disabled={isLoaded} className="button m-1">
                {isLoaded ? 'FFmpeg Loaded' : 'Load FFmpeg'}
            </button>

            <button onClick={() => processBatch(audioFiles)} disabled={!isLoaded} className="button m-1">
                Process
            </button>

            <div className="shadow-pressed-xs relative h-1 w-full rounded-full">
                <div
                    className="bg-highlight absolute top-0 left-0 h-full rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${progress || 0}%` }}
                />
            </div>
        </div>
    );
};

export default FfmpegLoader;
