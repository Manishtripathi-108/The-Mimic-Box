'use client';

import MusicCard from '@/app/(protected)/spotify/_components/MusicCard';
import Icon from '@/components/ui/Icon';

type MusicItem = {
    id: string;
    title: string;
    artist: string;
    thumbnailUrl: string;
};

type Props = {
    title: string;
    items: MusicItem[];
};

const MusicCardGrid = ({ title, items }: Props) => (
    <section>
        <div className="mb-2 flex items-center justify-between px-4 sm:px-6">
            <h2 className="text-highlight font-alegreya text-2xl font-semibold tracking-wide">{title}</h2>
            <button
                // onClick={onMoreClick}
                title="Show All"
                aria-label="Show All"
                className="text-text-secondary hover:text-text-primary size-7 rotate-90 transition-colors">
                <Icon icon="moreDots" className="size-full" />
            </button>
        </div>{' '}
        <div className="relative">
            <div className="from-primary pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l to-transparent" />
            <div className="from-primary pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r to-transparent" />
            <div className="scrollbar-hide flex gap-2 overflow-x-auto px-4 sm:gap-4 sm:px-6 sm:[scrollbar-width:none]">
                {items.map((item) => (
                    <MusicCard key={item.id} title={item.title} thumbnailUrl={item.thumbnailUrl} />
                ))}
            </div>
        </div>
    </section>
);

export default MusicCardGrid;
