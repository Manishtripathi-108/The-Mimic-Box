'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import Input from '@/components/ui/Input';
import Modal, { closeModal } from '@/components/ui/Modals';
import Select from '@/components/ui/Select';
import TabSwitcher from '@/components/ui/TabSwitcher';
import { ANILIST_GENRES } from '@/constants/client.constants';
import {
    AnilistFilterSchema,
    AnilistMediaFormatSchema,
    AnilistMediaSortOptionsSchema,
    AnilistMediaStatusSchema,
} from '@/lib/schema/anilist.validations';
import { AnilistMediaFilters, AnilistMediaFormat, AnilistMediaStatus } from '@/lib/types/anilist.types';

const AnilistMediaFormatTabs = AnilistMediaFormatSchema.options.map((option) => option.replace('_', ' ').toLowerCase());
const AnilistMediaStatusTabs = AnilistMediaStatusSchema.options.map((option) => option.replaceAll('_', ' ').toLowerCase());
const ResetFilters: AnilistMediaFilters = {
    season: 'ALL',
    sort: 'Last Updated',
    format: undefined,
    status: undefined,
    genres: [],
    year: undefined,
    search: '',
};

const A_FilterModal = ({ filters, setFilters }: { filters: AnilistMediaFilters; setFilters: (filters: AnilistMediaFilters) => void }) => {
    const { control, handleSubmit, setValue, reset, watch } = useForm<AnilistMediaFilters>({
        defaultValues: { ...filters, genres: filters.genres ?? [] },
        resolver: zodResolver(AnilistFilterSchema),
    });

    const onSubmit = (values: AnilistMediaFilters) => {
        closeModal('modal-anilist-filters');
        setFilters(values);
    };

    return (
        <Modal modalId="modal-anilist-filters">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-lg bg-inherit p-6 shadow-lg">
                {/* Search */}
                <Input
                    name="search"
                    label="Search"
                    type="text"
                    placeholder="eg. Naruto"
                    control={control}
                    classNames={{ label: 'font-alegreya text-base' }}
                />

                {/* Format */}
                <div className="form-group relative">
                    <p className="form-text text-text-primary font-alegreya text-base">Format:</p>
                    <TabSwitcher
                        tabs={AnilistMediaFormatTabs}
                        currentTab={watch('format')?.toLowerCase().replace('_', ' ')}
                        className="w-full text-nowrap"
                        buttonClassName="capitalize p-2 text-sm"
                        onTabChange={(format) => setValue('format', format.replaceAll(' ', '_').toUpperCase() as AnilistMediaFormat)}
                    />
                    <button
                        type="button"
                        className="text-text-secondary hover:text-text-primary absolute -top-2 right-4 cursor-pointer text-2xl"
                        onClick={() => setValue('format', undefined)}
                        title="Clear">
                        x
                    </button>
                </div>

                {/* Genres */}
                <Checkbox
                    options={ANILIST_GENRES}
                    label="Genres:"
                    classNames={{ container: 'mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3', label: ' text-text-primary font-alegreya text-base' }}
                    name="genres"
                    control={control}
                />

                {/* Status */}
                <div className="form-group relative">
                    <p className="form-text text-text-primary font-alegreya text-base">Status:</p>
                    <TabSwitcher
                        tabs={AnilistMediaStatusTabs}
                        currentTab={watch('status')?.toLowerCase().replaceAll('_', ' ')}
                        className="w-full text-nowrap"
                        buttonClassName="capitalize p-2 text-sm"
                        onTabChange={(status) => setValue('status', status.replaceAll(' ', '_').toUpperCase() as AnilistMediaStatus)}
                    />
                    <button
                        type="button"
                        className="text-text-secondary hover:text-text-primary absolute -top-2 right-4 cursor-pointer text-2xl"
                        onClick={() => setValue('status', undefined)}
                        title="Clear">
                        x
                    </button>
                </div>

                {/* Sort & Year */}
                <div className="flex gap-4">
                    {/* Sort By */}
                    <Select
                        control={control}
                        name="sort"
                        label="Sort By:"
                        classNames={{ label: 'font-alegreya text-base' }}
                        options={AnilistMediaSortOptionsSchema.options}
                    />

                    {/* Season */}
                    <Select
                        control={control}
                        label="Season:"
                        name="season"
                        classNames={{ label: 'font-alegreya text-base' }}
                        options={AnilistFilterSchema.shape.season.options}
                    />

                    {/* Year */}
                    <Input
                        label="Year"
                        name="year"
                        type="number"
                        placeholder="ie., 2022"
                        control={control}
                        classNames={{ label: 'font-alegreya text-base' }}
                        rules={{ min: 1900, max: new Date().getFullYear() }}
                    />
                </div>

                <div className="flex items-center justify-end gap-4">
                    <Button type="submit">Apply Filters</Button>

                    <Button
                        variant="danger"
                        onClick={() => {
                            reset(ResetFilters);
                            setFilters(ResetFilters);
                        }}>
                        Clear Filters
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default A_FilterModal;
