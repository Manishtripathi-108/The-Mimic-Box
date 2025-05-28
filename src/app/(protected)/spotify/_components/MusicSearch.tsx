'use client';

import { Suspense, lazy, useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import debounce from 'lodash.debounce';

import { saavnGlobalSearch } from '@/actions/jio-saavn.actions';
import Icon from '@/components/ui/Icon';
import { APP_ROUTES } from '@/constants/routes.constants';
import { T_SearchResponse } from '@/lib/types/jio-saavn/search.types';

const MusicSearchResultOverlay = lazy(() => import('@/app/(protected)/spotify/_components/MusicSearchResultOverlay'));

const MusicSearch = () => {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState<T_SearchResponse | null>(null);
    const router = useRouter();

    const debouncedSearch = useMemo(
        () =>
            debounce(async (query: string) => {
                const searchResult = await saavnGlobalSearch(query);
                console.log('searchResult', searchResult);
                if (searchResult.success) {
                    setResults(searchResult.payload);
                } else {
                    setResults(null);
                }
            }, 500),
        []
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!value.trim()) {
            setResults(null);
            debouncedSearch.cancel();
            return;
        }
        setSearch(value);
        debouncedSearch(value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!search.trim()) return;
        router.push(APP_ROUTES.SPOTIFY.SEARCH(search));
    };

    return (
        <div className="relative w-full">
            <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md">
                <div className="form-field-wrapper bg-secondary hidden max-w-86 sm:flex">
                    <input type="text" onChange={handleChange} placeholder="Search music..." className="form-field bg-inherit" />
                    <button type="submit" role="button" aria-label="Search" className="form-icon cursor-pointer">
                        <Icon icon="search" />
                    </button>
                </div>
            </form>

            <Suspense fallback={<Icon icon="search" className="text-accent absolute top-full z-50 size-20" />}>
                <MusicSearchResultOverlay results={results} />
            </Suspense>
        </div>
    );
};

export default MusicSearch;
