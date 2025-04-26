'use client';

import React, { useCallback, useEffect, useMemo, useState, useTransition } from 'react';

import { getFilteredMediaList } from '@/actions/anilist.actions';
import AnilistFilterModal from '@/app/(protected)/anilist/_components/A_FilterModal';
import A_MediaCard from '@/app/(protected)/anilist/_components/A_MediaCard';
import A_Toolbar from '@/app/(protected)/anilist/_components/A_Toolbar';
import ErrorCard from '@/components/layout/ErrorCard';
import { NoDataCard } from '@/components/layout/NoDataCard';
import Pagination from '@/components/ui/Pagination';
import { AnilistMedia, AnilistMediaFilters, AnilistMediaType, AnilistPageInfo, AnilistSearchCategories } from '@/lib/types/anilist.types';
import { buildMediaSearchParams, getCategoryDisplayTitle } from '@/lib/utils/core.utils';

const INITIAL_PAGE_INFO: AnilistPageInfo = {
    total: 0,
    currentPage: 1,
    lastPage: 1,
    hasNextPage: false,
    perPage: 30,
};

const A_MediaExplorer = ({ type, category }: { type: AnilistMediaType; category?: AnilistSearchCategories }) => {
    const [mediaList, setMediaList] = useState<AnilistMedia[]>([]);
    const [filters, setFilters] = useState<AnilistMediaFilters>({ season: 'ALL', sort: 'Last Updated' });
    const [pageInfo, setPageInfo] = useState<AnilistPageInfo>(INITIAL_PAGE_INFO);
    const [error, setError] = useState<string | null>(null);
    const [detailedView, setDetailedView] = useState(false);
    const [isPending, startTransition] = useTransition();

    const searchParams = useMemo(() => buildMediaSearchParams(type, category), [type, category]);

    const appliedFilters = useMemo(
        () => ({
            ...filters,
            type: searchParams.type,
            sort: searchParams.sort,
            season: filters.season === 'ALL' ? searchParams.season : filters.season,
            year: filters.year || searchParams.year,
        }),
        [filters, searchParams]
    );

    const fetchMedia = useCallback(
        (page = 1) => {
            if (!filters.search && !category) return;

            setError(null);
            startTransition(async () => {
                const response = await getFilteredMediaList({
                    ...appliedFilters,
                    perPage: pageInfo.perPage,
                    page,
                });

                if (response?.success && response.payload) {
                    setMediaList(response.payload.media);
                    setPageInfo(response.payload.pageInfo);
                } else {
                    setError(response?.message || 'An unexpected error occurred.');
                    setMediaList([]);
                }
            });
        },
        [appliedFilters, filters.search, category, pageInfo.perPage]
    );

    useEffect(() => {
        fetchMedia(1);
    }, [fetchMedia]);

    const handlePageChange = (page: number) => {
        if (page !== pageInfo.currentPage) {
            window.scrollTo({ top: 0, behavior: 'instant' });
            fetchMedia(page);
        }
    };

    const renderLoadingSkeletons = () => (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 20 }).map((_, index) => (
                <div key={index} className="bg-secondary aspect-5/7 animate-pulse rounded-lg" />
            ))}
        </div>
    );

    const renderMediaGrid = () => (
        <div className={`grid gap-4 ${detailedView ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'}`}>
            {mediaList.map((media) => (
                <A_MediaCard key={media.id} media={media} detailed={detailedView} />
            ))}
        </div>
    );

    return (
        <>
            {/* Toolbar */}
            <A_Toolbar
                text={getCategoryDisplayTitle(category) || 'Search'}
                search={filters.search}
                setSearch={(search) => setFilters((prev) => ({ ...prev, search }))}
                detailedView={detailedView}
                setDetailedView={setDetailedView}
            />

            {/* Result Area */}
            {filters.search || category ? (
                <>
                    {isPending ? (
                        renderLoadingSkeletons()
                    ) : error ? (
                        <ErrorCard message={error} reset={() => fetchMedia(pageInfo.currentPage)} />
                    ) : mediaList.length ? (
                        <>
                            {renderMediaGrid()}
                            <Pagination
                                currentPage={pageInfo.currentPage}
                                totalPages={pageInfo.lastPage}
                                onPageChange={handlePageChange}
                                className="mt-4"
                            />
                        </>
                    ) : (
                        <NoDataCard message={`No ${type} found, try changing your filters!`} />
                    )}
                </>
            ) : null}

            {/* Filter Modal */}
            <AnilistFilterModal filters={filters} setFilters={setFilters} />
        </>
    );
};

export default A_MediaExplorer;
