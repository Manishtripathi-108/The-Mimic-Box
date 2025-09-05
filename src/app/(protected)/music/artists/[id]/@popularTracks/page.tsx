import { spotifyGetArtistTopTracks } from '@/actions/spotify.actions';
import MusicTrackCard from '@/app/(protected)/music/_components/MusicTrackCard';
import ErrorAlert from '@/components/ui/form/ErrorAlert';
import APP_ROUTES from '@/constants/routes/app.routes';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const res = await spotifyGetArtistTopTracks(id);

    if (!res.success || !res.payload) {
        return <ErrorAlert text={res.message || 'Failed to fetch popular tracks'} />;
    }

    const tracks = res.payload;

    return (
        <section className="text-text-secondary">
            <h2 className="text-highlight font-alegreya mb-2 text-2xl font-semibold tracking-wide">Popular Tracks</h2>
            {tracks.length === 0 ? (
                <p>No tracks found.</p>
            ) : (
                <div className="flex flex-col gap-2">
                    {tracks.map((t, index) => (
                        <MusicTrackCard
                            key={`${t.id}-${index}`}
                            id={t.id}
                            title={t.name}
                            link={APP_ROUTES.MUSIC.TRACKS(t.id)}
                            duration_ms={t.duration_ms}
                            imageUrl={t.album.images[0]?.url}
                            artists={t.artists.map((artist) => ({
                                id: artist.id,
                                name: artist.name,
                                link: APP_ROUTES.MUSIC.ARTISTS(artist.id),
                            }))}
                            album={{
                                id: t.album.id,
                                name: t.album.name,
                                link: APP_ROUTES.MUSIC.ALBUMS(t.album.id),
                            }}
                            context={{ type: 'artist', id: id, source: 'spotify' }}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default Page;
