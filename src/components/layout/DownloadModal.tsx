'use client';

import { memo, useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'motion/react';

import Button from '@/components/ui/Button';
import DownloadItem from '@/components/ui/DownloadItem';
import Icon from '@/components/ui/Icon';
import { useAudioDownload } from '@/contexts/AudioDownload.context';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import useToggle from '@/hooks/useToggle';
import cn from '@/lib/utils/cn';

const ITEMS_PER_BATCH = 50;
const DownloadModal = ({ className }: { className?: string }) => {
    const { downloads, total, completed, cancelDownload, cancelAllDownloads, clearDownloads } = useAudioDownload();
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);
    const rootRef = useRef<HTMLDivElement>(null);
    const { observeRef } = useIntersectionObserver({
        onEntry() {
            console.log('🪵 > DownloadModal.tsx:23 > useIntersectionObserver > onEntry called');

            setVisibleCount((prev) => {
                const next = Math.min(prev + ITEMS_PER_BATCH, downloads.length);
                return prev !== next ? next : prev;
            });
        },
        root: rootRef,
    });
    const [open, { toggle }] = useToggle(false, true, {
        onChange(value) {
            console.log('🪵 > DownloadModal.tsx:15 > useToggle > toggle called with value:', value);
            if (!value) setVisibleCount(ITEMS_PER_BATCH);
        },
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') toggle(false);
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [toggle]);

    if (!downloads.length) return null;

    console.log('🪵 > DownloadModal.tsx:19 > DownloadModal > visibleCount:', visibleCount);
    return (
        <div
            className={cn('fixed z-50', className, {
                'inset-0 h-dvh sm:inset-auto sm:top-24 sm:right-10 sm:max-h-[60vh] sm:w-full sm:max-w-sm': open,
                'top-24 right-10': !open,
            })}
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
                        {/* Header */}
                        <div className="shadow-raised-xs flex items-center justify-between px-4 py-3">
                            <h2 className="text-text-primary font-alegreya text-lg tracking-wide">Download Progress</h2>
                            <Button title="Close modal" aria-label="Close modal" onClick={() => toggle(false)} icon="close" />
                        </div>

                        {/* Progress Summary */}
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

                        {/* Content */}
                        <div ref={rootRef} className="sm:scrollbar-thin max-h-full flex-1 space-y-2 overflow-y-auto px-4 pt-2 pb-4">
                            {downloads.slice(0, visibleCount).map((file) => (
                                <DownloadItem key={file.id} file={file} onCancel={() => cancelDownload(file.id)} />
                            ))}
                            {visibleCount < downloads.length && (
                                <div
                                    ref={observeRef}
                                    role="status"
                                    aria-live="polite"
                                    className="text-text-secondary flex items-center justify-center gap-2 py-2 text-center text-sm">
                                    <Icon icon="loading" className="text-accent size-8" />
                                </div>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <Button
                        className="relative size-10 rounded-full p-1.5"
                        size="lg"
                        title="Open Downloads"
                        aria-haspopup="dialog"
                        onClick={() => toggle(true)}
                        aria-label="Open Downloads"
                        icon="download">
                        {downloads.length > 0 && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                className="bg-accent before:bg-accent absolute -top-2 -right-2 size-5 rounded-full before:absolute before:inset-0 before:animate-ping before:rounded-full">
                                <span className="text-text-primary absolute inset-0 flex items-center justify-center text-xs font-bold">
                                    {downloads.length}
                                </span>
                            </motion.div>
                        )}
                    </Button>
                )}
            </AnimatePresence>
        </div>
    );
};

export default memo(DownloadModal);
