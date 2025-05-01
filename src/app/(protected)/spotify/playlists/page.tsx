import { getSpotifyCurrentUserPlaylists } from '@/actions/spotify.actions';
import MusicCard from '@/app/(protected)/spotify/_components/MusicCard';
import { NoDataCard } from '@/components/layout/NoDataCard';
import { APP_ROUTES } from '@/constants/routes.constants';

const UserPlaylistsPage = async () => {
    const res = await getSpotifyCurrentUserPlaylists();

    if (!res.success || !res.payload) {
        return <NoDataCard message={res.message || 'Failed to fetch playlists'} />;
    }

    const sortedPlaylists = res.payload.items.sort((a, b) => a.name.localeCompare(b.name));

    if (sortedPlaylists.length === 0) {
        return (
            <div className="h-calc-full-height flex items-center justify-center">
                <NoDataCard className="w-full max-w-2xl" message="You don’t have any playlists yet." />
            </div>
        );
    }

    return (
        <section className="p-6">
            <h1 className="text-highlight font-alegreya mb-6 text-center text-3xl font-bold sm:text-4xl">Your Playlists</h1>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] place-items-center gap-4 *:w-full">
                {sortedPlaylists.map((playlist) => (
                    <MusicCard
                        key={playlist.id}
                        title={playlist.name}
                        sub={`${playlist.tracks.total} tracks`}
                        thumbnailUrl={playlist.images[0].url}
                        href={APP_ROUTES.SPOTIFY_PLAYLIST(playlist.id)}
                    />
                ))}
            </div>
        </section>
    );
};

export default UserPlaylistsPage;
