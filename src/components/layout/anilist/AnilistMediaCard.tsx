'use client';

import React, { memo } from 'react';

import { Icon } from '@iconify/react';

import { convertMonthNumberToName } from '@/constants/client.constants';
import ICON_SET from '@/constants/icons';
import { AnilistMedia } from '@/lib/types/anilist.types';

const AnilistMediaCard = ({ media, onEdit }: { media: AnilistMedia; onEdit: null | ((entry: AnilistMedia) => void) }) => {
    return (
        <section
            style={{ backgroundImage: `url(${media?.coverImage?.large})` }}
            className="shadow-floating-sm relative aspect-[5/7] overflow-hidden rounded-lg bg-cover bg-center bg-no-repeat"
            aria-labelledby={`media-title-${media?.id}`}>
            {/* Title and Info */}
            <header className="bg-tertiary/80 absolute bottom-0 grid h-11 w-full place-items-center p-2 text-nowrap">
                <h2
                    id={`media-title-${media?.id}`}
                    className="text-text-primary font-karla w-full truncate text-sm leading-none font-normal capitalize">
                    {media?.title?.userPreferred || media?.title?.english || media?.title?.native || media?.title?.romaji || 'Unknown Title'}
                </h2>
                <p className="text-text-secondary w-full shrink-0 text-xs tracking-wider capitalize">
                    {media?.format.replaceAll('_', ' ').toLowerCase()}{' '}
                    {media?.type === 'ANIME'
                        ? media?.format === 'MOVIE'
                            ? `${media?.duration ?? '??'}min`
                            : `${media?.episodes ?? '??'}, ${media?.duration ?? '??'}min/ep`
                        : `${media?.chapters ?? '??'} chapters`}
                </p>
            </header>

            {/* Edit Button */}
            {onEdit && (
                <button
                    type="button"
                    title="Edit"
                    onClick={() => onEdit(media)}
                    className="bg-secondary text-text-secondary hover:text-text-primary absolute top-1 right-1 flex cursor-pointer items-center justify-center rounded-lg p-0.5"
                    aria-label="Edit">
                    <Icon icon={ICON_SET.EDIT} className="size-4" />
                </button>
            )}

            {/* Info Button */}
            <button
                className="text-text-secondary bg-secondary/80 hover:text-text-primary absolute right-1 bottom-8 cursor-pointer rounded-full p-1"
                // popovertarget={`description-popover-${media?.id}`}
                // popovertargetaction="toggle"
                aria-label="Show Description">
                <Icon icon={ICON_SET.INFO_OUTLINED} className="size-4" />
            </button>

            {/* Description Popover */}
            <article
                id={`description-popover-${media?.id}`}
                popover="auto"
                role="dialog"
                aria-labelledby={`media-title-${media?.id}`}
                className="bg-primary/60 /50 top-1/2 left-1/12 w-72 rounded-lg border p-3 opacity-0 shadow-lg backdrop-blur-md backdrop-saturate-150 transition-all transition-discrete duration-500 open:opacity-100 sm:left-1/3 starting:open:opacity-0">
                <header>
                    <h3 className="text-text-primary font-aladin text-xl font-bold tracking-widest" id={`description-title-${media?.id}`}>
                        {media?.title?.english || media?.title?.native || media?.title?.romaji || 'Unknown Title'}
                    </h3>
                </header>
                <p className="text-text-secondary mb-3 line-clamp-5 text-sm">{media?.description || 'No description available.'}</p>

                {/* Additional Info */}
                <footer className="text-text-secondary mb-4 space-y-1 text-xs">
                    <p>
                        <strong className="text-text-primary">Japanese: </strong> {media?.title?.native || 'N/A'}
                    </p>
                    <p>
                        <strong className="text-text-primary">Aired: </strong>
                        {media?.startDate?.day && media?.startDate?.month && media?.startDate?.year
                            ? `${media?.startDate?.day} ${convertMonthNumberToName(media?.startDate?.month)} ${media?.startDate?.year}`
                            : 'Unknown'}
                    </p>
                    <p>
                        <strong className="text-text-primary">Status: </strong> {media?.status || 'Unknown'}
                    </p>
                    <p>
                        <strong className="text-text-primary">Genres: </strong> {media?.genres?.join(', ') || 'N/A'}
                    </p>
                    {media?.type === 'ANIME' && (
                        <p>
                            <strong className="text-text-primary">Duration: </strong> {media?.duration ?? 'Unknown'} min/ep
                        </p>
                    )}
                </footer>
            </article>
        </section>
    );
};

export default memo(AnilistMediaCard);
