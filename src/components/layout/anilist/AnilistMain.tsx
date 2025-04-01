'use client';

import React, { useCallback, useMemo, useState } from 'react';

import Image from 'next/image';

import { Icon } from '@iconify/react';

import Modal, { openModal } from '@/components/Modals';
import AnilistEditMedia from '@/components/layout/anilist/AnilistEditMedia';
import AnilistFilter from '@/components/layout/anilist/AnilistFilter';
import AnilistMediaCard from '@/components/layout/anilist/AnilistMediaCard';
import AnilistToolbar from '@/components/layout/anilist/AnilistToolbar';
import TabNavigation from '@/components/ui/TabNavigation';
import { IMAGE_URL } from '@/constants/client.constants';
import ICON_SET from '@/constants/icons';
import useAnilistFilteredData from '@/hooks/useAnilistFilteredData';
import usePagination from '@/hooks/usePagination';
import { AnilistMediaListStatusSchema } from '@/lib/schema/client.validations';
import {
    AnilistFavourites,
    AnilistMedia,
    AnilistMediaEntry,
    AnilistMediaFilters,
    AnilistMediaList,
    AnilistSelectedTabType,
} from '@/lib/types/anilist.types';

// Constants
const ITEMS_PER_PAGE = 30;
const MEDIA_TABS = ['all', ...AnilistMediaListStatusSchema.options.map((status) => status.toLowerCase())];
const FAVOURITE_TABS = ['all', 'anime', 'manga'];

type AnilistMainProps = {
    mediaLists: AnilistMediaList[] | AnilistFavourites;
    type: 'anime' | 'manga' | 'favourites';
    token: string;
};

const AnilistMain: React.FC<AnilistMainProps> = ({ mediaLists, type, token }) => {
    const [selectedMediaEntry, setSelectedMediaEntry] = useState<AnilistMediaEntry | null>(null);
    const [selectedTab, setSelectedTab] = useState<AnilistSelectedTabType>('ALL');
    const [isDetailedView, setIsDetailedView] = useState(false);
    const [filterData, setFilterData] = useState<AnilistMediaFilters>({ season: 'ALL', sort: 'Last Updated' });

    // Filter data
    const filters = useMemo(() => filterData, [filterData]);
    const filteredData = useAnilistFilteredData(mediaLists, filters, selectedTab);

    // Pagination logic
    const { currentData, Pagination, currentPage, totalPages, setCurrentPage } = usePagination(filteredData, ITEMS_PER_PAGE, { scrollToTop: true });

    // Tab change handler
    const handleTabChange = useCallback(
        (tab: string) => {
            setCurrentPage(1);
            setSelectedTab(tab.toUpperCase() as AnilistSelectedTabType);
        },
        [setCurrentPage]
    );

    // Edit media handler
    const handleMediaEdit = useCallback(
        (media: AnilistMedia) => {
            if (!Array.isArray(mediaLists)) return;
            const entry = mediaLists.flatMap((list) => list.entries).find((entry) => entry.media?.id === media.id) || null;
            setSelectedMediaEntry(entry);
            openModal('modal-anilist-edit-media');
        },
        [mediaLists]
    );

    // Empty state component
    const EmptyState = () => (
        <div className="from-secondary shadow-floating-xs to-tertiary grid place-items-center gap-5 rounded-xl bg-linear-150 from-15% to-85% p-6">
            <Image src={IMAGE_URL.NO_DATA} alt="No media found" width={300} height={300} />
            <h2 className="text-accent font-alegreya text-center text-xl tracking-wide">No {type} found, try changing your filters</h2>
        </div>
    );

    return (
        <main className="container mx-auto p-2 sm:p-6">
            {/* Header */}
            <AnilistToolbar
                text={`Your ${type} List`}
                search={filters.search}
                setSearch={(search) => {
                    setCurrentPage(1);
                    setFilterData({ ...filters, search });
                }}
                detailedView={isDetailedView}
                setDetailedView={setIsDetailedView}
            />

            {/* Tabs */}
            <TabNavigation
                className="mb-6"
                buttonClassName="capitalize"
                tabs={type === 'favourites' ? FAVOURITE_TABS : MEDIA_TABS}
                currentTab={selectedTab.toLowerCase()}
                onTabChange={handleTabChange}
            />

            {/* Media Grid */}
            {currentData.length > 0 ? (
                <div className="w-full">
                    <p className="text-left">{`Page ${currentPage} of ${totalPages}`}</p>
                    <div
                        className={`grid ${
                            isDetailedView
                                ? 'gap-5 sm:grid-cols-[repeat(auto-fill,minmax(310px,1fr))]'
                                : 'grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3 md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]'
                        }`}>
                        {currentData.map((entry) => (
                            <AnilistMediaCard
                                key={entry.id}
                                detailed={isDetailedView}
                                onEdit={type !== 'favourites' ? handleMediaEdit : null}
                                media={entry}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <EmptyState />
            )}

            {/* Pagination */}
            <Pagination className="mt-6" />

            {/* Filters Modal */}
            <Modal modalId="modal-anilist-filters">
                <AnilistFilter
                    filters={filters}
                    setFilters={(filters) => {
                        setCurrentPage(1);
                        setFilterData(filters);
                    }}
                />
            </Modal>

            {/* Edit Modal */}
            {type !== 'favourites' && (
                <Modal modalId="modal-anilist-edit-media" onClose={() => setSelectedMediaEntry(null)}>
                    {selectedMediaEntry ? (
                        <AnilistEditMedia token={token} entry={selectedMediaEntry} />
                    ) : (
                        <div className="grid place-items-center gap-5 text-red-500">
                            <Icon icon={ICON_SET.ERROR} className="size-20" />
                            <h2 className="text-xl">Please select a media to edit</h2>
                        </div>
                    )}
                </Modal>
            )}
        </main>
    );
};

export default AnilistMain;
