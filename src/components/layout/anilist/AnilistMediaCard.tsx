'use client';

import React, { memo } from 'react';

import Image from 'next/image';

import { Icon } from '@iconify/react';

import { convertMonthNumberToName } from '@/constants/client.constants';
import ICON_SET from '@/constants/icons';
import { AnilistMedia } from '@/lib/types/anilist.types';
import cn from '@/lib/utils/cn';

const AnilistMediaCard = ({
    media,
    detailed = false,
    onEdit,
}: {
    media: AnilistMedia;
    detailed?: boolean;
    onEdit?: null | ((entry: AnilistMedia) => void);
}) => {
    return (
        <section
            className={cn(
                'shadow-floating-xs from-secondary to-tertiary relative overflow-hidden bg-linear-150 from-15% to-85% transition-all duration-300',
                detailed ? 'grid w-full grid-cols-10 rounded-2xl' : 'aspect-[5/7] rounded-xl'
            )}
            aria-labelledby={`media-title-${media?.id}`}>
            {/* Image Section */}
            <div className="relative col-span-4 h-full">
                <Image
                    width={detailed ? 500 : 300}
                    height={detailed ? 500 : 700}
                    src={media.coverImage.large}
                    alt={media.title.english || 'Unknown Title'}
                    className="size-full object-cover"
                    priority
                />

                {/* Title Overlay */}
                <header className="bg-secondary/75 absolute bottom-0 w-full p-2 backdrop-blur-sm">
                    <h2
                        title={media.title.userPreferred || media.title.english || media.title.native || 'Unknown Title'}
                        className={`text-text-primary font-alegreya overflow-hidden leading-none tracking-wide capitalize ${detailed ? 'mb-1' : 'truncate'}`}>
                        {media.title.userPreferred || media.title.english || media.title.native || 'Unknown Title'}
                    </h2>
                    <p className="text-text-secondary text-xs capitalize">
                        {media?.format?.replaceAll('_', ' ').toLowerCase()}{' '}
                        {media?.type === 'ANIME'
                            ? media?.format === 'MOVIE'
                                ? `${media?.duration ?? '??'}min`
                                : `${media?.episodes ?? '??'}, ${media?.duration ?? '??'}min/ep`
                            : `${media?.chapters ?? '??'} chapters`}
                    </p>
                </header>
            </div>

            {/* Edit Button */}
            {onEdit && !detailed && (
                <button
                    type="button"
                    title="Edit"
                    onClick={() => onEdit(media)}
                    className="button absolute top-1 right-1 z-10 size-6 rounded-full p-1"
                    aria-label="Edit">
                    <Icon icon={ICON_SET.EDIT} className="size-full" />
                </button>
            )}

            {/* Description */}
            {detailed && (
                <article id={`description-${media?.id}`} className="relative col-span-6 p-4">
                    {onEdit && (
                        <button
                            type="button"
                            title="Edit"
                            onClick={() => onEdit(media)}
                            className="button z-10 float-right size-8 rounded-full p-1"
                            aria-label="Edit">
                            <Icon icon={ICON_SET.EDIT} className="size-full" />
                        </button>
                    )}

                    <p className="text-text-secondary line-clamp-5 text-sm">
                        <strong className="text-text-primary">Description: </strong>
                        {media.description || 'No description available.'}
                    </p>

                    {/* Additional Info */}
                    <div className="text-text-secondary mt-3 mb-10 space-y-1 text-sm capitalize">
                        <p>
                            <strong className="text-text-primary">Native: </strong>
                            {media?.title?.native || 'N/A'}
                        </p>
                        <p>
                            <strong className="text-text-primary">Aired: </strong>
                            {media.startDate.day && media.startDate.month && media.startDate.year
                                ? `${media.startDate.day} ${convertMonthNumberToName(media.startDate.month)} ${media.startDate.year}`
                                : 'Unknown'}
                        </p>
                        <p>
                            <strong className="text-text-primary">Status: </strong>
                            {media.status.toLowerCase() || 'Unknown'}
                        </p>
                        <p>
                            <strong className="text-text-primary">Genres: </strong>
                            {media.genres.join(', ') || 'N/A'}
                        </p>
                        {media.type === 'ANIME' && (
                            <p>
                                <strong className="text-text-primary">Duration: </strong>
                                {media.duration ?? 'Unknown'} min/ep
                            </p>
                        )}
                    </div>

                    {/* Stats */}
                    <footer className="bg-secondary text-text-secondary absolute right-0 bottom-0 left-0 flex items-center justify-between p-3">
                        <div className="flex items-center gap-2">
                            <Icon icon={ICON_SET.SMILE} className="size-4 text-green-500" />
                            <span className="text-sm">{media.averageScore}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Icon icon={ICON_SET.HEART} className="size-4 text-red-500" />
                            <span className="text-sm">{media.favourites}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Icon icon={ICON_SET.EYE} className="size-4 text-blue-400" />
                            <span className="text-sm">{media.popularity}</span>
                        </div>
                    </footer>
                </article>
            )}
        </section>
    );
};

export default memo(AnilistMediaCard);
