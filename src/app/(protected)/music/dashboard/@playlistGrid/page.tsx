import { spotifyGetUserPlaylists } from '@/actions/spotify.actions';
import ErrorMessage from '@/components/ui/ErrorMessage';
import HorizontalScrollSection from '@/components/ui/HorizontalScrollSection';
import LinkCard from '@/components/ui/LinkCard';
import APP_ROUTES from '@/constants/routes/app.routes';

const Page = async () => {
    const res = await spotifyGetUserPlaylists();
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
        <HorizontalScrollSection title="Playlists" href={APP_ROUTES.MUSIC.PLAYLISTS}>
            {sortedPlaylists.map((item) => (
                <LinkCard
                    key={item.id}
                    title={item.name}
                    icon="play"
                    sub={`${item.tracks.total} tracks`}
                    thumbnailUrl={item.images[0].url}
                    href={APP_ROUTES.MUSIC.PLAYLIST(item.id)}
                />
            ))}
        </HorizontalScrollSection>
    );
};

export default Page;
