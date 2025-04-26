import { getSpotifyTopArtists } from '@/actions/spotify.actions';
import HorizontalScrollSection from '@/app/(protected)/spotify/_components/HorizontalScrollSection';
import MusicCard from '@/app/(protected)/spotify/_components/MusicCard';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { APP_ROUTES } from '@/constants/routes.constants';

const TopArtists = async () => {
    const res = await getSpotifyTopArtists();
    if (!res.success || !res.payload) {
        return <ErrorMessage message={res.message || 'Failed to fetch top artists'} />;
    }

    return (
        <HorizontalScrollSection title="Top Artists">
            {res.payload.items.map((item) => (
                <MusicCard key={item.id} title={item.name} thumbnailUrl={item.images[0].url} href={APP_ROUTES.SPOTIFY_ARTISTS(item.id)} />
            ))}
        </HorizontalScrollSection>
    );
};

export default TopArtists;
