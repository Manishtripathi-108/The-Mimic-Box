import { getSpotifyUserTopArtists } from '@/actions/spotify.actions';
import ErrorMessage from '@/components/ui/ErrorMessage';
import HorizontalScrollSection from '@/components/ui/HorizontalScrollSection';
import LinkCard from '@/components/ui/LinkCard';
import { APP_ROUTES } from '@/constants/routes.constants';

const Page = async () => {
    const res = await getSpotifyUserTopArtists();
    if (!res.success || !res.payload) {
        return <ErrorMessage message={res.message || 'Failed to fetch top artists'} />;
    }

    return (
        <HorizontalScrollSection title="Top Artists">
            {res.payload.items.map((item) => (
                <LinkCard key={item.id} icon='play' title={item.name} thumbnailUrl={item.images[0].url} href={APP_ROUTES.MUSIC.ARTISTS(item.id)} />
            ))}
        </HorizontalScrollSection>
    );
};

export default Page;
