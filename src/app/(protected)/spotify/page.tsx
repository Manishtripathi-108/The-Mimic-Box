import React from 'react';

import { getSpotifyCurrentUserPlaylists } from '@/actions/spotify.actions';
import MusicCardGrid from '@/app/(protected)/spotify/_components/MusicCardGrid';
import MusicCategoryList from '@/app/(protected)/spotify/_components/MusicCategoryList';
import MusicPlaylist from '@/app/(protected)/spotify/_components/MusicPlaylist';

const recentlyPlayed = Array.from({ length: 15 }).map((_, i) => ({
    title: `Playlist #${i + 1}`,
    artist: `Artist ${i + 1}`,
    id: `${i.toString().padStart(2, '0')}0X0X0X0X`,
    thumbnailUrl: `https://picsum.photos/200?random=${i}`,
}));

const page = async () => {
    const res = await getSpotifyCurrentUserPlaylists();
    console.log('Playlists:', res);

    if (!res.success) {
        return <div className="text-text-secondary">Error fetching playlists</div>;
    }
    return (
        <div className="@container flex flex-col gap-6 p-4 sm:p-6">
            <MusicCategoryList />

            <div className="grid gap-8 @3xl:grid-cols-3">
                <MusicPlaylist playlists={res.payload.items} />
                <div className="-ml-4 flex flex-col gap-6 @3xl:col-span-2">
                    <MusicCardGrid title="Recently Played" items={recentlyPlayed} />
                    <MusicCardGrid title="Top" items={recentlyPlayed} />
                </div>
            </div>
        </div>
    );
};

export default page;
