'use client';

import React, { useCallback, useEffect, useMemo, useState, useTransition } from 'react';

import Link from 'next/link';

import { getFilteredMediaList } from '@/actions/anilist.actions';
import A_MediaCard from '@/app/(protected)/anilist/_components/A_MediaCard';
import APP_ROUTES from '@/constants/routes/app.routes';
import { AnilistMedia, AnilistMediaType, AnilistSearchCategories } from '@/lib/types/anilist.types';
import { buildMediaSearchParams, getCategoryDisplayTitle } from '@/lib/utils/core.utils';

interface AnilistMediaGridProps {
    type: AnilistMediaType;
    category: AnilistSearchCategories;
    showDetails?: boolean;
    className?: string;
}

const A_MediaGrid: React.FC<AnilistMediaGridProps> = ({ type, category, showDetails, className }) => {
    const [mediaList, setMediaList] = useState<AnilistMedia[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const searchParams = useMemo(() => buildMediaSearchParams(type, category), [type, category]);

    const fetchMediaData = useCallback(() => {
        startTransition(async () => {
            setError(null);
            const response = await getFilteredMediaList(searchParams);
            if (response?.success && response.payload) {
                setMediaList(response.payload.media);
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
                <h1 className="text-highlight text-lg font-bold capitalize">{getCategoryDisplayTitle(category)}</h1>
                <Link
                    href={APP_ROUTES.ANILIST.SEARCH(type.toLowerCase() as 'anime' | 'manga', category)}
                    className="text-text-secondary hover:text-text-primary text-sm hover:underline">
                    View More
                </Link>
            </div>
            {error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <section
                    className={`mx-auto grid gap-4 ${showDetails ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'} `}>
                    {isPending
                        ? Array.from({ length: 6 }).map((_, index) => (
                              <div key={index} className="bg-secondary aspect-5/7 animate-pulse rounded-lg"></div>
                          ))
                        : mediaList.map((entry) => <A_MediaCard key={entry.id} detailed={showDetails} media={entry} />)}
                </section>
            )}
        </article>
    );
};

export default A_MediaGrid;
