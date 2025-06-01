import { getSpotifyUserTopTracks } from '@/actions/spotify.actions';
import MusicCard from '@/app/(protected)/music/_components/MusicCard';
import ErrorMessage from '@/components/ui/ErrorMessage';
import HorizontalScrollSection from '@/components/ui/HorizontalScrollSection';
import { APP_ROUTES } from '@/constants/routes.constants';

const Page = async () => {
    const res = await getSpotifyUserTopTracks();
    if (!res.success || !res.payload) {
        return <ErrorMessage message={res.message || 'Failed to fetch top tracks'} />;
    }

    return (
        <HorizontalScrollSection className="-ml-4" title="Top Tracks">
            {res.payload.items.map((item) => (
                <MusicCard key={item.id} title={item.name} thumbnailUrl={item.album.images[0].url} href={APP_ROUTES.MUSIC.TRACKS(item.id)} />
            ))}
        </HorizontalScrollSection>
    );
};

export default Page;
