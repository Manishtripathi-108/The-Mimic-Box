import React, { Suspense } from 'react';

import { getSpotifyCurrentUserPlaylists, getSpotifyRecentlyPlayedTracks } from '@/actions/spotify.actions';
import MusicCardGrid from '@/app/(protected)/spotify/_components/MusicCardGrid';
import MusicCategoryList from '@/app/(protected)/spotify/_components/MusicCategoryList';
import MusicPlaylist from '@/app/(protected)/spotify/_components/MusicPlaylist';

const page = async () => {
    const res = await getSpotifyCurrentUserPlaylists();
    let recentlyPlayed = null;
    const recentlyPlayedRes = await getSpotifyRecentlyPlayedTracks();
    if (recentlyPlayedRes.success) {
        const tracks = recentlyPlayedRes.payload.items.map((item) => item.track);
        recentlyPlayed = tracks.map((track, index) => ({
            title: track.name,
            id: track.id + index,
            thumbnailUrl: track.album.images[0]?.url,
            hrefId: track.id,
        }));
    }

    if (!res.success) {
        return <div className="text-text-secondary">Error fetching playlists</div>;
    }
    return (
        <div className="@container flex flex-col gap-6 p-4 sm:p-6">
            <MusicCategoryList />

            <div className="grid gap-8 @3xl:grid-cols-3">
                <MusicPlaylist playlists={res.payload.items} />
                <div className="-ml-4 flex w-[calc(100vw-1.5rem)] flex-col gap-6 @3xl:col-span-2 @3xl:w-auto">
                    <Suspense fallback={<div>Loading...</div>}>
                        {recentlyPlayed && <MusicCardGrid title="Recently Played" items={recentlyPlayed} />}
                    </Suspense>
                    <Suspense fallback={<div>Loading...</div>}>{recentlyPlayed && <MusicCardGrid title="Top" items={recentlyPlayed} />}</Suspense>
                </div>
            </div>
        </div>
    );
};

export default page;
