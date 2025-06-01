'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { AnimatePresence, motion } from 'framer-motion';

import { APP_ROUTES } from '@/constants/routes.constants';
import { T_SaavnSearchResponse } from '@/lib/types/saavn/search.types';

const createLink = (id: string, type: string) => {
    switch (type) {
        case 'song':
            return APP_ROUTES.MUSIC.JS.TRACKS(id);
        case 'album':
            return APP_ROUTES.MUSIC.JS.ALBUMS(id);
        case 'playlist':
            return APP_ROUTES.MUSIC.JS.PLAYLISTS(id);
        case 'artist':
            return APP_ROUTES.MUSIC.JS.ARTISTS(id);
        default:
            return APP_ROUTES.MUSIC.JS.TRACKS(id);
    }
};

type Props = {
    results: T_SaavnSearchResponse | null;
    isOpen: boolean;
    onClose: () => void;
};

const MusicSearchResultOverlay: React.FC<Props> = ({ results, isOpen, onClose }) => {
    const nonEmptySections = results ? Object.entries(results).filter(([, section]) => section.results.length > 0) : [];

    const handleLinkClick = () => {
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && nonEmptySections.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    style={{ maxWidth: `${nonEmptySections.length * 280}px` }}
                    className="bg-secondary absolute top-full left-1/2 z-50 mt-2 w-full -translate-x-1/2 overflow-hidden rounded-2xl shadow-xl">
                    <div className="sm:scrollbar-thin flex max-h-[50vh] w-full flex-wrap gap-6 overflow-y-auto p-6 text-sm">
                        {nonEmptySections.map(([key, section]) => (
                            <div key={key} style={{ order: section.position }} className="flex min-w-[240px] flex-1 flex-col">
                                <h3 className="text-highlight font-alegreya mb-2 text-base font-semibold tracking-wide uppercase">
                                    {key.replace(/_/g, ' ')}
                                </h3>

                                {section.results.map((item, i) => (
                                    <Link
                                        href={createLink(item.id, item.type)}
                                        key={i}
                                        onClick={handleLinkClick}
                                        className="group hover:bg-primary flex cursor-pointer items-center gap-3 rounded-lg p-2 transition">
                                        <div className="relative size-10 shrink-0 overflow-hidden rounded-md">
                                            <Image width={40} height={40} src={item.image[0]?.url} alt={item.title} className="object-cover" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="text-text-primary truncate font-medium">{item.title}</p>
                                            <p className="text-text-secondary truncate text-xs">{item.description}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MusicSearchResultOverlay;
