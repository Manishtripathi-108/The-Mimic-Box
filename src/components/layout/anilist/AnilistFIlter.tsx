import React from 'react';

import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import TabNavigation from '@/components/ui/TabNavigation';
import { FILTER_OPTIONS } from '@/constants/client.constants';
import { AnilistFilterSchema } from '@/lib/schema/client.validations';

type FilterValues = z.infer<typeof AnilistFilterSchema>;

const AnilistFilter = ({ filters, setFilters }: { filters: FilterValues; setFilters: (filters: FilterValues) => void }) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<FilterValues>({
        defaultValues: filters,
        resolver: zodResolver(AnilistFilterSchema),
    });

    const onSubmit = (values: FilterValues) => {
        setFilters(values);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-lg bg-inherit p-6 shadow-lg">
            {/* Format */}
            <div className="form-group relative">
                <p className="form-text text-text-primary font-alegreya text-base">Format:</p>
                <TabNavigation
                    tabs={FILTER_OPTIONS.format}
                    currentTab={watch('format')}
                    className="w-full text-nowrap"
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
                    {FILTER_OPTIONS.genres.map((genre) => (
                        <label key={genre} className="form-checkbox flex items-center">
                            <input type="checkbox" {...register('genres')} value={genre} className="checkbox-field" />
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
                    tabs={FILTER_OPTIONS.status}
                    currentTab={watch('status')}
                    className="w-full text-nowrap"
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
                    <label htmlFor="sort" className="form-text font-alegreya text-base">
                        Sort By:
                    </label>
                    <select {...register('sort')} className="form-field">
                        <option value="Last Added">Default</option>
                        {FILTER_OPTIONS.sort.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    <ErrorMessage errors={errors} name="sort" as="p" className="text-sm text-red-500" />
                </div>

                {/* Year */}
                <div className="form-group">
                    <label htmlFor="year" className="form-text font-alegreya text-base">
                        Year:
                    </label>
                    <input
                        {...register('year')}
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

                <button type="button" className="button button-danger" onClick={() => reset()}>
                    Clear Filters
                </button>
            </div>
        </form>
    );
};

export default AnilistFilter;
