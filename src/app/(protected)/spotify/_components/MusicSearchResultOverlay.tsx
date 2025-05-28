'use client';

import React from 'react';

import Image from 'next/image';

import { AnimatePresence, motion } from 'framer-motion';

import { T_SearchResponse } from '@/lib/types/jio-saavn/search.types';

const MusicSearchResultOverlay: React.FC<{ results: T_SearchResponse | null }> = ({ results }) => {
    return (
        <AnimatePresence>
            {results && (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={{ duration: 0.25 }}
                    className="bg-secondary absolute top-full left-1/2 z-50 w-full max-w-[1200px] -translate-x-1/2 overflow-hidden rounded-2xl shadow-xl">
                    <div className="sm:scrollbar-thin flex max-h-[50vh] w-full flex-wrap gap-6 overflow-y-auto p-6 text-sm">
                        {Object.keys(results).map((key) => {
                            const section = results[key as keyof T_SearchResponse];
                            if (section.results.length === 0) return null;

                            return (
                                <div key={key} style={{ order: section.position }} className="flex min-w-[240px] flex-1 flex-col sm:max-w-[300px]">
                                    <h3 className="text-highlight font-alegreya mb-4 text-base font-semibold tracking-wide uppercase">
                                        {key.replace(/_/g, ' ')}
                                    </h3>

                                    {section.results.map((item, i) => (
                                        <div
                                            key={i}
                                            className="group hover:bg-primary flex cursor-pointer items-center gap-3 rounded-lg p-2 transition"
                                            tabIndex={0}>
                                            <div className="relative size-10 shrink-0 overflow-hidden rounded-md">
                                                <Image width={40} height={40} src={item.image[0]?.url} alt={item.title} className="object-cover" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="text-text-primary truncate font-medium">{item.title}</p>
                                                <p className="text-text-secondary truncate text-xs">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MusicSearchResultOverlay;
