'use client';

import Image from 'next/image';
import Link from 'next/link';

import Icon from '@/components/ui/Icon';

type MusicCardProps = {
    title: string;
    sub?: string;
    thumbnailUrl: string;
    href: string;
};

export default function MusicCard({ title, sub, thumbnailUrl, href }: MusicCardProps) {
    return (
        <article
            className="text-text-primary relative grid w-40 shrink-0 grid-rows-[auto_1fr] gap-1"
            aria-label={`Play ${title}${sub ? ` by ${sub}` : ''}`}>
            <Link
                href={href}
                className="group relative block aspect-square w-full overflow-hidden rounded-xl focus:outline-none"
                title={`Play ${title}`}
                aria-label={`Play ${title}`}>
                <Image
                    src={thumbnailUrl}
                    alt={`Thumbnail for ${title}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105 group-focus:scale-105"
                />

                {/* Play Button Overlay */}
                <div className="bg-secondary/40 absolute inset-0 flex items-center justify-center opacity-0 backdrop-blur-xs backdrop-saturate-150 transition-opacity group-hover:opacity-100 group-focus:opacity-100">
                    <Icon icon="play" className="size-14" />
                </div>

                {/* Screen reader text */}
                <span className="sr-only">Play {title}</span>
            </Link>

            <div className="flex flex-col gap-0.5 overflow-hidden">
                <h3 className="text-text-primary line-clamp-2 text-sm font-semibold">{title}</h3>
                {sub && <p className="text-text-secondary truncate text-sm">{sub}</p>}
            </div>
        </article>
    );
}
