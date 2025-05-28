'use client';

import Image from 'next/image';

import MusicTrackPlayBtn from '@/app/(protected)/spotify/_components/MusicTrackPlayBtn';
import { useAudioPlayerContext } from '@/contexts/AudioPlayer.context';
import cn from '@/lib/utils/cn';

const MusicQueue = ({ className }: { className?: string }) => {
    const { clearQueue, playbackContext, queue } = useAudioPlayerContext();
    if (!queue || queue.length === 0) return null;

    return (
        <div
            id="queue-popover"
            role="dialog"
            aria-label="Music queue"
            className={cn('bg-secondary absolute inset-auto z-50 flex flex-col overflow-hidden rounded-2xl shadow-lg', className)}>
            <div className="shadow-raised-xs flex items-center justify-between px-4 py-3">
                <h2 className="text-text-primary font-alegreya text-lg tracking-wide">Queue</h2>
                <button className="button shrink-0 text-xs" title="Clear Queue" aria-label="Clear Queue" onClick={clearQueue}>
                    Clear queue
                </button>
            </div>
            <ul className="sm:scrollbar-thin max-h-full flex-1 space-y-2 overflow-y-auto p-4">
                {queue.map((track) => (
                    <li
                        key={track.spotifyId}
                        className="from-secondary to-tertiary text-text-secondary shadow-floating-xs flex items-center rounded-xl bg-linear-120 p-1 transition-transform hover:scale-101">
                        <MusicTrackPlayBtn id={track.spotifyId} context={playbackContext!} />

                        <div className="flex items-center gap-3 overflow-hidden">
                            <Image
                                src={track.covers?.[0]?.url || '/fallback-cover.jpg'}
                                alt={track.title}
                                width={40}
                                height={40}
                                className="h-10 w-10 shrink-0 rounded-xl object-cover"
                            />

                            <div className="min-w-0">
                                <p className="text-text-primary truncate" title={track.title}>
                                    {track.title}
                                </p>

                                <p className="text-text-secondary truncate text-sm" title={track.artists}>
                                    {track.artists || 'Unknown Artist'}
                                </p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MusicQueue;
