import { Metadata } from 'next';

import { getSpotifyCurrentUserPlaylists } from '@/actions/spotify.actions';
import MusicCard from '@/app/(protected)/spotify/_components/MusicCard';
import ErrorCard from '@/components/layout/ErrorCard';
import { NoDataCard } from '@/components/layout/NoDataCard';
import { APP_ROUTES } from '@/constants/routes.constants';

export const metadata: Metadata = {
    title: 'Your Playlists',
    description: 'Browse your personal playlists including track counts and covers, powered by Mimic.',
    keywords: ['Spotify', 'Playlists', 'Music', 'User Playlists', 'Mimic', 'Music Library'],
};

const Page = async () => {
    const res = await getSpotifyCurrentUserPlaylists();

    if (!res.success || !res.payload) {
        return <ErrorCard message={res.message || 'Failed to fetch playlists'} />;
    }

    const sortedPlaylists = res.payload.items.sort((a, b) => a.name.localeCompare(b.name));

    return (
        <section>
            <h1 className="text-highlight font-alegreya mb-6 text-center text-3xl font-bold sm:text-4xl">Your Playlists</h1>
            {sortedPlaylists.length === 0 ? (
                <NoDataCard className="w-full max-w-2xl" message="You don't have any playlists yet." />
            ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4 *:w-full">
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
            )}
        </section>
    );
};

export default Page;
