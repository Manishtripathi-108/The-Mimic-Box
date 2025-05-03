'use client';

import Icon from '@/components/ui/Icon';
import cn from '@/lib/utils/cn';

const MusicActionBtns = ({ className }: { className?: string }) => {
    return (
        <div className={cn('mx-auto flex items-end justify-center gap-x-6 px-4 sm:justify-between', className)}>
            <button type="button" aria-label="Share Track" className="button inline-flex size-9 rounded-full p-2">
                <Icon icon="share" className="size-full" />
            </button>
            <button type="button" aria-label="Play Track" className="button button-highlight inline-flex size-14 rounded-full p-2">
                <Icon icon="play" className="size-full" />
            </button>
            <button type="button" aria-label="More Options" className="button inline-flex size-9 rounded-full p-2">
                <Icon icon="moreDots" className="size-full rotate-90" />
            </button>
        </div>
    );
};

export const MusicActionBtnsSkeleton = ({ className }: { className?: string }) => {
    return (
        <div className={cn('mx-auto flex animate-pulse items-end justify-center gap-x-6 px-4 sm:justify-between', className)}>
            <div className="bg-secondary size-9 rounded-full" />
            <div className="bg-secondary size-14 rounded-full" />
            <div className="bg-secondary size-9 rounded-full" />
        </div>
    );
};

export default MusicActionBtns;
