import toast from 'react-hot-toast';

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

export const shareUrl = async ({ url, title, text, fallback = true }: { url: string; title?: string; text?: string; fallback?: boolean }) => {
    try {
        if (navigator.share) {
            await navigator.share({ title, text, url });
            return toast.success('Shared successfully');
        } else if (fallback && navigator.clipboard) {
            await navigator.clipboard.writeText(url);
            return toast.success('Copied to clipboard');
        } else {
            return toast.error('Sharing is not supported on your device');
        }
    } catch (error) {
        console.error('Error sharing:', error);
        return toast.error('Error sharing. Please try again.');
    }
};
