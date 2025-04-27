'use client';

import { memo } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import Icon from '@/components/ui/Icon';
import { APP_ROUTES } from '@/constants/routes.constants';
import { T_SpotifyTrack } from '@/lib/types/spotify.types';
import { formatTimeDuration } from '@/lib/utils/core.utils';

type MusicTrackCardProps = {
    track: T_SpotifyTrack;
};

const MusicTrackCard = ({ track }: MusicTrackCardProps) => {
    const { id, name, duration_ms, explicit, album, artists } = track;
    const [albumCover] = album.images;

    return (
        <div className="from-secondary to-tertiary text-text-secondary shadow-floating-xs @container flex items-center justify-between gap-4 rounded-2xl bg-linear-150 from-15% to-85% p-3 pr-5 transition-transform hover:scale-101">
            {/* Left: Play Button + Info */}
            <div className="flex w-full items-center gap-3">
                <button
                    type="button"
                    className="hover:text-text-primary size-7 shrink-0 cursor-pointer transition-colors"
                    aria-label={explicit ? 'Play' : 'Pause'}>
                    <Icon icon={explicit ? 'pauseToPlay' : 'playToPause'} className="size-full" />
                </button>

                <div className="flex items-center gap-3">
                    <Link href={APP_ROUTES.SPOTIFY_TRACKS(id)} className="shrink-0 cursor-pointer">
                        {albumCover && <Image src={albumCover.url} alt={name} width={50} height={50} className="rounded-xl object-cover" />}
                    </Link>

                    <div className="flex flex-col">
                        <Link
                            href={APP_ROUTES.SPOTIFY_TRACKS(id)}
                            className="text-text-primary line-clamp-1 cursor-pointer font-semibold hover:underline"
                            title={name}>
                            {name}
                        </Link>

                        <span className="line-clamp-1 overflow-hidden text-sm">
                            <div className="select-none">
                                {artists.map((artist, index) => (
                                    <Link
                                        key={artist.id}
                                        href={APP_ROUTES.SPOTIFY_ARTISTS(artist.id)}
                                        className="hover:text-text-primary cursor-pointer hover:underline">
                                        {artist.name}
                                        {index < artists.length - 1 && ', '}
                                    </Link>
                                ))}
                            </div>
                        </span>
                    </div>
                </div>
            </div>

            {/* Right: Album Name + Duration (Desktop Only) */}
            <div className="hidden items-center justify-end gap-4 text-sm @md:flex @md:w-full @md:justify-between">
                <Link
                    title={album.name}
                    href={APP_ROUTES.SPOTIFY_ALBUMS(album.id)}
                    className="hover:text-text-primary line-clamp-1 cursor-pointer text-sm hover:underline">
                    {album.name}
                </Link>

                <span>{formatTimeDuration(duration_ms, 'minutes')}</span>
            </div>

            {/* Mobile More Button */}
            <button type="button" className="hover:text-text-primary size-8 cursor-pointer transition-colors @md:hidden">
                <Icon icon="moreDots" className="size-full" />
            </button>
        </div>
    );
};

export default memo(MusicTrackCard);
