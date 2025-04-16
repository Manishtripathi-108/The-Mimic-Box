'use client';

import React, { useCallback, useMemo, useState } from 'react';

import A_EditMedia from '@/app/(protected)/anilist/_components/A_EditMedia';
import AnilistFilterModal from '@/app/(protected)/anilist/_components/A_FilterModal';
import A_MediaCard from '@/app/(protected)/anilist/_components/A_MediaCard';
import A_Toolbar from '@/app/(protected)/anilist/_components/A_Toolbar';
import { NoDataCard } from '@/components/layout/NoDataCard';
import Modal, { openModal } from '@/components/ui/Modals';
import TabNavigation from '@/components/ui/TabNavigation';
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

const A_Main: React.FC<AnilistMainProps> = ({ mediaLists, type, token }) => {
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

    return (
        <main className="container mx-auto p-2 sm:p-6">
            {/* Header */}
            <A_Toolbar
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
                    <p className="text-text-secondary mb-1 flex justify-end">{`Page ${currentPage} of ${totalPages}`}</p>
                    <div
                        className={`grid gap-2 sm:gap-4 ${isDetailedView ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'}`}>
                        {currentData.map((entry) => (
                            <A_MediaCard
                                key={entry.id}
                                detailed={isDetailedView}
                                onEdit={type !== 'favourites' ? handleMediaEdit : null}
                                media={entry}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <NoDataCard message={`No ${type} found, try changing your filters!`} />
            )}

            {/* Pagination */}
            <Pagination className="mt-6" />

            {/* Filters Modal */}
            <AnilistFilterModal
                filters={filters}
                setFilters={(filters) => {
                    setCurrentPage(1);
                    setFilterData(filters);
                }}
            />

            {/* Edit Modal */}
            {type !== 'favourites' && (
                <Modal modalId="modal-anilist-edit-media" onClose={() => setSelectedMediaEntry(null)}>
                    {selectedMediaEntry ? <A_EditMedia token={token} entry={selectedMediaEntry} /> : null}
                </Modal>
            )}
        </main>
    );
};

export default A_Main;
