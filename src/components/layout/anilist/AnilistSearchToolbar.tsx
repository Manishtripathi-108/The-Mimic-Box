'use client';

import React, { useCallback, useEffect, useMemo, useState, useTransition } from 'react';

import Image from 'next/image';

import { searchAnilistMedia } from '@/actions/anilist.actions';
import Modal from '@/components/Modals';
import AnilistFilter from '@/components/layout/anilist/AnilistFIlter';
import AnilistMediaCard from '@/components/layout/anilist/AnilistMediaCard';
import AnilistToolbar from '@/components/layout/anilist/AnilistToolbar';
import { IMAGE_URL } from '@/constants/client.constants';
import { AnilistMedia, AnilistMediaFilters, AnilistMediaType, AnilistSearchCategories } from '@/lib/types/anilist.types';
import { getMediaSearchParams } from '@/lib/utils/core.utils';

const AnilistSearchToolbar = ({ type, category }: { type: AnilistMediaType; category?: AnilistSearchCategories }) => {
    const [isDetailedView, setIsDetailedView] = useState(false);
    const [mediaList, setMediaList] = useState<AnilistMedia[]>([]);
    const [filterData, setFilterData] = useState<AnilistMediaFilters>({
        season: 'ALL',
        sort: 'Last Updated',
    });
    const [isPending, startTransition] = useTransition();

    // Filter data
    const filters = useMemo(() => filterData, [filterData]);
    const categoryData = useMemo(() => getMediaSearchParams(type, category), [type, category]);

    const fetchMediaData = useCallback(() => {
        if (!(filters.search || category)) return;
        startTransition(async () => {
            console.warn('Fetching media data...');

            const response = await searchAnilistMedia({
                ...filters,
                perPage: 30,
                sort: undefined,
                ...categoryData,
            });
            console.log('Response:', response);

            if (response?.success && response.payload) {
                setMediaList(response.payload);
            } else {
                console.error('Error fetching media data:', response);
            }
        });
    }, [filters, categoryData]);

    useEffect(() => {
        fetchMediaData();
    }, [fetchMediaData]);

    return (
        <>
            {/* Header Section */}
            <AnilistToolbar
                text={category || 'Search'}
                search={filterData.search}
                setSearch={(data) =>
                    setFilterData((prev) => ({
                        ...prev,
                        search: data,
                    }))
                }
                detailedView={isDetailedView}
                setDetailedView={setIsDetailedView}
            />

            {/* Anime Cards Grid */}
            {(filters.search || category) &&
                (isPending ? (
                    <div className="grid gap-5 sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="bg-secondary aspect-5/7 animate-pulse rounded-lg"></div>
                        ))}
                    </div>
                ) : mediaList.length > 0 ? (
                    <div
                        className={`grid ${isDetailedView ? 'gap-5 sm:grid-cols-[repeat(auto-fill,minmax(310px,1fr))]' : 'grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3 md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]'}`}>
                        {mediaList.map((entry) => (
                            <AnilistMediaCard key={entry.id} detailed={isDetailedView} media={entry} />
                        ))}
                    </div>
                ) : (
                    <div className="from-secondary shadow-floating-xs to-tertiary grid place-items-center gap-5 rounded-xl bg-linear-150 from-15% to-85% p-6">
                        <Image src={IMAGE_URL.NO_DATA} alt="No media found" width={300} height={300} />
                        <h2 className="text-accent font-alegreya text-center text-xl tracking-wide">No {type} found, try changing your filters</h2>
                    </div>
                ))}

            {/* Filters Modal */}
            <Modal modalId="modal-anilist-filters">
                <AnilistFilter filters={filters} setFilters={setFilterData} />
            </Modal>
        </>
    );
};

export default AnilistSearchToolbar;
