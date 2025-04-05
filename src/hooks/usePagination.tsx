'use client';

import { ComponentType, memo, useEffect, useMemo, useState } from 'react';

import Pagination from '@/components/ui/Pagination';

type UsePaginationOptions = {
    current?: number;
    setCurrent?: (page: number) => void;
    scrollToTop?: boolean;
};

type PaginationProps = {
    className?: string;
};

function usePagination<T>(data: T[], itemsPerPage: number, { current = 1, setCurrent, scrollToTop = false }: UsePaginationOptions = {}) {
    const [internalCurrent, setInternalCurrent] = useState(current);
    const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));

    // Determine if we are using an external state handler
    const isExternal = typeof setCurrent === 'function';

    const currentPage = isExternal ? current : internalCurrent;
    const setCurrentPage = isExternal ? setCurrent : setInternalCurrent;

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
            if (scrollToTop) window.scrollTo({ top: 0, behavior: 'instant' });
        }
    };

    const currentData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return data.slice(start, start + itemsPerPage);
    }, [data, currentPage, itemsPerPage]);

    const PaginationComponent: ComponentType<PaginationProps> = memo(({ className }) => (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} className={className} />
    ));

    PaginationComponent.displayName = 'PaginationComponent';

    return { currentData, currentPage, totalPages, setCurrentPage, Pagination: PaginationComponent };
}

export default usePagination;
