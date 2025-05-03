import { MusicTrackCardSkeleton } from '@/app/(protected)/spotify/_components/MusicTrackCard';

export const MusicDashboardRecentlyPlayedTracksLoading = () => {
    const skeletonArray = Array.from({ length: 5 }); // Show 5 skeleton cards

    return (
        <section className="text-text-secondary">
            <h2 className="text-highlight font-alegreya mb-2 text-2xl font-semibold tracking-wide">Recently Played</h2>

            <div className="flex flex-col gap-2 sm:gap-4">
                {skeletonArray.map((_, idx) => (
                    <MusicTrackCardSkeleton key={idx} />
                ))}
            </div>
        </section>
    );
};

export default MusicDashboardRecentlyPlayedTracksLoading;
