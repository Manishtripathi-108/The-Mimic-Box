import React, { useEffect, useState } from 'react';

import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { openModal } from '@/components/ui/Modals';
import { AnilistMediaFilters } from '@/lib/types/anilist.types';

const A_Toolbar = ({
    text,
    search,
    setSearch,
    detailedView,
    setDetailedView,
}: {
    text: string;
    search: AnilistMediaFilters['search'];
    setSearch: (data: AnilistMediaFilters['search']) => void;
    detailedView: boolean;
    setDetailedView: (value: boolean) => void;
}) => {
    const [searchTerm, setSearchTerm] = useState(search || '');

    // Debounce logic
    useEffect(() => {
        const handler = setTimeout(() => {
            setSearch(searchTerm);
        }, 500);

        return () => clearTimeout(handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);

    return (
        <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-highlight text-2xl font-bold capitalize sm:text-3xl">{text}</h2>

            {/* Search Field */}
            <div className="form-field-wrapper bg-secondary hidden max-w-86 sm:flex">
                <input
                    type="text"
                    name="search"
                    placeholder="Search..."
                    className="form-field bg-inherit"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Icon
                    role="button"
                    aria-label={searchTerm ? 'Clear search' : 'Search'}
                    onClick={() => {
                        if (searchTerm) setSearchTerm('');
                    }}
                    icon={searchTerm ? 'close' : 'search'}
                    className="form-icon cursor-pointer"
                    flip="horizontal"
                />
            </div>

            {/* View Mode & Filter Buttons */}
            <div className="flex items-center justify-end pr-4">
                <span className="flex w-fit items-center justify-center rounded-full border">
                    {['detailed list', 'card'].map((mode) => (
                        <button
                            onClick={() => setDetailedView(mode === 'detailed list')}
                            key={mode}
                            className={`button p-2 shadow-none ${mode === 'detailed list' ? 'rounded-l-full' : 'rounded-r-full'} ${detailedView === (mode === 'detailed list') ? 'active' : ''}`}
                            title={`View as ${mode}`}
                            aria-label={`View as ${mode}`}>
                            <Icon icon={mode === 'detailed list' ? 'list' : 'card'} className="size-4" />
                        </button>
                    ))}
                </span>
                <Button
                    aria-label="Filter"
                    title="Filter"
                    onClick={() => openModal('modal-anilist-filters')}
                    className="text-highlight ml-4 rounded-xl"
                    icon="filter"
                />
            </div>
        </div>
    );
};

export default A_Toolbar;
