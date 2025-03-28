'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { searchAnilistMedia } from '@/actions/anilist.actions';
import AnilistMediaCard from '@/components/layout/anilist/AnilistMediaCard';
import { AnilistMedia, AnilistMediaType, AnilistQuery } from '@/lib/types/anilist.types';
import { getNextSeason } from '@/lib/utils/core.utils';

interface AnilistMediaGridProps {
    type: AnilistMediaType;
    category: 'Upcoming' | 'Trending Now' | 'Popular This Season' | 'All Time Popular';
    showDetails: boolean;
    className?: string;
}

// Utility function to determine search properties based on category
const getMediaSearchParams = (type: AnilistMediaType, category: AnilistMediaGridProps['category']): AnilistQuery => {
    const { season, year } = getNextSeason();

    switch (category) {
        case 'Trending Now':
            return { type, sort: 'TRENDING_DESC' };
        case 'Popular This Season':
            return { type, season, seasonYear: new Date().getFullYear(), sort: 'POPULARITY_DESC' };
        case 'All Time Popular':
            return { type, sort: 'POPULARITY_DESC' };
        default: // 'Upcoming'
            return { type, season, seasonYear: year };
    }
};

const AnilistMediaGrid: React.FC<AnilistMediaGridProps> = ({ type, category, showDetails, className }) => {
    const [mediaList, setMediaList] = useState<AnilistMedia[]>([]);
    const searchParams = useMemo(() => getMediaSearchParams(type, category), [type, category]);

    const fetchMediaData = useCallback(async () => {
        const response = await searchAnilistMedia(searchParams);
        if (response?.success && response.payload) setMediaList(response.payload);
    }, [searchParams]);

    useEffect(() => {
        fetchMediaData();
    }, [fetchMediaData]);

    return (
        <article className={className}>
            <h1 className="text-highlight mb-2 text-2xl font-bold capitalize sm:text-3xl">{category}</h1>
            <section
                className={`mx-auto grid ${
                    showDetails ? 'gap-5 sm:grid-cols-[repeat(auto-fill,minmax(380px,1fr))]' : 'grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3'
                }`}>
                {mediaList.map((entry) => (
                    <AnilistMediaCard key={entry.id} detailed={showDetails} media={entry} />
                ))}
            </section>
        </article>
    );
};

export default AnilistMediaGrid;
