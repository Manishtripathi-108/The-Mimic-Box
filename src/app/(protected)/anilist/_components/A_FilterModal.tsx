'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import Modal, { closeModal } from '@/components/ui/Modals';
import TabSwitcher from '@/components/ui/TabSwitcher';
import Checkbox from '@/components/ui/form/Checkbox';
import FormField from '@/components/ui/form/FormField';
import IconInput from '@/components/ui/form/IconInput';
import Select from '@/components/ui/form/Select';
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
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: { ...filters, genres: filters.genres ?? [] },
        resolver: zodResolver(AnilistFilterSchema),
    });

    const onSubmit = (values: AnilistMediaFilters) => {
        closeModal('modal-anilist-filters');
        setFilters(values);
    };

    return (
        <Modal modalId="modal-anilist-filters">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg bg-inherit p-6 shadow-lg">
                {/* Search */}
                <FormField label="Search" error={errors.search?.message} labelClassName="font-alegreya text-base">
                    <IconInput icon="search" placeholder="eg. Naruto" type="search" {...register('search')} />
                </FormField>

                {/* Format */}
                <div className="form-group relative">
                    <p className="form-text text-text-primary font-alegreya mb-2 text-base">Format:</p>
                    <TabSwitcher
                        tabs={AnilistMediaFormatTabs}
                        currentTab={watch('format')?.toLowerCase().replace('_', ' ')}
                        className="w-full text-nowrap"
                        buttonClassName="capitalize p-2 text-sm"
                        onTabChange={(format) => setValue('format', format.replaceAll(' ', '_').toUpperCase() as AnilistMediaFormat)}
                    />
                    <button
                        type="button"
                        className="text-text-secondary hover:text-text-primary absolute -top-3 right-4 cursor-pointer text-xl"
                        onClick={() => setValue('format', undefined)}
                        title="Clear">
                        x
                    </button>
                </div>

                {/* Genres */}
                <FormField error={errors.genres?.message}>
                    <p className="text-text-primary font-alegreya text-base">Genres:</p>
                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {ANILIST_GENRES.map((g) => (
                            <Checkbox key={g} value={g} {...register('genres')}>
                                {g}
                            </Checkbox>
                        ))}
                    </div>
                </FormField>

                {/* Status */}
                <div className="form-group relative">
                    <p className="form-text text-text-primary font-alegreya mb-2 text-base">Status:</p>
                    <TabSwitcher
                        tabs={AnilistMediaStatusTabs}
                        currentTab={watch('status')?.toLowerCase().replaceAll('_', ' ')}
                        className="w-full text-nowrap"
                        buttonClassName="capitalize p-2 text-sm"
                        onTabChange={(status) => setValue('status', status.replaceAll(' ', '_').toUpperCase() as AnilistMediaStatus)}
                    />
                    <button
                        type="button"
                        className="text-text-secondary hover:text-text-primary absolute -top-3 right-4 cursor-pointer text-xl"
                        onClick={() => setValue('status', undefined)}
                        title="Clear">
                        x
                    </button>
                </div>

                {/* Sort & Year */}
                <div className="flex gap-4">
                    {/* Sort By */}
                    <FormField label="Sort By:" error={errors.status?.message} labelClassName="font-alegreya text-base">
                        <Select {...register('sort')} className="capitalize *:capitalize">
                            {AnilistMediaSortOptionsSchema.options.map((o) => (
                                <option key={o} value={o}>
                                    {o.toLowerCase()}
                                </option>
                            ))}
                        </Select>
                    </FormField>

                    {/* Season */}

                    <FormField label="Season:" error={errors.season?.message} labelClassName="font-alegreya text-base">
                        <Select {...register('season')} className="capitalize *:capitalize">
                            {AnilistFilterSchema.shape.season.options.map((o) => (
                                <option key={o} value={o}>
                                    {o.toLowerCase()}
                                </option>
                            ))}
                        </Select>
                    </FormField>

                    {/* Year */}

                    <FormField label="Year:" error={errors.year?.message} labelClassName="font-alegreya text-base">
                        <IconInput
                            icon="calendar"
                            placeholder="ie., 2022"
                            type="number"
                            {...register('year', { min: 1900, max: new Date().getFullYear() })}
                        />
                    </FormField>
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
