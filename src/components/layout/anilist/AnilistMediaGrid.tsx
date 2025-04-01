'use client';

import React, { useCallback, useEffect, useMemo, useState, useTransition } from 'react';

import Link from 'next/link';

import { searchAnilistMedia } from '@/actions/anilist.actions';
import AnilistMediaCard from '@/components/layout/anilist/AnilistMediaCard';
import { APP_ROUTES } from '@/constants/routes.constants';
import { AnilistMedia, AnilistMediaType, AnilistQuery, AnilistSearchCategories } from '@/lib/types/anilist.types';
import { getCurrentSeason, getNextSeason } from '@/lib/utils/core.utils';

interface AnilistMediaGridProps {
    type: AnilistMediaType;
    category: AnilistSearchCategories;
    showDetails?: boolean;
    className?: string;
}

const getMediaSearchParams = (type: AnilistMediaType, category: AnilistSearchCategories): AnilistQuery => {
    const { season, year } = getNextSeason();
    switch (category) {
        case 'trending':
            return { type, season: 'ALL', sort: 'TRENDING_DESC' };
        case 'this-season':
            return { type, season: getCurrentSeason(), year: new Date().getFullYear(), sort: 'POPULARITY_DESC' };
        case 'popular':
            return { type, season: 'ALL', sort: 'POPULARITY_DESC' };
        case 'next-season':
            return { type, season, year };
        default:
            return { type, season: 'ALL', sort: 'POPULARITY_DESC' };
    }
};

const categoryTitle = (category: AnilistSearchCategories) => {
    switch (category) {
        case 'trending':
            return 'TRENDING NOW';
        case 'this-season':
            return 'POPULAR THIS SEASON';
        case 'popular':
            return 'ALL TIME POPULAR';
        default: // 'next-season':
            return 'UPCOMING';
    }
};

const AnilistMediaGrid: React.FC<AnilistMediaGridProps> = ({ type, category, showDetails, className }) => {
    const [mediaList, setMediaList] = useState<AnilistMedia[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const searchParams = useMemo(() => getMediaSearchParams(type, category), [type, category]);

    const fetchMediaData = useCallback(() => {
        startTransition(async () => {
            setError(null);
            const response = await searchAnilistMedia(searchParams);
            if (response?.success && response.payload) {
                setMediaList(response.payload);
            } else {
                setError(response?.message || 'Failed to fetch media data.');
            }
        });
    }, [searchParams]);

    useEffect(() => {
        fetchMediaData();
    }, [fetchMediaData]);

    return (
        <article className={className}>
            <div className="mb-2 flex items-center justify-between">
                <h1 className="text-highlight text-lg font-bold capitalize">{categoryTitle(category)}</h1>
                <Link
                    href={APP_ROUTES.ANILIST_SEARCH(type.toLowerCase() as 'anime' | 'manga', category)}
                    className="text-text-secondary hover:text-text-primary text-sm hover:underline">
                    View More
                </Link>
            </div>
            {error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <section
                    className={`mx-auto grid ${
                        showDetails
                            ? 'gap-5 sm:grid-cols-[repeat(auto-fill,minmax(310px,1fr))]'
                            : 'grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3 md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]'
                    }`}>
                    {isPending
                        ? Array.from({ length: 6 }).map((_, index) => (
                              <div key={index} className="bg-secondary aspect-5/7 animate-pulse rounded-lg"></div>
                          ))
                        : mediaList.map((entry) => <AnilistMediaCard key={entry.id} detailed={showDetails} media={entry} />)}
                </section>
            )}
        </article>
    );
};

export default AnilistMediaGrid;
