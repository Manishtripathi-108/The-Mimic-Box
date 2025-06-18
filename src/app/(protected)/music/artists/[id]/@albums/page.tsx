import { getSpotifyArtistAlbums } from '@/actions/spotify.actions';
import ErrorMessage from '@/components/ui/ErrorMessage';
import LinkCard from '@/components/ui/LinkCard';
import { APP_ROUTES } from '@/constants/routes.constants';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const response = await getSpotifyArtistAlbums(id);

    if (!response.success || !response.payload) {
        return <ErrorMessage message={response.message || 'Failed to fetch artist albums.'} />;
    }

    const albums = response.payload.items;

    return (
        <section className="text-text-secondary">
            <h2 className="text-highlight font-alegreya mb-2 text-2xl font-semibold tracking-wide">Albums</h2>
            {albums.length === 0 ? (
                <p>No albums found.</p>
            ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4 *:w-full">
                    {albums.map((album) => (
                        <LinkCard key={album.id} title={album.name} icon='play' thumbnailUrl={album.images?.[0]?.url} href={APP_ROUTES.MUSIC.ALBUMS(album.id)} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default Page;
