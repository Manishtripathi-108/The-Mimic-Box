'use client';

import React, { useCallback, useMemo } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Icon } from '@iconify/react';

import Modal, { openModal } from '@/components/Modals';
import AnilistFilter from '@/components/layout/anilist/AnilistFIlter';
import MediaCard from '@/components/layout/anilist/MediaCard';
import TabNavigation from '@/components/ui/TabNavigation';
import { ANILIST_MEDIA_TAB } from '@/constants/client.constants';
import ICON_SET from '@/constants/icons';
import useFilteredData from '@/hooks/useFilteredData';
import { AnilistFavorites, AnilistMediaCollection, AnilistMediaListStatus } from '@/lib/types/anilist.types';

const AnilistMain = ({
    mediaLists,
    type,
}: {
    mediaLists: AnilistMediaCollection['MediaListCollection']['lists'] | AnilistFavorites['User']['favourites'];
    type: 'anime' | 'manga' | 'favourites';
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    /** Extracting query parameters with default values */
    const selectedTab = (searchParams.get('tab') || 'All') as 'All' | AnilistMediaListStatus | 'Anime' | 'Manga';
    const format = searchParams.get('format') || null;
    const genres = searchParams.getAll('genres');
    const year = parseInt(searchParams.get('year')!, 10) || null;
    const status = searchParams.get('status') || null;
    const sort = searchParams.get('sort') || 'Last Added';
    const page = searchParams.has('page') ? parseInt(searchParams.get('page')!, 10) : 1;

    /** Filters state */
    const filters = useMemo(() => ({ format, genres, year, status, sort }), [format, genres, year, status, sort]);
    const filteredData = useFilteredData(mediaLists, filters, selectedTab);

    /**
     * Function to create query string while keeping existing parameters
     */
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);
            return params.toString();
        },
        [searchParams]
    );

    /** Handle tab changes */
    const handleTabChange = useCallback(
        (tab: string) => {
            router.push(`${pathname}?${createQueryString('tab', tab)}`);
        },
        [pathname, createQueryString, router]
    );

    return (
        <>
            {/* Header Section */}
            <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-highlight text-2xl font-bold capitalize sm:text-3xl">Your {type} List</h2>

                {/* Search Field */}
                <div className="form-field-wrapper hidden max-w-86 sm:flex">
                    <input type="text" name="search" placeholder="Search..." className="form-field" />
                    <Icon role="button" icon={ICON_SET.SEARCH} className="form-icon" />
                </div>

                {/* View Mode & Filter Buttons */}
                <div className="flex items-center justify-end pr-4">
                    {['list', 'card'].map((mode) => (
                        <button key={mode} className="text-text-primary button p-2 shadow-none">
                            <Icon icon={mode === 'list' ? ICON_SET.LIST : ICON_SET.CARD} className="size-4" />
                        </button>
                    ))}
                    <button onClick={() => openModal('filters-modal')} className="button text-highlight ml-4 size-8 rounded-xl p-2">
                        <Icon icon={ICON_SET.FILTER} className="size-full" />
                    </button>
                </div>
            </div>

            {/* Tabs Navigation */}
            <TabNavigation className="mb-6" tabs={ANILIST_MEDIA_TAB} currentTab={selectedTab} onTabChange={handleTabChange} />

            {/* Anime Cards Grid */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
                {filteredData?.map((entry) => <MediaCard key={entry.id} media={'media' in entry ? entry.media : entry} />)}
            </div>

            {/* Filters Modal */}
            <Modal modalId="filters-modal">
                <AnilistFilter
                    filters={filters}
                    setFilters={(updatedFilters) => {
                        const params = new URLSearchParams(searchParams.toString());

                        Object.entries(updatedFilters).forEach(([key, value]) => {
                            if (value) {
                                if (Array.isArray(value)) {
                                    if (value.length > 0) {
                                        value.forEach((val) => params.append(key, val));
                                    } else {
                                        params.delete(key);
                                    }
                                    return;
                                } else {
                                    params.set(key, value.toString());
                                }
                            } else {
                                params.delete(key);
                            }
                        });

                        router.push(`${pathname}?${params.toString()}`);
                    }}
                />
            </Modal>

            {/* Pagination */}
            <div className="text-center text-lg font-semibold">Page: {page}</div>
        </>
    );
};

export default AnilistMain;
