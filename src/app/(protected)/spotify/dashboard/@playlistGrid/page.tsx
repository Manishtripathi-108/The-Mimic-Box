import { getSpotifyUserPlaylists } from '@/actions/spotify.actions';
import MusicCard from '@/app/(protected)/spotify/_components/MusicCard';
import ErrorMessage from '@/components/ui/ErrorMessage';
import HorizontalScrollSection from '@/components/ui/HorizontalScrollSection';
import { APP_ROUTES } from '@/constants/routes.constants';

const Page = async () => {
    const res = await getSpotifyUserPlaylists();
    if (!res.success || !res.payload) {
        return <ErrorMessage message={res.message || 'Failed to fetch playlists'} />;
    }

    const sortedPlaylists = res.payload.items.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        if (aName < bName) return -1;
        if (aName > bName) return 1;
        return 0;
    });

    return (
        <HorizontalScrollSection title="Playlists" href={APP_ROUTES.SPOTIFY.PLAYLISTS}>
            {sortedPlaylists.map((item) => (
                <MusicCard
                    key={item.id}
                    title={item.name}
                    sub={`${item.tracks.total} tracks`}
                    thumbnailUrl={item.images[0].url}
                    href={APP_ROUTES.SPOTIFY.PLAYLIST(item.id)}
                />
            ))}
        </HorizontalScrollSection>
    );
};

export default Page;
