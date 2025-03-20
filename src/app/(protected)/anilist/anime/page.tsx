'use client';

import React, { useCallback, useMemo } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Icon } from '@iconify/react';

import Modal, { openModal } from '@/components/Modals';
import AnilistFilter from '@/components/layout/anilist/AnilistFIlter';
import MediaCard from '@/components/layout/anilist/MediaCard';
import TabNavigation from '@/components/ui/TabNavigation';
import { getTabOptions } from '@/constants/client.constants';
import { animeData } from '@/constants/data';
import ICON_SET from '@/constants/icons';

const AnilistAnime: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    /** Extracting query parameters with default values */
    const selectedTab = searchParams.get('tab') || 'All';
    const format = searchParams.get('format') || null;
    const genres = searchParams.getAll('genres');
    const year = parseInt(searchParams.get('year')!, 10) || null;
    const status = searchParams.get('status') || null;
    const sort = searchParams.get('sort') || 'Last Added';
    const page = searchParams.has('page') ? parseInt(searchParams.get('page')!, 10) : 1;

    /** Filters state */
    const filters = useMemo(() => ({ format, genres, year, status, sort }), [format, genres, year, status, sort]);

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
                <h2 className="text-highlight text-2xl font-bold capitalize sm:text-3xl">Your Anime List</h2>

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
            <TabNavigation className="mb-6" tabs={getTabOptions('anime')} currentTab={selectedTab} onTabChange={handleTabChange} />

            {/* Anime Cards Grid */}
            {/* <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
                {animeData?.map((entry) => <MediaCard key={entry.id} mediaItem={entry} isFavouriteList={false} />)}
            </div> */}

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

export default AnilistAnime;
