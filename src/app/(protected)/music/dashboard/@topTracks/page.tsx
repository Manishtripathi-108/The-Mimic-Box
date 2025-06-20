import { spotifyGetUserTopTracks } from '@/actions/spotify.actions';
import ErrorMessage from '@/components/ui/ErrorMessage';
import HorizontalScrollSection from '@/components/ui/HorizontalScrollSection';
import LinkCard from '@/components/ui/LinkCard';
import APP_ROUTES from '@/constants/routes/app.routes';

const Page = async () => {
    const res = await spotifyGetUserTopTracks();
    if (!res.success || !res.payload) {
        return <ErrorMessage message={res.message || 'Failed to fetch top tracks'} />;
    }

    return (
        <HorizontalScrollSection className="-ml-4" title="Top Tracks">
            {res.payload.items.map((item) => (
                <LinkCard
                    key={item.id}
                    icon="play"
                    title={item.name}
                    thumbnailUrl={item.album.images[0].url}
                    href={APP_ROUTES.MUSIC.TRACKS(item.id)}
                />
            ))}
        </HorizontalScrollSection>
    );
};

export default Page;
