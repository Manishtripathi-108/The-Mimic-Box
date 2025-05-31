'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import debounce from 'lodash.debounce';

import { saavnGlobalSearch } from '@/actions/saavn.actions';
import MusicSearchResultOverlay from '@/app/(protected)/spotify/_components/MusicSearchResultOverlay';
import Icon from '@/components/ui/Icon';
import { APP_ROUTES } from '@/constants/routes.constants';
import { T_SaavnSearchResponse } from '@/lib/types/saavn/search.types';

const MusicSearch = () => {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState<T_SaavnSearchResponse | null>(null);
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const debouncedSearch = useMemo(
        () =>
            debounce(async (query: string) => {
                const searchResult = await saavnGlobalSearch(query);
                if (searchResult.success) {
                    setResults(searchResult.payload);
                    setIsOverlayOpen(true);
                } else {
                    setResults(null);
                    setIsOverlayOpen(false);
                }
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
        if (!search.trim()) return;
        setIsOverlayOpen(false);
        router.push(APP_ROUTES.SPOTIFY.SEARCH(search));
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

    return (
        <div ref={containerRef} className="relative w-full">
            <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md">
                <div className="form-field-wrapper bg-secondary">
                    <input type="text" onChange={handleChange} placeholder="Search music..." value={search} className="form-field bg-inherit" />
                    <button type="submit" role="button" aria-label="Search" className="form-icon cursor-pointer">
                        <Icon icon="search" />
                    </button>
                </div>
            </form>

            <MusicSearchResultOverlay results={results} isOpen={isOverlayOpen} onClose={() => setIsOverlayOpen(false)} />
        </div>
    );
};

export default MusicSearch;
