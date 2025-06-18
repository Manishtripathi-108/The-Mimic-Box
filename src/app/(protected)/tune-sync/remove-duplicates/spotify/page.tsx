import { Metadata } from 'next';

import { getSpotifyUserPlaylists } from '@/actions/spotify.actions';
import ErrorCard from '@/components/layout/ErrorCard';
import { NoDataCard } from '@/components/layout/NoDataCard';
import LinkCard from '@/components/ui/LinkCard';
import { APP_ROUTES } from '@/constants/routes.constants';

export const metadata: Metadata = {
    title: 'Remove Duplicates - Spotify',
    description: 'Remove duplicate tracks from your Spotify playlists easily.',
    openGraph: {
        title: 'Remove Duplicates - Spotify',
        description: 'Remove duplicate tracks from your Spotify playlists easily.',
        url: APP_ROUTES.TUNE_SYNC.REMOVE_DUPLICATES.SPOTIFY,
    },
    twitter: {
        title: 'Remove Duplicates - Spotify',
        description: 'Remove duplicate tracks from your Spotify playlists easily.',
    },
};

const Page = async () => {
    const res = await getSpotifyUserPlaylists();

    if (!res.success || !res.payload) {
        return <ErrorCard message={res.message || 'Failed to fetch playlists'} />;
    }

    const sortedPlaylists = res.payload.items.sort((a, b) => a.name.localeCompare(b.name));

    return (
        <main className="bg-primary p-2 sm:p-6">
            <h1 className="text-highlight font-alegreya mb-6 text-center text-3xl font-bold sm:text-4xl">Choose a Playlists to remove duplicates</h1>
            {sortedPlaylists.length === 0 ? (
                <NoDataCard className="w-full max-w-2xl" message="You don't have any playlists yet." />
            ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4 *:w-full">
                    {sortedPlaylists.map((playlist) => (
                        <LinkCard
                            key={playlist.id}
                            icon="open"
                            title={playlist.name}
                            sub={`${playlist.tracks.total} tracks`}
                            thumbnailUrl={playlist.images[0].url}
                            href={APP_ROUTES.TUNE_SYNC.REMOVE_DUPLICATES.SPOTIFY_PLAYLIST(playlist.id)}
                        />
                    ))}
                </div>
            )}
        </main>
    );
};

export default Page;
