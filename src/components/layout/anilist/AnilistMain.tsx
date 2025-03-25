'use client';

import React, { useCallback, useMemo, useState } from 'react';

import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Icon } from '@iconify/react';

import Modal, { openModal } from '@/components/Modals';
import AnilistEditMedia from '@/components/layout/anilist/AnilistEditMedia';
import AnilistFilter from '@/components/layout/anilist/AnilistFIlter';
import AnilistMediaCard from '@/components/layout/anilist/AnilistMediaCard';
import TabNavigation from '@/components/ui/TabNavigation';
import { ANILIST_FAVOURITE_TAB, ANILIST_MEDIA_TAB, IMAGE_URL } from '@/constants/client.constants';
import ICON_SET from '@/constants/icons';
import useAnilistFilteredData from '@/hooks/useAnilistFilteredData';
import usePagination from '@/hooks/usePagination';
import {
    AnilistFavourites,
    AnilistFavouritesTab,
    AnilistMedia,
    AnilistMediaEntry,
    AnilistMediaFilters,
    AnilistMediaList,
    AnilistMediaTab,
} from '@/lib/types/anilist.types';

const ITEMS_PER_PAGE = 30;

const AnilistMain = ({
    mediaLists,
    type,
    token,
}: {
    mediaLists: AnilistMediaList[] | AnilistFavourites;
    type: 'anime' | 'manga' | 'favourites';
    token: string;
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [editEntry, setEditEntry] = useState<AnilistMediaEntry | null>(null);
    const [selectedTab, setSelectedTab] = useState<AnilistFavouritesTab | AnilistMediaTab>('All');
    const [detailedView, setDetailedView] = useState(false);
    const [filterData, setFilterData] = useState<AnilistMediaFilters>({
        search: '',
        format: null,
        genres: null,
        year: null,
        status: null,
        sort: 'Last Updated',
    });

    const page = searchParams.has('page') ? parseInt(searchParams.get('page')!, 10) : 1;

    // Filter data
    const filters = useMemo(() => filterData, [filterData]);
    const filteredData = useAnilistFilteredData(mediaLists, filters, selectedTab);

    // Handles pagination
    const { currentData, Pagination } = usePagination(filteredData, ITEMS_PER_PAGE, {
        current: page,
        setCurrent: (newPage) => updateSearchParams('page', newPage),
    });

    // Update search params
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

    // Handles tab change
    const handleTabChange = useCallback(
        (tab: AnilistFavouritesTab | AnilistMediaTab) => {
            setSelectedTab(tab);
        },
        [setSelectedTab]
    );

    // Handles edit button click
    const handleEdit = useCallback(
        (media: AnilistMedia) => {
            if (!Array.isArray(mediaLists)) return;

            const entry = mediaLists.flatMap((list) => list.entries).find((entry) => entry.media?.id === media.id) || null;

            setEditEntry(entry);
            openModal('modal-anilist-edit-media');
        },
        [mediaLists] // Dependencies: function will only re-create if `mediaLists` changes
    );

    return (
        <>
            {/* Header Section */}
            <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-highlight text-2xl font-bold capitalize sm:text-3xl">Your {type} List</h2>

                {/* Search Field */}
                <div className="form-field-wrapper bg-secondary hidden max-w-86 sm:flex">
                    <input
                        type="text"
                        name="search"
                        placeholder="Search..."
                        className="form-field bg-inherit"
                        value={filterData.search!}
                        onChange={(e) => {
                            setFilterData({ ...filterData, search: e.target.value });
                        }}
                    />
                    <Icon role="button" icon={ICON_SET.SEARCH} className="form-icon" />
                </div>

                {/* View Mode & Filter Buttons */}
                <div className="flex items-center justify-end pr-4">
                    <span className="flex w-fit items-center justify-center rounded-full border">
                        {['detailed list', 'card'].map((mode) => (
                            <button
                                onClick={() => setDetailedView(mode === 'detailed list')}
                                key={mode}
                                className={`button p-2 shadow-none ${mode === 'detailed list' ? 'rounded-l-full' : 'rounded-r-full'} ${detailedView === (mode === 'detailed list') ? 'active' : ''}`}
                                title={`View as ${mode}`}
                                aria-label={`View as ${mode}`}>
                                <Icon icon={mode === 'detailed list' ? ICON_SET.LIST : ICON_SET.CARD} className="size-4" />
                            </button>
                        ))}
                    </span>
                    <button
                        title="Filter"
                        onClick={() => openModal('anilist-filters-modal')}
                        className="button text-highlight ml-4 size-8 rounded-xl p-2">
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
            {currentData.length > 0 ? (
                <div
                    className={`grid ${detailedView ? 'gap-5 sm:grid-cols-[repeat(auto-fill,minmax(380px,1fr))]' : 'grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3'}`}>
                    {currentData?.map((entry) => (
                        <AnilistMediaCard key={entry.id} detailed={detailedView} onEdit={type !== 'favourites' ? handleEdit : null} media={entry} />
                    ))}
                </div>
            ) : (
                <div className="from-secondary shadow-floating-xs to-tertiary grid place-items-center gap-5 rounded-xl bg-linear-150 from-15% to-85% p-6">
                    <Image src={IMAGE_URL.NO_DATA} alt="No media found" width={300} height={300} />
                    <h2 className="text-accent font-alegreya text-center text-xl tracking-wide">No {type} found, try changing your filters</h2>
                </div>
            )}

            {/* Pagination */}
            <Pagination className="mt-6" />

            {/* Filters Modal */}
            <Modal modalId="anilist-filters-modal">
                <AnilistFilter filters={filters} setFilters={(updatedFilters) => setFilterData(updatedFilters)} />
            </Modal>

            {/* Edit Modal */}
            {type !== 'favourites' && (
                <Modal modalId="modal-anilist-edit-media" onClose={() => setEditEntry(null)}>
                    {editEntry ? (
                        <AnilistEditMedia token={token} entry={editEntry} />
                    ) : (
                        <div className="grid place-items-center gap-5 text-red-500">
                            <Icon icon={ICON_SET.ERROR} className="size-20" />
                            <h2 className="text-xl">Please select a media to edit</h2>
                        </div>
                    )}
                </Modal>
            )}
        </>
    );
};

export default AnilistMain;
