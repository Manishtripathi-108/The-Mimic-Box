import { getSpotifyArtistDetails } from '@/actions/spotify.actions';
import MusicMediaHeader from '@/app/(protected)/spotify/_components/MusicMediaHeader';
import ErrorMessage from '@/components/ui/ErrorMessage';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const res = await getSpotifyArtistDetails(id);

    if (!res.success || !res.payload) {
        return <ErrorMessage message={res.message || 'Failed to fetch recently played tracks'} />;
    }

    const { name, images, followers, popularity } = res.payload;

    return <MusicMediaHeader title={name} coverImage={images?.[0]?.url} metadata={`Followers: ${followers.total} | Popularity: ${popularity}%`} />;
};

export default Page;
