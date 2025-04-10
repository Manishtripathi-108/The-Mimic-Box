'use client';

import React, { memo } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import Icon from '@/components/ui/Icon';
import { APP_ROUTES } from '@/constants/routes.constants';
import { AnilistMedia } from '@/lib/types/anilist.types';
import { getMonthName } from '@/lib/utils/client.utils';
import cn from '@/lib/utils/cn';

const A_MediaCard = ({
    media,
    detailed = false,
    onEdit,
}: {
    media: AnilistMedia;
    detailed?: boolean;
    onEdit?: ((entry: AnilistMedia) => void) | null;
}) => {
    const title = media.title.english || media.title.native || media.title.romaji || 'Unknown Title';

    return (
        <section
            className={cn(
                'shadow-floating-xs from-secondary text-text-secondary to-tertiary relative w-full overflow-hidden bg-linear-150 from-15% to-85% transition-all duration-300',
                detailed ? 'grid grid-cols-10 rounded-2xl' : 'aspect-[5/7] rounded-md'
            )}
            aria-labelledby={`media-title-${media.id}`}>
            {/* Image */}
            <div className="relative col-span-4 h-full">
                <Image width={500} height={700} src={media.coverImage.extraLarge} alt={title} className="size-full object-cover" priority />

                {/* Overlay title (only for non-detailed) */}
                {!detailed && (
                    <header className="bg-secondary/75 absolute bottom-0 w-full px-3 py-2 backdrop-blur-sm">
                        <h2 title={title} className="text-text-primary block truncate text-base font-semibold">
                            {title}
                        </h2>
                        <p className="text-xs capitalize">
                            {media.format?.replaceAll('_', ' ').toLowerCase()} ·{' '}
                            {media.type === 'ANIME'
                                ? media.format === 'MOVIE'
                                    ? `${media.duration ?? '??'}min`
                                    : `${media.episodes ?? '??'} ep · ${media.duration ?? '??'}min/ep`
                                : `${media.chapters ?? '??'} chapters`}
                        </p>
                    </header>
                )}

                {/* Floating Edit Button */}
                {onEdit && !detailed && (
                    <button
                        type="button"
                        title="Edit"
                        onClick={() => onEdit(media)}
                        className="button absolute top-2 right-2 z-10 size-7 rounded-full p-1"
                        aria-label="Edit">
                        <Icon icon="edit" className="size-full" />
                    </button>
                )}

                <Link
                    href={APP_ROUTES.ANILIST_MEDIA_DETAIL(media.type.toLowerCase() as 'anime' | 'manga', media.id)}
                    className="absolute inset-0 z-0"
                    aria-label={`View details for ${title}`}>
                    <span className="sr-only">View details for {title}</span>
                </Link>
            </div>

            {/* Detailed Section */}
            {detailed && (
                <div className="col-span-6 flex flex-col justify-between gap-2 p-2 md:p-6">
                    {/* Header */}
                    <header className="flex items-start justify-between">
                        <h2 id={`media-title-${media.id}`} className="text-text-primary text-lg font-bold">
                            {title}
                        </h2>
                        {onEdit && (
                            <button
                                type="button"
                                title="Edit"
                                onClick={() => onEdit(media)}
                                className="button size-7 shrink-0 rounded-full p-1"
                                aria-label="Edit">
                                <Icon icon="edit" className="size-full" />
                            </button>
                        )}
                    </header>

                    {/* Description */}
                    <div>
                        <span className="text-text-primary font-medium">Description: </span>
                        <p
                            style={{ scrollbarGutter: 'stable' }}
                            className="scrollbar-thin h-20 overflow-y-hidden text-sm hover:overflow-y-auto"
                            dangerouslySetInnerHTML={{ __html: media.description }}
                        />
                    </div>

                    {/* Additional Info */}
                    <div className="[&>p>strong]:text-text-primary mt-2 text-sm">
                        <p>
                            <strong>Native: </strong>
                            {media.title.native || 'N/A'}
                        </p>
                        <p>
                            <strong>Aired: </strong>
                            {media.startDate.month
                                ? `${media.startDate.day} ${getMonthName(media.startDate.month)} ${media.startDate.year}`
                                : 'Unknown'}
                        </p>
                        <p>
                            <strong>Status: </strong>
                            {media.status?.toLowerCase() || 'Unknown'}
                        </p>
                        <p>
                            <strong>Genres: </strong>
                            {media.genres?.join(', ') || 'N/A'}
                        </p>
                        {media.type === 'ANIME' && (
                            <p>
                                <strong>Duration: </strong>
                                {media.duration ?? 'Unknown'} min/ep
                            </p>
                        )}
                    </div>

                    {/* Stats */}
                    <footer className="flex items-center justify-between border-t pt-4 text-sm *:flex *:items-center *:gap-1">
                        <div>
                            <Icon icon="smile" className="size-4 text-green-500" />
                            <span>{media.averageScore}%</span>
                        </div>
                        <div>
                            <Icon icon="heart" className="size-4 text-red-500" />
                            <span>{media.favourites}</span>
                        </div>
                        <div>
                            <Icon icon="eye" className="size-4 text-blue-400" />
                            <span>{media.popularity}</span>
                        </div>
                    </footer>
                </div>
            )}
        </section>
    );
};

export default memo(A_MediaCard);
