import { spotifyGetRecentTracks } from '@/actions/spotify.actions';
import MusicTrackCard from '@/app/(protected)/music/_components/MusicTrackCard';
import ErrorMessage from '@/components/ui/form/ErrorMessage';
import APP_ROUTES from '@/constants/routes/app.routes';

const Page = async () => {
    const res = await spotifyGetRecentTracks(6);

    if (!res.success || !res.payload) {
        return <ErrorMessage message={res.message || 'Failed to fetch recently played tracks'} />;
    }

    const playHistory = res.payload.items;

    return (
        <section className="text-text-secondary">
            <h2 className="text-highlight font-alegreya mb-2 text-2xl font-semibold tracking-wide">Recently Played</h2>
            {playHistory.length === 0 ? (
                <p>No recently played tracks found.</p>
            ) : (
                <div className="flex flex-col gap-2">
                    {playHistory.map((item, index) => {
                        const track = item.track;
                        return (
                            <MusicTrackCard
                                key={`${track.id}-${index}`}
                                id={track.id}
                                title={track.name}
                                link={APP_ROUTES.MUSIC.TRACKS(track.id)}
                                duration_ms={track.duration_ms}
                                imageUrl={track.album.images[0]?.url}
                                artists={track.artists.map((artist) => ({
                                    id: artist.id,
                                    name: artist.name,
                                    link: APP_ROUTES.MUSIC.ARTISTS(artist.id),
                                }))}
                                album={{
                                    id: track.album.id,
                                    name: track.album.name,
                                    link: APP_ROUTES.MUSIC.ALBUMS(track.album.id),
                                }}
                                context={{ type: 'track', id: track.id, source: 'spotify' }}
                            />
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default Page;
