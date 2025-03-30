'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import Image from 'next/image';

import { searchAnilistMedia } from '@/actions/anilist.actions';
import Modal from '@/components/Modals';
import AnilistFilter from '@/components/layout/anilist/AnilistFIlter';
import AnilistMediaCard from '@/components/layout/anilist/AnilistMediaCard';
import AnilistToolbar from '@/components/layout/anilist/AnilistToolbar';
import { IMAGE_URL } from '@/constants/client.constants';
import { AnilistMedia, AnilistMediaFilters, AnilistMediaType } from '@/lib/types/anilist.types';

const AnilistSearchToolbar = ({ type }: { type: AnilistMediaType }) => {
    const [isDetailedView, setIsDetailedView] = useState(false);
    const [mediaList, setMediaList] = useState<AnilistMedia[]>([]);
    const [filterData, setFilterData] = useState<AnilistMediaFilters>({
        season: 'ALL',
        sort: 'Last Updated',
        genres: [],
    });

    // Filter data
    const filters = useMemo(() => filterData, [filterData]);
    const fetchMediaData = useCallback(async () => {
        const response = await searchAnilistMedia({
            ...filters,
            type,
            perPage: 30,
            sort: undefined,
        });
        if (response?.success && response.payload) setMediaList(response.payload);
    }, [filters, type]);

    useEffect(() => {
        fetchMediaData();
    }, [fetchMediaData]);

    return (
        <>
            {/* Header Section */}
            <AnilistToolbar
                text="Search"
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
            {filters.search &&
                (mediaList.length > 0 ? (
                    <div
                        className={`grid ${isDetailedView ? 'gap-5 sm:grid-cols-[repeat(auto-fill,minmax(380px,1fr))]' : 'grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]'}`}>
                        {mediaList?.map((entry) => <AnilistMediaCard key={entry.id} detailed={isDetailedView} media={entry} />)}
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
