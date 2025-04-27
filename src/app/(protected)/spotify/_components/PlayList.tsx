'use client';

import Image from 'next/image';
import Link from 'next/link';

import MusicTrackCard from '@/app/(protected)/spotify/_components/MusicTrackCard';
import Icon from '@/components/ui/Icon';
import { T_SpotifyPlaylist } from '@/lib/types/spotify.types';

export default function Playlist({ playlist }: { playlist: T_SpotifyPlaylist }) {
    const { name, description, images, owner, tracks } = playlist;
    const [coverImage] = images;

    return (
        <main className="min-h-calc-full-height p-2 sm:p-6">
            {/* Mobile Title */}
            <h1 className="font-alegreya text-center text-3xl font-bold tracking-wide sm:mb-4 sm:hidden">{name}</h1>

            {/* Top Section */}
            <section className="text-text-primary mt-4 mb-8 flex flex-col gap-6 px-4 sm:flex-row sm:items-end">
                <div className="shadow-floating-sm bg-tertiary mx-auto aspect-square w-full max-w-60 shrink-0 rounded-xl p-2 sm:mx-0">
                    <div className="relative size-full rounded-lg">
                        {coverImage && <Image src={coverImage.url} alt="Playlist Cover" fill className="rounded object-cover" />}
                    </div>
                </div>

                <div>
                    {/* Desktop Title */}
                    <h1 className="mb-4 hidden text-4xl font-extrabold sm:block md:text-5xl lg:text-7xl">{name}</h1>

                    {/* Description */}
                    {description && <p className="text-text-secondary text-center text-sm sm:text-left">{description}</p>}

                    {/* Owner Info */}
                    <p className="text-text-secondary text-center text-sm sm:text-left">
                        By:&nbsp;
                        <Link href={owner.external_urls.spotify} className="text-text-primary">
                            {owner.display_name}
                        </Link>
                        &nbsp;•&nbsp;{tracks.total} songs
                    </p>
                </div>
            </section>

            {/* Action Buttons */}
            <div className="mx-auto flex items-end justify-center gap-x-6 px-4 sm:justify-between">
                <button className="button inline-flex size-8 cursor-pointer rounded-full p-1.5">
                    <Icon icon="share" className="size-full" />
                </button>
                <button className="button button-highlight inline-flex size-12 rounded-full p-2">
                    <Icon icon="play" className="size-full" />
                </button>
                <button className="button inline-flex size-8 cursor-pointer rounded-full p-1.5">
                    <Icon icon="moreDots" className="size-full rotate-90" />
                </button>
            </div>

            {/* Songs List */}
            <div className="mt-6 grid w-full gap-2">
                {tracks.items.map(({ track }, idx) =>
                    track && !('show' in track) ? <MusicTrackCard key={`${track.id}-${idx}`} track={track} /> : null
                )}
            </div>
        </main>
    );
}
