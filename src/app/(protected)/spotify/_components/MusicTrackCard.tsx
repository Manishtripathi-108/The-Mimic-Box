'use client';

import { memo } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import Icon from '@/components/ui/Icon';
import { APP_ROUTES } from '@/constants/routes.constants';
import { T_SpotifySimplifiedTrack, T_SpotifyTrack } from '@/lib/types/spotify.types';
import { formatTimeDuration } from '@/lib/utils/core.utils';

type MusicTrackCardProps = {
    track: T_SpotifyTrack | T_SpotifySimplifiedTrack;
};

const MusicTrackCard = ({ track }: MusicTrackCardProps) => {
    const { id, name, duration_ms, explicit, artists } = track;
    const isFullTrack = 'album' in track;
    const albumImage = isFullTrack ? track.album.images?.[0]?.url : undefined;
    const albumName = isFullTrack ? track.album.name : undefined;
    const albumId = isFullTrack ? track.album.id : undefined;

    return (
        <div className="from-secondary to-tertiary text-text-secondary shadow-floating-xs @container flex items-center justify-between gap-4 rounded-2xl bg-linear-120 from-15% to-85% p-3 pr-5 transition-transform hover:scale-101">
            {/* Left Section */}
            <div className="flex w-full items-center gap-3">
                <button
                    type="button"
                    className="hover:text-text-primary size-7 shrink-0 cursor-pointer transition-colors"
                    aria-label={explicit ? 'Play' : 'Pause'}>
                    <Icon icon={explicit ? 'pauseToPlay' : 'playToPause'} className="size-full" />
                </button>

                <div className="flex items-center gap-3">
                    {isFullTrack && albumImage && (
                        <Link href={APP_ROUTES.SPOTIFY_TRACKS(id)} className="shrink-0">
                            <Image src={albumImage} alt={name} width={50} height={50} className="rounded-xl object-cover" />
                        </Link>
                    )}

                    <div className="flex flex-col">
                        <Link
                            href={APP_ROUTES.SPOTIFY_TRACKS(id)}
                            className="text-text-primary line-clamp-1 font-semibold hover:underline"
                            title={name}>
                            {name}
                        </Link>

                        <span className="line-clamp-1 overflow-hidden text-sm">
                            <div className="select-none">
                                {artists.map((artist, index) => (
                                    <Link
                                        key={artist.id}
                                        href={APP_ROUTES.SPOTIFY_ARTISTS(artist.id)}
                                        className="hover:text-text-primary hover:underline">
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
            <div className={`hidden items-center gap-4 text-sm @md:flex @md:w-full ${isFullTrack ? '@md:justify-between' : '@md:justify-end'}`}>
                {isFullTrack && albumName && albumId && (
                    <Link
                        title={albumName}
                        href={APP_ROUTES.SPOTIFY_ALBUMS(albumId)}
                        className="hover:text-text-primary line-clamp-1 hover:underline">
                        {albumName}
                    </Link>
                )}
                <span>{formatTimeDuration(duration_ms, 'minutes')}</span>
            </div>

            {/* Mobile More Button */}
            <button type="button" className="hover:text-text-primary size-8 cursor-pointer transition-colors @md:hidden">
                <Icon icon="moreDots" className="size-full" />
            </button>
        </div>
    );
};

export const MusicTrackCardSkeleton = () => {
    return (
        <div className="from-secondary to-tertiary shadow-floating-xs @container flex w-full items-center justify-between gap-4 rounded-2xl bg-linear-150 from-15% to-85% p-3 pr-5 *:animate-pulse">
            <div className="flex w-full items-center gap-3">
                <div className="bg-primary size-7 shrink-0 rounded-full" />

                <div className="flex items-center gap-3">
                    <div className="bg-primary shrink-0 rounded-xl" style={{ width: 50, height: 50 }} />

                    <div className="flex flex-col gap-1">
                        <div className="bg-primary h-4 w-32 rounded" />
                        <div className="bg-primary h-3 w-24 rounded" />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-4 text-sm @md:w-full @md:justify-between">
                <div className="bg-primary hidden h-3 w-24 rounded @md:block" />
                <div className="bg-primary h-3 w-8 rotate-90 rounded @md:rotate-0" />
            </div>
        </div>
    );
};

export default memo(MusicTrackCard);
