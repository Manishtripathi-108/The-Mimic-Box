'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import toast from 'react-hot-toast';

import { getSpotifyData } from '@/actions/spotify.actions';
import MusicTrackCard from '@/app/(protected)/spotify/_components/MusicTrackCard';
import MusicTrackCardSkeleton from '@/app/(protected)/spotify/_components/MusicTrackCardSkeleton';
import Icon from '@/components/ui/Icon';
import { T_SpotifyPaging, T_SpotifyPlaylist, T_SpotifyPlaylistTrack } from '@/lib/types/spotify.types';

export default function Playlist({ playlist }: { playlist: T_SpotifyPlaylist }) {
    const { name, description, images, owner, tracks: initialTracks } = playlist;
    const [coverImage] = images;

    const [tracks, setTracks] = useState(initialTracks.items);
    const [nextUrl, setNextUrl] = useState(initialTracks.next);
    const [isPending, startTransition] = useTransition();
    const loadingRef = useRef<HTMLDivElement>(null);

    const fetchNextTracks = useCallback(async () => {
        if (!nextUrl) return;

        const res = await getSpotifyData<T_SpotifyPaging<T_SpotifyPlaylistTrack>>(nextUrl);
        if (!res.success || !res.payload) {
            toast.error('Failed to fetch more tracks');
            return;
        }

        setTracks((prev) => [...prev, ...res.payload.items]);
        setNextUrl(res.payload.next);
    }, [nextUrl]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && nextUrl) {
                    startTransition(() => {
                        fetchNextTracks();
                    });
                }
            },
            { threshold: 1 }
        );

        const loadingEl = loadingRef.current;
        if (loadingEl) observer.observe(loadingEl);

        return () => {
            if (loadingEl) observer.unobserve(loadingEl);
        };
    }, [fetchNextTracks, nextUrl]);

    return (
        <main className="min-h-calc-full-height p-2 sm:p-6">
            {/* Mobile Title */}
            <h1 className="font-alegreya text-center text-3xl font-bold tracking-wide sm:hidden">{name}</h1>

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
                        <Link href={owner.external_urls.spotify} className="text-text-primary hover:underline">
                            {owner.display_name}
                        </Link>
                        &nbsp;•&nbsp;{initialTracks.total} songs
                    </p>
                </div>
            </section>

            {/* Action Buttons */}
            <div className="mx-auto flex items-end justify-center gap-x-6 px-4 sm:justify-between">
                <button type="button" aria-label="Share Track" className="button inline-flex size-9 rounded-full p-2">
                    <Icon icon="share" className="size-full" />
                </button>
                <button type="button" aria-label="Play Track" className="button button-highlight inline-flex size-14 rounded-full p-2">
                    <Icon icon="play" className="size-full" />
                </button>
                <button type="button" aria-label="More Options" className="button inline-flex size-9 rounded-full p-2">
                    <Icon icon="moreDots" className="size-full rotate-90" />
                </button>
            </div>

            {/* Songs List */}
            <div className="mt-6 grid w-full gap-2">
                {tracks.map(({ track }, idx) => (track && !('show' in track) ? <MusicTrackCard key={`${track.id}-${idx}`} track={track} /> : null))}

                {/* Loading Indicator */}
                <div ref={loadingRef} className="grid w-full gap-2">
                    {isPending && Array.from({ length: 5 }).map((_, idx) => <MusicTrackCardSkeleton key={idx} />)}
                </div>
            </div>
        </main>
    );
}
