'use client';

import React from 'react';

import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { closeModal } from '@/components/Modals';
import TabNavigation from '@/components/ui/TabNavigation';
import { ANILIST_GENRES, ANILIST_MEDIA_FORMATS, ANILIST_MEDIA_STATUSES, ANILIST_SORT_OPTIONS } from '@/constants/client.constants';
import { AnilistFilterSchema } from '@/lib/schema/client.validations';
import { AnilistMediaFilters } from '@/lib/types/anilist.types';

type FilterValues = z.infer<typeof AnilistFilterSchema>;

const AnilistFilter = ({ filters, setFilters }: { filters: AnilistMediaFilters; setFilters: (filters: AnilistMediaFilters) => void }) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FilterValues>({
        defaultValues: filters as FilterValues,
        resolver: zodResolver(AnilistFilterSchema),
    });

    const onSubmit = (values: FilterValues) => {
        closeModal('anilist-filters-modal');
        setFilters(values as AnilistMediaFilters);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-lg bg-inherit p-6 shadow-lg">
            {/* Search */}
            <div className="form-group">
                <label htmlFor="filter-search" className="form-text font-alegreya text-base">
                    Search:
                </label>
                <input {...register('search')} type="text" id="filter-search" className="form-field" placeholder="Search for media" />
                <ErrorMessage errors={errors} name="search" as="p" className="text-sm text-red-500" />
            </div>

            {/* Format */}
            <div className="form-group relative">
                <p className="form-text text-text-primary font-alegreya text-base">Format:</p>
                <TabNavigation
                    tabs={ANILIST_MEDIA_FORMATS}
                    currentTab={watch('format')}
                    className="w-full text-nowrap"
                    buttonClassName="capitalize p-2 text-sm"
                    onTabChange={(format) => setValue('format', format)}
                />
                <button
                    type="button"
                    className="text-text-secondary hover:text-text-primary absolute -top-2 right-4 cursor-pointer text-2xl"
                    onClick={() => setValue('format', null)}
                    title="Clear">
                    x
                </button>
            </div>

            {/* Genres */}
            <div>
                <p className="form-text text-text-primary font-alegreya text-base">Genres:</p>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {ANILIST_GENRES.map((genre) => (
                        <label key={genre} className="form-checkbox flex items-center">
                            <input type="checkbox" {...register('genres')} id={genre} value={genre} className="checkbox-field" />
                            <span className="form-text">{genre}</span>
                        </label>
                    ))}
                </div>
                <ErrorMessage errors={errors} name="genres" as="p" className="text-sm text-red-500" />
            </div>

            {/* Status */}
            <div className="form-group relative">
                <p className="form-text text-text-primary font-alegreya text-base">Status:</p>
                <TabNavigation
                    tabs={ANILIST_MEDIA_STATUSES}
                    currentTab={watch('status')}
                    className="w-full text-nowrap"
                    buttonClassName="capitalize p-2 text-sm"
                    onTabChange={(status) => setValue('status', status)}
                />
                <button
                    type="button"
                    className="text-text-secondary hover:text-text-primary absolute -top-2 right-4 cursor-pointer text-2xl"
                    onClick={() => setValue('status', null)}
                    title="Clear">
                    x
                </button>
            </div>

            {/* Sort & Year */}
            <div className="flex gap-4">
                <div className="form-group">
                    <label htmlFor="filter-sort" className="form-text font-alegreya text-base">
                        Sort By:
                    </label>
                    <select {...register('sort')} id="filter-sort" className="form-field">
                        <option value="Last Added">Default</option>
                        {ANILIST_SORT_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    <ErrorMessage errors={errors} name="sort" as="p" className="text-sm text-red-500" />
                </div>

                {/* Year */}
                <div className="form-group">
                    <label htmlFor="filter-year" className="form-text font-alegreya text-base">
                        Year:
                    </label>
                    <input
                        {...register('year', { valueAsNumber: true })}
                        id="filter-year"
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        className="form-field"
                        placeholder="e.g., 2022"
                    />
                    <ErrorMessage errors={errors} name="year" as="p" className="text-sm text-red-500" />
                </div>
            </div>

            <div className="flex items-center justify-end gap-4">
                <button className="button" type="submit">
                    Apply Filters
                </button>

                <button
                    type="button"
                    className="button button-danger"
                    onClick={() =>
                        setFilters({
                            search: '',
                            format: null,
                            genres: null,
                            year: null,
                            status: null,
                            sort: 'Last Updated',
                        })
                    }>
                    Clear Filters
                </button>
            </div>
        </form>
    );
};

export default AnilistFilter;
