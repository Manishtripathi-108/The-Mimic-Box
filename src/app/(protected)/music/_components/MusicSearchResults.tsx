'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { saavnSearchAlbums, saavnSearchArtists, saavnSearchPlaylists, saavnSearchSongs } from '@/actions/saavn.actions';
import MusicTrackCard from '@/app/(protected)/music/_components/MusicTrackCard';
import Icon from '@/components/ui/Icon';
import APP_ROUTES from '@/constants/routes/app.routes';
import { T_SaavnSearchAlbum } from '@/lib/types/saavn/albums.types';
import { T_SaavnSearchArtist } from '@/lib/types/saavn/search.types';
import { T_SaavnSearchSong } from '@/lib/types/saavn/search.types';
import { T_SaavnSearchPlaylist } from '@/lib/types/saavn/search.types';

type Tab = 'songs' | 'albums' | 'artists' | 'playlists';

const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: 'songs', label: 'Songs', icon: 'music' },
    { key: 'albums', label: 'Albums', icon: 'album' },
    { key: 'artists', label: 'Artists', icon: 'artist' },
    { key: 'playlists', label: 'Playlists', icon: 'playlist' },
];

const MusicSearchResults = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get('q') || '';

    const [activeTab, setActiveTab] = useState<Tab>('songs');
    const [isPending, startTransition] = useTransition();

    const [songs, setSongs] = useState<T_SaavnSearchSong | null>(null);
    const [albums, setAlbums] = useState<T_SaavnSearchAlbum | null>(null);
    const [artists, setArtists] = useState<T_SaavnSearchArtist | null>(null);
    const [playlists, setPlaylists] = useState<T_SaavnSearchPlaylist | null>(null);

    const fetchResults = useCallback(
        (tab: Tab, searchQuery: string) => {
            if (!searchQuery.trim()) return;

            startTransition(async () => {
                switch (tab) {
                    case 'songs': {
                        const res = await saavnSearchSongs({ query: searchQuery, limit: 30 });
                        if (res.success) setSongs(res.payload);
                        break;
                    }
                    case 'albums': {
                        const res = await saavnSearchAlbums({ query: searchQuery, limit: 30 });
                        if (res.success) setAlbums(res.payload);
                        break;
                    }
                    case 'artists': {
                        const res = await saavnSearchArtists({ query: searchQuery, limit: 30 });
                        if (res.success) setArtists(res.payload);
                        break;
                    }
                    case 'playlists': {
                        const res = await saavnSearchPlaylists({ query: searchQuery, limit: 30 });
                        if (res.success) setPlaylists(res.payload);
                        break;
                    }
                }
            });
        },
        [startTransition]
    );

    useEffect(() => {
        if (query) fetchResults(activeTab, query);
    }, [query, activeTab, fetchResults]);

    if (!query) {
        return (
            <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 py-12 text-center">
                <Icon icon="search" className="text-text-secondary size-16 opacity-40" />
                <h2 className="text-text-secondary text-lg">Enter a search query to find music</h2>
            </section>
        );
    }

    return (
        <section className="flex w-full flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <p className="text-text-secondary text-sm">Search results for</p>
                <h1 className="text-highlight font-alegreya text-2xl font-bold sm:text-3xl">&ldquo;{query}&rdquo;</h1>
            </div>

            {/* Tabs */}
            <nav className="scrollbar-thin flex gap-2 overflow-x-auto border-b border-white/10 pb-1">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === tab.key
                                ? 'bg-highlight text-on-highlight'
                                : 'text-text-secondary hover:bg-secondary hover:text-text-primary'
                        }`}>
                        {tab.label}
                    </button>
                ))}
            </nav>

            {/* Content */}
            <div className="min-h-[200px]">
                {isPending ? (
                    <div className="text-text-secondary flex h-40 items-center justify-center gap-2">
                        <Icon icon="loading" className="size-8" />
                        Searching...
                    </div>
                ) : (
                    <>
                        {activeTab === 'songs' && <SongsTab songs={songs} />}
                        {activeTab === 'albums' && <AlbumsTab albums={albums} />}
                        {activeTab === 'artists' && <ArtistsTab artists={artists} />}
                        {activeTab === 'playlists' && <PlaylistsTab playlists={playlists} />}
                    </>
                )}
            </div>
        </section>
    );
};

/* ---------------------------------- Songs --------------------------------- */
const SongsTab = ({ songs }: { songs: T_SaavnSearchSong | null }) => {
    if (!songs || songs.results.length === 0) return <EmptyState message="No songs found" />;

    return (
        <div className="grid w-full gap-2">
            {songs.results.map((track, idx) => (
                <MusicTrackCard
                    key={`${track.id}-${idx}`}
                    id={track.id}
                    title={track.name}
                    link={APP_ROUTES.MUSIC.JS.TRACKS(track.id)}
                    duration_ms={(track.duration || 0) * 1000}
                    imageUrl={track.image?.[1]?.url}
                    artists={track.artists.primary.map((artist) => ({
                        id: artist.id,
                        name: artist.name,
                        link: APP_ROUTES.MUSIC.JS.ARTISTS(artist.id),
                    }))}
                    album={
                        track.album?.id
                            ? {
                                  id: track.album.id,
                                  name: track.album.name || 'Unknown Album',
                                  link: APP_ROUTES.MUSIC.JS.ALBUMS(track.album.id),
                              }
                            : undefined
                    }
                    context={{ type: 'track', id: track.id, source: 'saavn' }}
                />
            ))}
        </div>
    );
};

/* --------------------------------- Albums --------------------------------- */
const AlbumsTab = ({ albums }: { albums: T_SaavnSearchAlbum | null }) => {
    if (!albums || albums.results.length === 0) return <EmptyState message="No albums found" />;

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {albums.results.map((album) => (
                <Link
                    key={album.id}
                    href={APP_ROUTES.MUSIC.JS.ALBUMS(album.id)}
                    className="from-secondary to-tertiary group flex flex-col gap-3 rounded-2xl bg-linear-120 from-15% to-85% p-3 transition-transform hover:scale-[1.03]">
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                        {album.image?.[2]?.url ? (
                            <Image src={album.image[2].url} alt={album.name} fill className="object-cover" />
                        ) : (
                            <div className="bg-secondary flex size-full items-center justify-center">
                                <Icon icon="audio" className="text-text-secondary size-12" />
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-text-primary truncate text-sm font-semibold">{album.name}</p>
                        <p className="text-text-secondary truncate text-xs">
                            {album.year && `${album.year} · `}
                            {album.artists?.primary?.map((a) => a.name).join(', ') || 'Unknown Artist'}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    );
};

/* --------------------------------- Artists -------------------------------- */
const ArtistsTab = ({ artists }: { artists: T_SaavnSearchArtist | null }) => {
    if (!artists || artists.results.length === 0) return <EmptyState message="No artists found" />;

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {artists.results.map((artist) => (
                <Link
                    key={artist.id}
                    href={APP_ROUTES.MUSIC.JS.ARTISTS(artist.id)}
                    className="from-secondary to-tertiary group flex flex-col items-center gap-3 rounded-2xl bg-linear-120 from-15% to-85% p-4 transition-transform hover:scale-[1.03]">
                    <div className="relative aspect-square w-full overflow-hidden rounded-full">
                        {artist.image?.[2]?.url ? (
                            <Image src={artist.image[2].url} alt={artist.name} fill className="object-cover" />
                        ) : (
                            <div className="bg-secondary flex size-full items-center justify-center rounded-full">
                                <Icon icon="person" className="text-text-secondary size-12" />
                            </div>
                        )}
                    </div>
                    <p className="text-text-primary w-full truncate text-center text-sm font-semibold">{artist.name}</p>
                </Link>
            ))}
        </div>
    );
};

/* -------------------------------- Playlists ------------------------------- */
const PlaylistsTab = ({ playlists }: { playlists: T_SaavnSearchPlaylist | null }) => {
    if (!playlists || playlists.results.length === 0) return <EmptyState message="No playlists found" />;

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {playlists.results.map((playlist) => (
                <Link
                    key={playlist.id}
                    href={APP_ROUTES.MUSIC.JS.PLAYLISTS(playlist.id)}
                    className="from-secondary to-tertiary group flex flex-col gap-3 rounded-2xl bg-linear-120 from-15% to-85% p-3 transition-transform hover:scale-[1.03]">
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                        {playlist.image?.[2]?.url ? (
                            <Image src={playlist.image[2].url} alt={playlist.name} fill className="object-cover" />
                        ) : (
                            <div className="bg-secondary flex size-full items-center justify-center">
                                <Icon icon="playlist" className="text-text-secondary size-12" />
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-text-primary truncate text-sm font-semibold">{playlist.name}</p>
                        {playlist.songCount != null && <p className="text-text-secondary text-xs">{playlist.songCount} songs</p>}
                    </div>
                </Link>
            ))}
        </div>
    );
};

/* --------------------------------- Empty ---------------------------------- */
const EmptyState = ({ message }: { message: string }) => (
    <div className="text-text-secondary flex h-40 flex-col items-center justify-center gap-2 text-center">
        <Icon icon="search" className="size-10 opacity-40" />
        <p>{message}</p>
    </div>
);

export default MusicSearchResults;
