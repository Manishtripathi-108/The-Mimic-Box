'use client';

import Image from 'next/image';

import Icon from '@/components/ui/Icon';

type MusicCardProps = {
    title: string;
    sub?: string;
    thumbnailUrl: string;
    onClick?: () => void;
};

export default function MusicCard({ title, sub, thumbnailUrl, onClick }: MusicCardProps) {
    return (
        <div className="group text-text-primary grid shrink-0 w-40 cursor-pointer" onClick={onClick}>
            <div className="relative mb-1 overflow-hidden rounded-xl">
                <Image
                    src={thumbnailUrl}
                    alt={title}
                    width={300}
                    height={144}
                    className="aspect-square h-40 w-full object-cover transition-transform group-hover:scale-105"
                />

                {/* Play Button Overlay */}
                <div className="bg-secondary/40 absolute inset-0 flex items-center justify-center opacity-0 backdrop-blur-xs backdrop-saturate-150 transition-opacity group-hover:opacity-100">
                    <button className="flex size-12 items-center justify-center rounded-full">
                        <Icon icon="play" className="size-full" />
                    </button>
                </div>
            </div>

            <div className="text-text-primary line-clamp-2 text-sm font-semibold">{title}</div>
            {sub && <div className="text-text-secondary truncate text-sm">{sub}</div>}
        </div>
    );
}
