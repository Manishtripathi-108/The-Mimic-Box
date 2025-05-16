'use client';

import isEqual from 'lodash.isequal';

import { useAudioPlayerContext } from '@/contexts/audioPlayer.context';
import { T_TrackContext } from '@/lib/types/client.types';
import { downloadZip } from '@/lib/utils/client-archiver.utils';
import cn from '@/lib/utils/cn';
import { downloadFile } from '@/lib/utils/file.utils';

const QUALITIES = ['12kbps', '48kbps', '96kbps', '160kbps', '320kbps'];

const MusicDownloads = ({
    className,
    context,
    downloadCurrent = false,
    ...props
}: { className?: string; context?: T_TrackContext; downloadCurrent?: boolean } & React.HTMLAttributes<HTMLDivElement>) => {
    const { current, playbackContext, queue } = useAudioPlayerContext();

    const download = async (quality: string) => {
        if (downloadCurrent && current) {
            const url = current.urls.find((url) => url.quality === quality);
            if (url) {
                return downloadFile(url.url, `${current.title} - ${quality}.mp3`);
            }
        }

        if (playbackContext && isEqual(playbackContext, context)) {
            const files = queue
                .map((track) => {
                    const url = track.urls.find((u) => u.quality === quality);
                    if (!url) return null;
                    return {
                        url: url.url,
                        filename: `${track.title} - ${quality}.mp3`,
                    };
                })
                .filter(Boolean) as { url: string; filename: string }[];

            if (files.length > 0) {
                return downloadZip(files, `${playbackContext.name} Queue - ${quality}.zip`);
            }
        }
    };

    return (
        <div
            id="download-popover"
            role="tooltip"
            className={cn('bg-tertiary text-text-secondary absolute inset-auto m-0 overflow-hidden rounded-md border shadow-lg', className)}
            {...props}>
            <ul className="divide-y">
                {QUALITIES.map((q) => (
                    <li key={q}>
                        <button
                            type="button"
                            className="hover:bg-highlight block w-full cursor-pointer px-4 py-2 hover:text-white"
                            onClick={() => download(q)}>
                            {q}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MusicDownloads;
