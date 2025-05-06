import { getSpotifyTopArtists } from '@/actions/spotify.actions';
import MusicCard from '@/app/(protected)/spotify/_components/MusicCard';
import ErrorMessage from '@/components/ui/ErrorMessage';
import HorizontalScrollSection from '@/components/ui/HorizontalScrollSection';
import { APP_ROUTES } from '@/constants/routes.constants';

const Page = async () => {
    const res = await getSpotifyTopArtists();
    if (!res.success || !res.payload) {
        return <ErrorMessage message={res.message || 'Failed to fetch top artists'} />;
    }

    return (
        <HorizontalScrollSection title="Top Artists">
            {res.payload.items.map((item) => (
                <MusicCard key={item.id} title={item.name} thumbnailUrl={item.images[0].url} href={APP_ROUTES.SPOTIFY.ARTISTS(item.id)} />
            ))}
        </HorizontalScrollSection>
    );
};

export default Page;
