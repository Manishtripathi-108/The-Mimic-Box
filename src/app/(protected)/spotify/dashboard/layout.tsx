const MusicDashboardLayout = async ({
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
        <div className="@container flex flex-col gap-6 p-4 sm:p-6">
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

export default MusicDashboardLayout;
