import { useDeferredValue, useMemo } from 'react';

import { AnilistFavorites, AnilistMediaCollection, AnilistMediaListStatus } from '@/lib/types/anilist.types';

const useFilteredData = (
    lists: AnilistMediaCollection['MediaListCollection']['lists'] | AnilistFavorites['User']['favourites'],
    filters: {
        search?: string | null;
        format?: string | null;
        genres?: string[];
        year?: number | null;
        status?: string | null;
        sort?: string;
    } = {},
    selectedList: AnilistMediaListStatus | 'All' | 'Anime' | 'Manga' = 'All'
) => {
    const deferredSearchTerm = useDeferredValue(filters.search);
    const isFavourite = !Array.isArray(lists);
    console.log(lists);

    const filteredData = useMemo(() => {
        if (!lists || (Array.isArray(lists) && lists.length === 0)) return [];

        // Step 0: Get all entries
        let result = isFavourite ? Object.values(lists).flatMap((fav) => fav?.nodes || []) : lists.flatMap((list) => list.entries || []);

        // Step 1: Filter by selected list
        if (selectedList !== 'All') {
            const status = selectedList.toLowerCase();

            if (isFavourite) {
                result = status === 'anime' || status === 'manga' ? lists[status]?.nodes || [] : [];
            } else {
                result =
                    status !== 'anime' && status !== 'manga'
                        ? lists.filter((list) => list.status === selectedList).flatMap((list) => list.entries || []) || []
                        : [];
            }
        }

        // Step 2: Apply deferred search term filter
        if (deferredSearchTerm) {
            const searchTerm = deferredSearchTerm.toLowerCase();

            result = result.filter((entry) => {
                const titleObject = 'media' in entry ? entry.media?.title : entry.title;

                if (!titleObject) return false;

                const { english, romaji, native, userPreferred } = titleObject;
                return (
                    english?.toLowerCase().includes(searchTerm) ||
                    romaji?.toLowerCase().includes(searchTerm) ||
                    native?.toLowerCase().includes(searchTerm) ||
                    userPreferred?.toLowerCase().includes(searchTerm)
                );
            }) as typeof result;
        }

        // Step 3: Apply additional filters
        result = result.filter((entry) => {
            const data = 'media' in entry ? entry.media : entry;
            if (!data) return false;

            const { format, status, genres, startDate } = data;
            const matchFormat = filters.format ? format?.toUpperCase() === filters.format.toUpperCase() : true;
            const matchStatus = filters.status ? status?.toUpperCase() === filters.status.toUpperCase() : true;
            const matchGenres = filters.genres
                ? filters.genres.every((genre) => genres?.map((g) => g.toUpperCase()).includes(genre.toUpperCase()))
                : true;
            const matchYear = filters.year ? startDate?.year === filters.year : true;

            return matchFormat && matchStatus && matchGenres && matchYear;
        }) as typeof result;

        // Step 4: Apply sorting
        if (filters.sort) {
            result.sort((a, b) => {
                // Check if `media` exists in `a` and `b`
                const hasMediaA = 'media' in a;
                const hasMediaB = 'media' in b;

                // Extract titles correctly
                const titleA = hasMediaA ? a.media.title : a.title || {};
                const titleB = hasMediaB ? b.media.title : b.title || {};

                switch (filters.sort) {
                    case 'Title':
                        return (
                            (titleA.english ?? '').localeCompare(titleB.english ?? '') ||
                            (titleA.romaji ?? '').localeCompare(titleB.romaji ?? '') ||
                            (titleA.native ?? '').localeCompare(titleB.native ?? '') ||
                            (titleA.userPreferred ?? '').localeCompare(titleB.userPreferred ?? '')
                        );

                    case 'Year':
                        return (
                            (hasMediaA ? (a.media?.startDate?.year ?? 0) : (a.startDate?.year ?? 0)) -
                            (hasMediaB ? (b.media?.startDate?.year ?? 0) : (b.startDate?.year ?? 0))
                        );

                    case 'Average Score':
                        return (hasMediaB ? (b.media?.averageScore ?? 0) : 0) - (hasMediaA ? (a.media?.averageScore ?? 0) : 0);

                    case 'Popularity':
                        return (hasMediaB ? (b.media?.popularity ?? 0) : 0) - (hasMediaA ? (a.media?.popularity ?? 0) : 0);

                    case 'Progress':
                        return (hasMediaB ? (b.progress ?? 0) : 0) - (hasMediaA ? (a.progress ?? 0) : 0);

                    case 'Last Updated':
                        return (hasMediaB ? (b.updatedAt ?? 0) : 0) - (hasMediaA ? (a.updatedAt ?? 0) : 0);

                    case 'Last Added':
                    default:
                        return (hasMediaB ? (b.createdAt ?? 0) : 0) - (hasMediaA ? (a.createdAt ?? 0) : 0);
                }
            });
        }

        return result;
    }, [lists, filters, selectedList, deferredSearchTerm, isFavourite]);

    console.log('Filtered data:', filteredData);

    return filteredData;
};

export default useFilteredData;
