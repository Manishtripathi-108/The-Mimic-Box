'use client';

import { useEffect, useRef } from 'react';

import { getSpotifyData } from '@/actions/spotify.actions';
import MusicPlaylistCard from '@/app/(protected)/spotify/_components/MusicPlaylistCard';
import { T_SpotifySimplifiedPlaylist } from '@/lib/types/spotify.types';

const MusicPlaylist = ({ playlists }: { playlists: T_SpotifySimplifiedPlaylist[] }) => {
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleCardClick = async (event: MouseEvent) => {
            if (event.target instanceof HTMLElement) {
                const href = event.target.getAttribute('data-href');
                if (href) {
                    const response = await getSpotifyData(href);
                    console.log('Playlist tracks:', response);
                }
            }
        };

        const board = gridRef.current;
        board?.addEventListener('click', handleCardClick);

        return () => board?.removeEventListener('click', handleCardClick);
    }, [playlists]);

    if (!playlists || playlists.length === 0) {
        return <div className="text-text-secondary">No playlists available</div>;
    }

    return (
        <section className="text-text-secondary">
            <h2 className="text-highlight font-alegreya mb-2 text-2xl font-semibold tracking-wide">Playlist</h2>
            <div ref={gridRef} className="flex flex-col gap-2 sm:gap-4">
                {playlists.map((Playlist, index) => (
                    <MusicPlaylistCard
                        key={index}
                        name={Playlist.name}
                        description={Playlist.description}
                        imageUrl={Playlist.images[0].url}
                        tracksHref={Playlist.tracks.href}
                    />
                ))}
            </div>
        </section>
    );
};

export default MusicPlaylist;
