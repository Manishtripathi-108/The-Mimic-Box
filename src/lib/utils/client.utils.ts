import { FormOption } from '@/lib/types/client.types';

export const getMonthName = (monthNumber: number) => {
    if (!(monthNumber >= 1 && monthNumber <= 12)) return '...';

    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('default', { month: 'long' });
};

export const getPageNumbers = (currentPage: number, totalPages: number, maxVisibleBtns = 5) => {
    const start = Math.max(1, currentPage - Math.floor(maxVisibleBtns / 2));
    const end = Math.min(totalPages, start + maxVisibleBtns - 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export const getOptionData = (option: FormOption) => (typeof option === 'string' ? { label: option, value: option } : option);
