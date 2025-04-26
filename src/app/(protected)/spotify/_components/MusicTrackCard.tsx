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

    return (
        <div className="from-secondary to-tertiary shadow-floating-xs @container flex items-center justify-between gap-4 rounded-2xl bg-linear-150 from-15% to-85% p-3 pr-5">
            <div className="flex w-full items-center gap-3">
                <button
                    className="text-text-secondary hover:text-text-primary size-7 shrink-0 transition-colors"
                    aria-label={explicit ? 'Play' : 'Pause'}>
                    <Icon icon={explicit ? 'pauseToPlay' : 'playToPause'} className="size-full" />
                </button>
                <div className="flex items-center gap-3">
                    <Link href={APP_ROUTES.SPOTIFY_TRACKS(id)} className="shrink-0 cursor-pointer">
                        <Image src={album.images[0].url} alt={name} width={50} height={50} className="rounded-xl object-cover" />
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
                                        className="hover:text-text-primary text-text-secondary cursor-pointer hover:underline">
                                        {artist.name}
                                        {index < artists.length - 1 && ', '}
                                    </Link>
                                ))}
                            </div>
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-4 text-sm @sm:w-full @sm:justify-between">
                <Link
                    title={album.name}
                    href={APP_ROUTES.SPOTIFY_ALBUMS(album.id)}
                    className="text-text-secondary hover:text-text-primary hidden cursor-pointer text-sm hover:underline @sm:line-clamp-1">
                    {album.name}
                </Link>
                <span>{formatTimeDuration(duration_ms, 'minutes')}</span>

                {/* Future Like Button (Optional) */}
                {/* <button
          className="size-5 text-red-500 transition-colors hover:text-text-primary"
          title={liked ? 'Unlike' : 'Like'}
        >
          <Icon icon="heart" className="size-full" />
        </button> */}
            </div>
        </div>
    );
};

export default memo(MusicTrackCard);
