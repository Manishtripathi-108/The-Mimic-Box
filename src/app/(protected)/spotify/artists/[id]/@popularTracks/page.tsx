import { getSpotifyArtistTopTracks } from '@/actions/spotify.actions';
import MusicTrackCard from '@/app/(protected)/spotify/_components/MusicTrackCard';
import ErrorMessage from '@/components/ui/ErrorMessage';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const res = await getSpotifyArtistTopTracks(id);

    if (!res.success || !res.payload) {
        return <ErrorMessage message={res.message || 'Failed to fetch popular tracks'} />;
    }

    const tracks = res.payload;

    return (
        <section className="text-text-secondary">
            <h2 className="text-highlight font-alegreya mb-2 text-2xl font-semibold tracking-wide">Popular Tracks</h2>
            {tracks.length === 0 ? (
                <p>No tracks found.</p>
            ) : (
                <div className="flex flex-col gap-2">
                    {tracks.map((item, index) => (
                        <MusicTrackCard key={item.id + index} track={item} context={{ type: 'artist', id: id, name: item.artists[0].name }} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default Page;
