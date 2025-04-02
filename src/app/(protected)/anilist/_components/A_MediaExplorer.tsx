'use client';

import React, { useCallback, useEffect, useMemo, useState, useTransition } from 'react';

import Image from 'next/image';

import { searchAnilistMedia } from '@/actions/anilist.actions';
import AnilistFilterModal from '@/app/(protected)/anilist/_components/A_FilterModal';
import A_MediaCard from '@/app/(protected)/anilist/_components/A_MediaCard';
import A_Toolbar from '@/app/(protected)/anilist/_components/A_Toolbar';
import ErrorCard from '@/components/ErrorCard';
import { IMAGE_URL } from '@/constants/client.constants';
import { AnilistMedia, AnilistMediaFilters, AnilistMediaType, AnilistSearchCategories } from '@/lib/types/anilist.types';
import { categoryTitle, getMediaSearchParams } from '@/lib/utils/core.utils';

const A_MediaExplorer = ({ type, category }: { type: AnilistMediaType; category?: AnilistSearchCategories }) => {
    const [isDetailedView, setIsDetailedView] = useState(false);
    const [mediaList, setMediaList] = useState<AnilistMedia[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const categoryData = useMemo(() => getMediaSearchParams(type, category), [type, category]);

    const [filterData, setFilterData] = useState<AnilistMediaFilters>({
        season: categoryData.season,
        year: categoryData.year,
        sort: 'Last Updated',
    });

    const filters = useMemo(() => filterData, [filterData]);

    const fetchMediaData = useCallback(() => {
        if (!filters.search && !category) return;

        setError(null);
        startTransition(async () => {
            const response = await searchAnilistMedia({
                ...filters,
                perPage: 30,
                sort: categoryData.sort,
                type: categoryData.type,
                season: filters.season === 'ALL' ? categoryData.season : filters.season,
                year: filters.year || categoryData.year,
            });

            if (response?.success && response.payload) {
                setMediaList(response.payload);
            } else {
                setError(response?.message || 'An unexpected error occurred');
                setMediaList([]);
            }
        });
    }, [filters, categoryData, category]);

    useEffect(() => {
        fetchMediaData();
    }, [fetchMediaData]);

    return (
        <>
            {/* Toolbar Section */}
            <A_Toolbar
                text={categoryTitle(category) || 'Search'}
                search={filterData.search}
                setSearch={(search) => setFilterData((prev) => ({ ...prev, search }))}
                detailedView={isDetailedView}
                setDetailedView={setIsDetailedView}
            />

            {/* Data Handling */}
            {filters.search || category ? (
                <>
                    {isPending ? (
                        <div className="grid gap-5 sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
                            {Array.from({ length: 20 }).map((_, index) => (
                                <div key={index} className="bg-secondary aspect-5/7 animate-pulse rounded-lg"></div>
                            ))}
                        </div>
                    ) : error ? (
                        <ErrorCard message={error} reset={fetchMediaData} />
                    ) : mediaList.length > 0 ? (
                        <div
                            className={`grid ${
                                isDetailedView
                                    ? 'gap-5 sm:grid-cols-[repeat(auto-fill,minmax(310px,1fr))]'
                                    : 'grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3 md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]'
                            }`}>
                            {mediaList.map((entry) => (
                                <A_MediaCard key={entry.id} detailed={isDetailedView} media={entry} />
                            ))}
                        </div>
                    ) : (
                        /* No Data State */
                        <div className="from-secondary shadow-floating-xs to-tertiary grid place-items-center gap-5 rounded-xl bg-linear-150 from-15% to-85% p-6">
                            <Image src={IMAGE_URL.NO_DATA} alt="No media found" width={300} height={300} />
                            <h2 className="text-accent font-alegreya text-center text-xl tracking-wide">
                                No {type} found, try changing your filters
                            </h2>
                        </div>
                    )}
                </>
            ) : null}

            {/* Filters Modal */}
            <AnilistFilterModal filters={filters} setFilters={setFilterData} />
        </>
    );
};

export default A_MediaExplorer;
