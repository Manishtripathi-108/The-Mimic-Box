'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';

import Link from 'next/link';

import toast from 'react-hot-toast';

import { getSpotifyData } from '@/actions/spotify.actions';
import MusicActionBtns from '@/app/(protected)/spotify/_components/MusicActionBtns';
import MusicMediaHeader from '@/app/(protected)/spotify/_components/MusicMediaHeader';
import MusicTrackCard, { MusicTrackCardSkeleton } from '@/app/(protected)/spotify/_components/MusicTrackCard';
import { T_SpotifyPaging, T_SpotifyPlaylist, T_SpotifyPlaylistTrack } from '@/lib/types/spotify.types';

type Props = {
    playlist: T_SpotifyPlaylist;
};

const MusicPlaylist = ({ playlist }: Props) => {
    const { name, description, images, owner, tracks: initialTracks } = playlist;

    const [playlistTracks, setPlaylistTracks] = useState(initialTracks.items);
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

        setPlaylistTracks((prev) => [...prev, ...res.payload.items]);
        setNextUrl(res.payload.next);
    }, [nextUrl]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && nextUrl) {
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

    const tracks = useMemo(
        () => playlistTracks.map(({ track }) => (track && !('show' in track) ? track : null)).filter((t) => t !== null),
        [playlistTracks]
    );

    return (
        <>
            <MusicMediaHeader title={name} description={description} coverImage={images?.[0]?.url} metadata={`${initialTracks.total} Songs`}>
                <>
                    By:&nbsp;
                    <Link href={owner.external_urls.spotify} className="text-text-primary hover:underline">
                        {owner.display_name}
                    </Link>
                </>
            </MusicMediaHeader>

            <MusicActionBtns context={{ id: playlist.id, type: 'playlist', name }} spotifyTracks={tracks} className="mt-4" />

            <div className="mt-6 grid w-full gap-2">
                {tracks.map((track, idx) => (
                    <MusicTrackCard key={track.id + idx} track={track} />
                ))}

                <div ref={loadingRef} className="grid w-full gap-2">
                    {isPending && Array.from({ length: 5 }).map((_, idx) => <MusicTrackCardSkeleton key={`skeleton-${idx}`} />)}
                </div>
            </div>
        </>
    );
};

export default MusicPlaylist;
