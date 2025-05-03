import { getSpotifyRecentlyPlayedTracks } from '@/actions/spotify.actions';
import MusicTrackCard from '@/app/(protected)/spotify/_components/MusicTrackCard';
import ErrorMessage from '@/components/ui/ErrorMessage';

const MusicDashboardRecentlyPlayedTracksPage = async () => {
    const res = await getSpotifyRecentlyPlayedTracks(5);

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
                    {playHistory.map((item, index) => (
                        <MusicTrackCard key={item.track.id + index} track={item.track} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default MusicDashboardRecentlyPlayedTracksPage;
