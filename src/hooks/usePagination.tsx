'use client';

import React, { memo, useEffect, useMemo, useState } from 'react';

import { Icon } from '@iconify/react';

import ICON_SET from '@/constants/icons';
import cn from '@/lib/utils/cn';

const MAX_VISIBLE_BUTTONS = 4;

const usePagination = <T,>(
    data: T[],
    itemsPerPage: number,
    {
        current = 1,
        setCurrent: externalSetCurrent,
        scrollToTop = false,
    }: {
        current?: number;
        setCurrent?: (page: number) => void;
        scrollToTop?: boolean;
    } = {}
) => {
    const [internalCurrent, setInternalCurrent] = useState(current || 1);
    const totalPages = Math.ceil(data.length / itemsPerPage) || 1;

    // Determine if we are using an external state handler
    const isExternalControl = typeof externalSetCurrent === 'function';

    // Define the current page state based on external or internal control
    const currentPage = isExternalControl ? current : internalCurrent;
    const setCurrentPage = isExternalControl ? externalSetCurrent : setInternalCurrent;

    // Ensure the current page is within valid bounds
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        } else if (currentPage < 1) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages, setCurrentPage]);

    const handlePageChange = (page: number) => {
        if (page !== currentPage) {
            setCurrentPage(page);
            if (scrollToTop) scroll(0, 0);
        }
    };

    const getPageNumbers = () => {
        let pages = [];
        const halfVisible = Math.floor(MAX_VISIBLE_BUTTONS / 2);

        if (totalPages <= MAX_VISIBLE_BUTTONS) {
            pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        } else if (currentPage <= halfVisible) {
            pages = Array.from({ length: MAX_VISIBLE_BUTTONS }, (_, i) => i + 1);
        } else if (currentPage > totalPages - halfVisible) {
            pages = Array.from({ length: MAX_VISIBLE_BUTTONS }, (_, i) => totalPages - MAX_VISIBLE_BUTTONS + i + 1);
        } else {
            for (let i = 0; i < MAX_VISIBLE_BUTTONS; i++) {
                pages.push(currentPage - halfVisible + i);
            }
        }
        return pages;
    };

    const currentData = useMemo(() => {
        return data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }, [data, currentPage, itemsPerPage]);

    const Pagination = memo(({ className }: { className?: string }) => {
        if (totalPages <= 1) return null;

        return (
            <div className={cn('bg-secondary shadow-floating-xs mx-auto w-fit rounded-full p-3', className)}>
                <ul className="flex list-none items-center justify-center">
                    {/* Previous Arrow */}
                    <li className="bg-primary shadow-floating-xs active:shadow-pressed-xs mx-1 flex-1 rounded-full first:mr-2 last:ml-2 sm:first:mr-4 sm:last:ml-4">
                        <button
                            title="Previous Page"
                            disabled={currentPage === 1}
                            className="text-text-secondary hover:text-text-primary font-karla block cursor-pointer px-2 py-1"
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}>
                            <Icon icon={ICON_SET.LEFT_ARROW} className="size-5" />
                        </button>
                    </li>

                    {/* Page Numbers */}
                    {getPageNumbers().map((page) => (
                        <li
                            key={page}
                            className={`bg-primary mx-1 flex-1 rounded-full ${
                                currentPage === page
                                    ? 'text-text-primary shadow-pressed-xs'
                                    : 'text-text-secondary hover:text-text-primary shadow-floating-xs active:shadow-pressed-xs'
                            }`}>
                            <button
                                className="block min-w-7 cursor-pointer p-1 text-center"
                                disabled={currentPage === page}
                                onClick={() => handlePageChange(page)}>
                                {page}
                            </button>
                        </li>
                    ))}

                    {/* Ellipsis for Hidden Pages */}
                    {totalPages > MAX_VISIBLE_BUTTONS && currentPage < totalPages - 1 && (
                        <li className="bg-primary shadow-floating-xs mx-1 flex-1 rounded-full">
                            <span className="text-text-secondary font-karla block min-w-7 p-1 text-center">...</span>
                        </li>
                    )}

                    {/* Next Arrow */}
                    <li className="bg-primary shadow-floating-xs active:shadow-pressed-xs mx-1 flex-1 rounded-full first:mr-2 last:ml-2 sm:first:mr-4 sm:last:ml-4">
                        <button
                            title="Next Page"
                            disabled={currentPage === totalPages}
                            className="text-text-secondary hover:text-text-primary font-karla block cursor-pointer px-2 py-1 text-center"
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}>
                            <Icon icon={ICON_SET.RIGHT_ARROW} className="size-5" />
                        </button>
                    </li>
                </ul>
            </div>
        );
    });

    Pagination.displayName = 'Pagination';

    return { currentData, Pagination, currentPage, totalPages, setCurrentPage };
};

export default usePagination;
