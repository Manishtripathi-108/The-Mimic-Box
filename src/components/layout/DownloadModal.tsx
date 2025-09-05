'use client';

import { memo, useCallback, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'motion/react';
import { InView } from 'react-intersection-observer';

import { Button } from '@/components/ui/Button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import DownloadItem from '@/components/ui/DownloadItem';
import Icon from '@/components/ui/Icon';
import { useAudioDownload } from '@/contexts/AudioDownload.context';
import { useClickOutside } from '@/hooks/useClickOutside';
import useToggle from '@/hooks/useToggle';
import cn from '@/lib/utils/cn';

const ITEMS_PER_BATCH = 30;

const DownloadModal = ({ className }: { className?: string }) => {
    const { downloads, total, completed, cancelDownload, cancelAllDownloads, clearDownloads } = useAudioDownload();
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);
    const loadMoreItems = useCallback(() => {
        if (visibleCount < total) setVisibleCount((prev) => Math.min(prev + ITEMS_PER_BATCH, total));
    }, [total, visibleCount]);

    const rootRef = useRef<HTMLDivElement>(null);

    const [open, { setAlternate: openModal, setDefault: closeModal }] = useToggle(false, true, {
        onChange: (value) => {
            if (!value) setVisibleCount(ITEMS_PER_BATCH);
        },
        keybind: 'Escape',
        toggleOnKeyTo: false,
    });

    useClickOutside({
        targets: [rootRef],
        onClickOutside: closeModal,
        disabled: !open,
    });

    if (!total) return null;

    return (
        <div
            className={cn(
                'fixed z-50',
                className,
                open
                    ? 'ignore-onClickOutside inset-0 h-dvh sm:inset-auto sm:top-24 sm:right-10 sm:max-h-[60vh] sm:w-full sm:max-w-sm'
                    : 'top-24 right-10'
            )}
            aria-modal="true"
            role="dialog"
            aria-labelledby="download-progress-title">
            <AnimatePresence>
                {open ? (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-secondary flex h-full flex-col overflow-hidden shadow-lg sm:rounded-2xl">
                        <Card className="h-full gap-0 rounded-none sm:rounded-2xl">
                            <CardHeader className="px-4 py-3">
                                <CardTitle className="font-alegreya text-lg tracking-wide">Download Progress</CardTitle>
                                <CardAction>
                                    <Button title="Close modal" aria-label="Close modal" onClick={closeModal} icon="close" />
                                </CardAction>
                            </CardHeader>

                            <CardContent className="flex max-h-full flex-col px-0 pb-4">
                                <div className="text-text-secondary flex items-center justify-between gap-4 px-4 py-2 text-sm">
                                    <span>
                                        Completed: {completed}/{total}
                                    </span>
                                    <Button size="sm" onClick={clearDownloads}>
                                        Clear
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={cancelAllDownloads}>
                                        Cancel All
                                    </Button>
                                </div>

                                <div ref={rootRef} className="sm:scrollbar-thin flex-1 space-y-2 overflow-y-auto px-4 pt-2 pb-10">
                                    {downloads.slice(0, visibleCount).map((file) => (
                                        <DownloadItem key={file.id} file={file} onCancel={() => cancelDownload(file.id)} />
                                    ))}

                                    {visibleCount < total && (
                                        <InView
                                            as="div"
                                            onChange={(inView) => {
                                                if (inView) loadMoreItems();
                                            }}
                                            threshold={0.5}
                                            role="status"
                                            id="loading-more-queue-tracks"
                                            aria-live="polite"
                                            className="text-text-secondary flex items-center justify-center gap-2 py-2 text-center text-sm">
                                            <Icon icon="loading" className="text-accent size-8" />
                                            <span className="sr-only">Loading more tracks...</span>
                                        </InView>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <Button
                        className="relative size-10 rounded-full p-1.5"
                        size="lg"
                        title="Open Downloads"
                        aria-haspopup="dialog"
                        onClick={openModal}
                        aria-label="Open Downloads"
                        icon="download">
                        {total > 0 && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                className="bg-accent before:bg-accent absolute -top-2 -right-2 size-5 rounded-full before:absolute before:inset-0 before:animate-ping before:rounded-full">
                                <span className="text-on-accent absolute inset-0 flex items-center justify-center text-xs font-bold">{total}</span>
                            </motion.div>
                        )}
                    </Button>
                )}
            </AnimatePresence>
        </div>
    );
};

export default memo(DownloadModal);
