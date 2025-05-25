'use client';

import { useState } from 'react';

import { AnimatePresence, motion } from 'motion/react';

import DownloadItem from '@/components/ui/DownloadItem';
import Icon from '@/components/ui/Icon';
import { useDownload } from '@/contexts/Download.context';
import cn from '@/lib/utils/cn';

const DownloadModal = ({ className }: { className?: string }) => {
    const { downloads } = useDownload();
    const [open, setOpen] = useState(false);
    if (!downloads.length) return null;

    return (
        <div
            className={cn('fixed top-25 right-10 z-50 max-w-sm', className, {
                'w-full': open,
            })}>
            <AnimatePresence>
                {open ? (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-secondary overflow-hidden rounded-xl pb-4">
                        {/* Header */}
                        <div className="shadow-raised-xs mb-4 flex items-center justify-between p-4">
                            <h2 className="text-text-primary font-alegreya text-lg tracking-wide">Download Progress</h2>
                            <button
                                className="button size-7 shrink-0 rounded-full p-1"
                                title="close"
                                aria-label="Close"
                                onClick={() => setOpen(false)}>
                                <Icon icon="close" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="max-h-[60vh] space-y-4 overflow-y-auto px-4 pb-1">
                            {downloads.length === 0 ? (
                                <p className="text-text-secondary text-center">No active downloads</p>
                            ) : (
                                downloads.map((file) => <DownloadItem key={file.id} file={file} />)
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <div className="button size-10 rounded-full p-2">
                        <button type="button" onClick={() => setOpen(true)} className="relative size-full cursor-pointer">
                            <Icon icon="download" />
                            {downloads.length > 0 && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                    className="bg-accent before:bg-accent absolute -top-2.5 -right-2.5 size-4 rounded-full before:absolute before:inset-0 before:animate-ping before:rounded-full">
                                    <span className="text-text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs">
                                        {downloads.length}
                                    </span>
                                </motion.div>
                            )}
                        </button>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DownloadModal;
