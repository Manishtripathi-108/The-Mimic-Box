'use client';

import { memo, useCallback, useRef, useState } from 'react';

import Image from 'next/image';

import MusicTrackPlayBtn from '@/app/(protected)/music/_components/MusicTrackPlayBtn';
import Button from '@/components/ui/Button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import { useAudioPlayerContext } from '@/contexts/AudioPlayer.context';
import { useClickOutside } from '@/hooks/useClickOutside';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import cn from '@/lib/utils/cn';

const ITEMS_PER_BATCH = 30;

const MusicQueue = ({ className, onClose }: { className?: string; onClose?: () => void }) => {
    const { clearQueue, playbackContext, queue } = useAudioPlayerContext();
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);
    const total = queue?.length || 0;

    const cardRef = useRef<HTMLDivElement>(null);
    useClickOutside({
        targets: [cardRef],
        onClickOutside: onClose || (() => {}),
    });

    const loadMoreItems = useCallback(() => {
        if (visibleCount < total) setVisibleCount((prev) => Math.min(prev + ITEMS_PER_BATCH, total));
    }, [total, visibleCount]);

    const rootRef = useRef<HTMLDivElement>(null);
    const { observeRef } = useIntersectionObserver({
        onEntry: loadMoreItems,
        root: rootRef,
        threshold: 1,
    });

    if (!queue || queue.length === 0) return null;

    return (
        <Card
            ref={cardRef}
            id="queue-popover"
            role="dialog"
            aria-labelledby="queue-heading"
            aria-modal="false"
            className={cn('absolute inset-auto z-50 gap-0', className)}>
            <CardHeader className="shadow-raised-xs flex items-center justify-between px-4 py-3">
                <CardTitle id="queue-heading" className="font-alegreya tracking-wide">
                    Music Queue
                </CardTitle>
                <CardAction className="flex items-center gap-2">
                    <Button size="sm" className="shrink-0" title="Clear Queue" aria-label="Clear the music queue" onClick={clearQueue}>
                        Clear queue
                    </Button>
                    <Button size="sm" className="shrink-0" title="Close Queue" aria-label="Close the music queue" icon="close" onClick={onClose} />
                </CardAction>
            </CardHeader>

            <CardContent id="queue-content" ref={rootRef} className="sm:scrollbar-thin h-full flex-1 space-y-2 overflow-y-auto p-4">
                {queue.slice(0, visibleCount).map((track) => (
                    <div
                        key={track.id}
                        className="from-secondary to-tertiary text-text-secondary shadow-floating-xs flex items-center rounded-xl bg-linear-120 p-1 transition-transform hover:scale-101">
                        <MusicTrackPlayBtn id={track.id} context={playbackContext!} />

                        <div className="flex items-center gap-3 overflow-hidden">
                            <Image
                                src={track.covers?.[0]?.url || '/fallback-cover.jpg'}
                                alt={`Album cover for ${track.title || 'Unknown Title'}`}
                                width={40}
                                height={40}
                                className="size-9 shrink-0 rounded-md object-cover"
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
                    </div>
                ))}

                {visibleCount < total && (
                    <div
                        ref={observeRef}
                        role="status"
                        id="loading-more-queue-tracks"
                        aria-live="polite"
                        className="text-text-secondary flex items-center justify-center gap-2 py-2 text-center text-sm">
                        <Icon icon="loading" className="text-accent size-8" />
                        <span className="sr-only">Loading more tracks...</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default memo(MusicQueue);
