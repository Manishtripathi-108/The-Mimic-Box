'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';

import Link from 'next/link';

import toast from 'react-hot-toast';

import { spotifyGetByUrl } from '@/actions/spotify.actions';
import MusicActionBtns from '@/app/(protected)/music/_components/MusicActionBtns';
import MusicMediaHeader from '@/app/(protected)/music/_components/MusicMediaHeader';
import MusicTrackCard from '@/app/(protected)/music/_components/MusicTrackCard';
import MusicTrackCardSkeleton from '@/app/(protected)/music/_components/skeletons/MusicTrackCardSkeleton';
import APP_ROUTES from '@/constants/routes/app.routes';
import { T_SpotifyPaging, T_SpotifyPlaylist, T_SpotifyPlaylistTrack } from '@/lib/types/spotify.types';

type Props = {
    playlist: T_SpotifyPlaylist;
};

const MusicSpotifyPlaylist = ({ playlist }: Props) => {
    const { name, description, images, owner, tracks: initialTracks } = playlist;

    const [playlistTracks, setPlaylistTracks] = useState(initialTracks.items);
    const [nextUrl, setNextUrl] = useState(initialTracks.next);
    const [isPending, startTransition] = useTransition();
    const loadingRef = useRef<HTMLDivElement>(null);

    const fetchNextTracks = useCallback(async () => {
        if (!nextUrl) return;

        const res = await spotifyGetByUrl<T_SpotifyPaging<T_SpotifyPlaylistTrack>>(nextUrl);
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

            <MusicActionBtns context={{ id: playlist.id, type: 'playlist', source: 'spotify' }} className="mt-4" />

            <div className="mt-6 grid w-full gap-2">
                {tracks.map((t, idx) => (
                    <MusicTrackCard
                        key={`${t.id}-${idx}`}
                        id={t.id}
                        title={t.name}
                        link={APP_ROUTES.MUSIC.TRACKS(t.id)}
                        duration_ms={t.duration_ms}
                        imageUrl={t.album.images[0]?.url}
                        artists={t.artists.map((artist) => ({
                            id: artist.id,
                            name: artist.name,
                            link: APP_ROUTES.MUSIC.ARTISTS(artist.id),
                        }))}
                        album={{
                            id: t.album.id,
                            name: t.album.name,
                            link: APP_ROUTES.MUSIC.ALBUMS(t.album.id),
                        }}
                        context={{ id: playlist.id, type: 'playlist', source: 'spotify' }}
                    />
                ))}

                <div ref={loadingRef} className="grid w-full gap-2">
                    {isPending && Array.from({ length: 5 }).map((_, idx) => <MusicTrackCardSkeleton key={`skeleton-${idx}`} />)}
                </div>
            </div>
        </>
    );
};

export default MusicSpotifyPlaylist;
