'use client';

import { memo } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import MusicTrackPlayBtn from '@/app/(protected)/music/_components/MusicTrackPlayBtn';
import Icon from '@/components/ui/Icon';
import { T_AudioEntityLink, T_AudioSourceContext } from '@/lib/types/client.types';
import { formatTimeDuration } from '@/lib/utils/core.utils';

type MusicTrackCardProps = {
    id: string;
    title: string;
    link: string;
    duration_ms: number;
    artists: T_AudioEntityLink[];
    imageUrl?: string;
    album?: T_AudioEntityLink;
    context: T_AudioSourceContext;
};

const MusicTrackCard = ({ id, title, artists, link, duration_ms, imageUrl, album, context }: MusicTrackCardProps) => {
    return (
        <div className="from-secondary to-tertiary text-text-secondary shadow-floating-xs @container flex items-center justify-between gap-4 rounded-2xl bg-linear-120 from-15% to-85% p-3 pr-5 transition-transform hover:scale-101">
            {/* Left Section */}
            <div className="flex w-full items-center gap-3">
                <MusicTrackPlayBtn id={id} context={context} />

                <div className="flex items-center gap-3">
                    {imageUrl && (
                        <Link href={link} className="shrink-0">
                            <Image src={imageUrl} alt={title} width={50} height={50} className="rounded-xl object-cover" />
                        </Link>
                    )}

                    <div className="flex flex-col">
                        <Link href={link} className="text-text-primary line-clamp-1 font-semibold hover:underline" title={title}>
                            {title}
                        </Link>

                        <span className="line-clamp-1 overflow-hidden text-sm">
                            <div className="select-none">
                                {artists.map((artist, index) => (
                                    <Link key={artist.id} href={artist.link} className="hover:text-text-primary hover:underline">
                                        {artist.name}
                                        {index < artists.length - 1 && ', '}
                                    </Link>
                                ))}
                            </div>
                        </span>
                    </div>
                </div>
            </div>

            {/* Right Section (Visible on Desktop) */}
            <div className={`hidden items-center gap-4 text-sm @md:flex @md:w-full ${album ? '@md:justify-between' : '@md:justify-end'}`}>
                {album && (
                    <Link title={album.name} href={album.link} className="hover:text-text-primary line-clamp-1 hover:underline">
                        {album.name}
                    </Link>
                )}
                <span>{formatTimeDuration(duration_ms, 'minutes')}</span>
            </div>

            {/* Mobile More Button */}
            <button type="button" className="hover:text-text-primary size-8 cursor-pointer transition-colors @md:hidden">
                <Icon icon="moreDots" />
            </button>
        </div>
    );
};

export default memo(MusicTrackCard);
