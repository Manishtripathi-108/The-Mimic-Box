'use client';

import React from 'react';

import Icon from '@/components/ui/Icon';
import { getPageNumbers } from '@/constants/client.constants';
import cn from '@/lib/utils/cn';

const MAX_VISIBLE_BUTTONS = 5;

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
};

const Pagination = ({ currentPage, totalPages, onPageChange, className }: PaginationProps) => {
    if (totalPages <= 1) return null;

    return (
        <div className={cn('bg-secondary shadow-floating-xs mx-auto w-fit rounded-full p-3', className)}>
            <ul className="flex list-none items-center justify-center">
                {/* Previous Arrow */}
                <li className="bg-primary shadow-floating-xs active:shadow-pressed-xs mx-1 rounded-full sm:mr-4">
                    <button
                        title="Previous Page"
                        disabled={currentPage === 1}
                        className="text-text-secondary hover:text-text-primary font-karla block cursor-pointer px-2 py-1"
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}>
                        <Icon icon="leftArrow" className="size-5" />
                    </button>
                </li>

                {/* Page Numbers */}
                {getPageNumbers(currentPage, totalPages, MAX_VISIBLE_BUTTONS).map((page) => (
                    <li
                        key={page}
                        className={cn(
                            'bg-primary mx-1 rounded-full',
                            currentPage === page
                                ? 'text-text-primary shadow-pressed-xs'
                                : 'text-text-secondary hover:text-text-primary shadow-floating-xs active:shadow-pressed-xs'
                        )}>
                        <button
                            className="block min-w-7 cursor-pointer p-1 text-center"
                            disabled={currentPage === page}
                            onClick={() => onPageChange(page)}>
                            {page}
                        </button>
                    </li>
                ))}

                {/* Ellipsis for Hidden Pages */}
                {totalPages > MAX_VISIBLE_BUTTONS && currentPage < totalPages - 1 && (
                    <li className="bg-primary shadow-floating-xs mx-1 rounded-full">
                        <span className="text-text-secondary font-karla block min-w-7 p-1 text-center">...</span>
                    </li>
                )}

                {/* Next Arrow */}
                <li className="bg-primary shadow-floating-xs active:shadow-pressed-xs mx-1 rounded-full sm:ml-4">
                    <button
                        title="Next Page"
                        disabled={currentPage === totalPages}
                        className="text-text-secondary hover:text-text-primary font-karla block cursor-pointer px-2 py-1"
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}>
                        <Icon icon="rightArrow" className="size-5" />
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Pagination;
