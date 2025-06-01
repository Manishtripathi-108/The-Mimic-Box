import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Music Dashboard',
    description: 'Your personalized music dashboard with top tracks, playlists, and more.',
    keywords: ['Music', 'Music', 'Dashboard', 'Top Tracks', 'Playlists', 'Recently Played', 'Top Artists', 'Mimic Box Music Dashboard'],
};

const Layout = async ({
    topTracks,
    playlistGrid,
    recentlyPlayedTracks,
    topArtists,
}: {
    topTracks: React.ReactNode;
    playlistGrid: React.ReactNode;
    recentlyPlayedTracks: React.ReactNode;
    topArtists: React.ReactNode;
}) => {
    return (
        <div className="@container flex flex-col gap-6">
            {topTracks}

            <div className="grid gap-8 @3xl:grid-cols-3">
                {recentlyPlayedTracks}
                <div className="-ml-4 flex w-[calc(100vw-1.5rem)] flex-col gap-6 @3xl:col-span-2 @3xl:w-auto">
                    {playlistGrid}
                    {topArtists}
                </div>
            </div>
        </div>
    );
};

export default Layout;
