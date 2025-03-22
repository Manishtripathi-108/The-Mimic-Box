'use client';

import React, { useCallback, useMemo, useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Icon } from '@iconify/react';

import Modal, { openModal } from '@/components/Modals';
import AnilistFilter from '@/components/layout/anilist/AnilistFIlter';
import MediaCard from '@/components/layout/anilist/MediaCard';
import TabNavigation from '@/components/ui/TabNavigation';
import { ANILIST_FAVOURITE_TAB, ANILIST_MEDIA_TAB } from '@/constants/client.constants';
import ICON_SET from '@/constants/icons';
import useFilteredData from '@/hooks/useFilteredData';
import usePagination from '@/hooks/usePagination';
import { AnilistFavourites, AnilistFavouritesTab, AnilistMediaFilters, AnilistMediaList, AnilistMediaTab } from '@/lib/types/anilist.types';

const ITEMS_PER_PAGE = 30;

const AnilistMain = ({ mediaLists, type }: { mediaLists: AnilistMediaList[] | AnilistFavourites; type: 'anime' | 'manga' | 'favourites' }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [selectedTab, setSelectedTab] = useState<AnilistFavouritesTab | AnilistMediaTab>('All');
    const [filterData, setFilterData] = useState<AnilistMediaFilters>({
        search: '',
        format: null,
        genres: null,
        year: null,
        status: null,
        sort: 'Last Updated',
    });

    const page = searchParams.has('page') ? parseInt(searchParams.get('page')!, 10) : 1;

    /** Memoized filters */
    const filters = useMemo(() => filterData, [filterData]);
    const filteredData = useFilteredData(mediaLists, filters, selectedTab);

    /** Updates URL search params */
    const updateSearchParams = useCallback(
        (key: string, value: string | number | null) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value !== null) {
                params.set(key, value.toString());
            } else {
                params.delete(key);
            }
            router.push(`${pathname}?${params.toString()}`);
        },
        [router, pathname, searchParams]
    );

    /** Handles tab change */
    const handleTabChange = useCallback(
        (tab: AnilistFavouritesTab | AnilistMediaTab) => {
            setSelectedTab(tab);
        },
        [setSelectedTab]
    );

    /** Handles pagination */
    const { currentData, Pagination } = usePagination(filteredData, ITEMS_PER_PAGE, {
        current: page,
        setCurrent: (newPage) => updateSearchParams('page', newPage),
    });

    return (
        <>
            {/* Header Section */}
            <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-highlight text-2xl font-bold capitalize sm:text-3xl">Your {type} List</h2>

                {/* Search Field */}
                <div className="form-field-wrapper hidden max-w-86 sm:flex">
                    <input
                        type="text"
                        name="search"
                        placeholder="Search..."
                        className="form-field"
                        value={filterData.search!}
                        onChange={(e) => {
                            setFilterData({ ...filterData, search: e.target.value });
                        }}
                    />
                    <Icon role="button" icon={ICON_SET.SEARCH} className="form-icon" />
                </div>

                {/* View Mode & Filter Buttons */}
                <div className="flex items-center justify-end pr-4">
                    {['list', 'card'].map((mode) => (
                        <button key={mode} className="text-text-primary button p-2 shadow-none">
                            <Icon icon={mode === 'list' ? ICON_SET.LIST : ICON_SET.CARD} className="size-4" />
                        </button>
                    ))}
                    <button onClick={() => openModal('anilist-filters-modal')} className="button text-highlight ml-4 size-8 rounded-xl p-2">
                        <Icon icon={ICON_SET.FILTER} className="size-full" />
                    </button>
                </div>
            </div>

            {/* Tabs Navigation */}
            <TabNavigation
                className="mb-6"
                tabs={type === 'favourites' ? ANILIST_FAVOURITE_TAB : ANILIST_MEDIA_TAB}
                currentTab={selectedTab}
                onTabChange={handleTabChange}
            />

            {/* Anime Cards Grid */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
                {currentData?.map((entry) => <MediaCard key={entry.id} media={entry} />)}
            </div>

            {/* Filters Modal */}
            <Modal modalId="anilist-filters-modal">
                <AnilistFilter filters={filters} setFilters={(updatedFilters) => setFilterData(updatedFilters)} />
            </Modal>

            {/* Pagination */}
            <Pagination className="mt-6" />
        </>
    );
};

export default AnilistMain;
