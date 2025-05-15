'use client';

import { useAudioPlayerContext } from '@/contexts/audioPlayer.context';
import cn from '@/lib/utils/cn';
import { downloadFile } from '@/lib/utils/file.utils';

const MusicDownloads = ({ className }: { className?: string }) => {
    const { current } = useAudioPlayerContext();
    if (!current) return null;

    return (
        <div
            id="download-popover"
            role="tooltip"
            className={cn(
                'bg-tertiary text-text-secondary absolute right-1/2 bottom-full z-60 m-0 mb-4 overflow-hidden rounded-md border shadow-lg',
                className
            )}>
            <ul className="divide-y">
                {current.urls.map((url) => (
                    <li key={url.quality}>
                        <button
                            type="button"
                            className="hover:bg-highlight block w-full px-4 py-2 hover:text-white"
                            onClick={() => downloadFile(url.url, `${current.title} - ${url.quality}`)}>
                            {url.quality}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MusicDownloads;
