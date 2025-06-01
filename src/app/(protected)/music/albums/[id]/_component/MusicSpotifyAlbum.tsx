'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';

import Link from 'next/link';

import toast from 'react-hot-toast';

import { fetchSpotifyDataByUrl } from '@/actions/spotify.actions';
import MusicActionBtns from '@/app/(protected)/music/_components/MusicActionBtns';
import MusicMediaHeader from '@/app/(protected)/music/_components/MusicMediaHeader';
import MusicTrackCard from '@/app/(protected)/music/_components/MusicTrackCard';
import MusicTrackCardSkeleton from '@/app/(protected)/music/_components/skeletons/MusicTrackCardSkeleton';
import { APP_ROUTES } from '@/constants/routes.constants';
import { T_SpotifyAlbum, T_SpotifyPaging, T_SpotifySimplifiedTrack } from '@/lib/types/spotify.types';

const MusicSpotifyAlbum = ({ album }: { album: T_SpotifyAlbum }) => {
    const { name, images, tracks: initialTracks, artists } = album;

    const [tracks, setTracks] = useState(initialTracks.items);
    const [nextUrl, setNextUrl] = useState(initialTracks.next);
    const [isPending, startTransition] = useTransition();
    const loadingRef = useRef<HTMLDivElement>(null);

    const fetchNextTracks = useCallback(async () => {
        if (!nextUrl) return;

        const res = await fetchSpotifyDataByUrl<T_SpotifyPaging<T_SpotifySimplifiedTrack>>(nextUrl);
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
        <>
            <MusicMediaHeader title={name} coverImage={images?.[0]?.url} metadata={`${initialTracks.total} songs`}>
                <>
                    By:&nbsp;
                    <Link href={APP_ROUTES.MUSIC.ARTISTS(artists[0].id)} className="text-text-primary hover:underline">
                        {artists[0].name}
                    </Link>
                </>
            </MusicMediaHeader>

            <MusicActionBtns context={{ id: album.id, type: 'album', source: 'spotify' }} className="mt-4" />

            {/* Songs List */}
            <div className="mt-6 grid w-full gap-2">
                {tracks.map((t, idx) =>
                    t && !('show' in t) ? (
                        <MusicTrackCard
                            key={`${t.id}-${idx}`}
                            id={t.id}
                            title={t.name}
                            link={APP_ROUTES.MUSIC.TRACKS(t.id)}
                            duration_ms={t.duration_ms}
                            artists={t.artists.map((artist) => ({
                                id: artist.id,
                                name: artist.name,
                                link: APP_ROUTES.MUSIC.ARTISTS(artist.id),
                            }))}
                            context={{ type: 'album', id: album.id, source: 'spotify' }}
                        />
                    ) : null
                )}

                {/* Loading Indicator */}
                <div ref={loadingRef} className="grid w-full gap-2">
                    {isPending && Array.from({ length: 5 }).map((_, idx) => <MusicTrackCardSkeleton key={idx} />)}
                </div>
            </div>

            {/* Copyrights Section */}
            <footer className="text-text-secondary mt-8 text-xs sm:text-sm">
                <time dateTime={album.release_date}>Released: {new Date(album.release_date).toDateString()}</time>
                <p className="whitespace-pre-line" role="contentinfo">
                    {album.copyrights.map((c) => c.text).join('\n')}
                </p>
            </footer>
        </>
    );
};

export default MusicSpotifyAlbum;
