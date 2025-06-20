'use client';

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import debounce from 'lodash.debounce';
import { AnimatePresence, motion } from 'motion/react';

import { saavnGlobalSearch } from '@/actions/saavn.actions';
import Icon from '@/components/ui/Icon';
import APP_ROUTES from '@/constants/routes/app.routes';
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
            return '#';
    }
};

const MusicSearch = () => {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState<T_SaavnSearchResponse | null>(null);
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const debouncedSearch = useMemo(
        () =>
            debounce((query: string) => {
                startTransition(async () => {
                    const response = await saavnGlobalSearch(query);
                    if (response.success) {
                        setResults(response.payload);
                        setIsOverlayOpen(true);
                    } else {
                        setResults(null);
                        setIsOverlayOpen(false);
                    }
                });
            }, 500),
        []
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);

        if (!value.trim()) {
            setResults(null);
            setIsOverlayOpen(false);
            debouncedSearch.cancel();
            return;
        }

        debouncedSearch(value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Todo: make search page and uncomment this 😘
        return;
        if (!search.trim()) return;

        setIsOverlayOpen(false);
        router.push(APP_ROUTES.MUSIC.SEARCH(search.trim()));
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOverlayOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    const nonEmptySections = results ? Object.entries(results).filter(([, section]) => section.results.length > 0) : [];

    const hasNoResults = search.trim().length > 0 && nonEmptySections.length === 0 && !isPending;

    return (
        <div ref={containerRef} className="relative w-full">
            <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md">
                <div className="form-field-wrapper bg-secondary">
                    <input type="text" onChange={handleChange} placeholder="Search music..." value={search} className="form-field bg-inherit" />
                    <button type="submit" className="form-icon cursor-pointer" aria-label="Search">
                        <Icon icon="search" flip="horizontal" />
                    </button>
                </div>
            </form>

            <AnimatePresence>
                {isOverlayOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 16 }}
                        className="bg-secondary absolute top-full left-1/2 z-50 mt-2 w-full max-w-6xl -translate-x-1/2 overflow-hidden rounded-2xl shadow-xl">
                        <div className="sm:scrollbar-thin flex max-h-[60vh] w-full flex-wrap gap-6 overflow-y-auto p-6 text-sm">
                            {isPending ? (
                                <div className="text-text-secondary mx-auto flex h-20 w-full items-center justify-center gap-2 text-center">
                                    <Icon icon="loading" className="size-8" />
                                    Searching...
                                </div>
                            ) : hasNoResults ? (
                                <div className="text-text-secondary mx-auto flex h-20 w-full items-center justify-center text-center">
                                    No results found.
                                </div>
                            ) : (
                                nonEmptySections.map(([key, section]) => (
                                    <div key={key} style={{ order: section.position }} className="flex min-w-[240px] flex-1 flex-col">
                                        <h3 className="text-highlight font-alegreya mb-2 text-base font-semibold tracking-wide uppercase">
                                            {key.replace(/_/g, ' ')}
                                        </h3>

                                        {section.results.map((item, i) => (
                                            <Link
                                                href={createLink(item.id, item.type)}
                                                key={i}
                                                onClick={() => setIsOverlayOpen(false)}
                                                className="group hover:bg-primary flex cursor-pointer items-center gap-3 rounded-lg p-2 transition">
                                                <div className="relative size-10 shrink-0 overflow-hidden rounded-md">
                                                    <Image
                                                        width={40}
                                                        height={40}
                                                        src={item.image[0]?.url}
                                                        alt={item.title}
                                                        className="object-cover"
                                                    />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="text-text-primary truncate font-medium">{item.title}</p>
                                                    <p className="text-text-secondary truncate text-xs">{item.description}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MusicSearch;
