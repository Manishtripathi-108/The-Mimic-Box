import { MusicCardSkeleton } from '@/app/(protected)/music/_components/MusicCard';
import { MusicMediaHeaderSkeleton } from '@/app/(protected)/music/_components/MusicMediaHeader';
import MusicTrackCardSkeleton from '@/app/(protected)/music/_components/skeletons/MusicTrackCardSkeleton';

const loading = () => {
    const skeletonArray = Array.from({ length: 10 });
    return (
        <>
            <MusicMediaHeaderSkeleton />

            <section className="text-text-secondary">
                <h2 className="text-highlight font-alegreya mb-2 text-2xl font-semibold tracking-wide">Albums</h2>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] place-items-center gap-4 *:w-full">
                    {skeletonArray.map((_, idx) => (
                        <MusicCardSkeleton key={idx} />
                    ))}
                </div>
            </section>

            <section className="text-text-secondary">
                <h2 className="text-highlight font-alegreya mb-2 text-2xl font-semibold tracking-wide">Popular Tracks</h2>

                <div className="flex flex-col gap-2">
                    {skeletonArray.map((_, idx) => (
                        <MusicTrackCardSkeleton key={idx} />
                    ))}
                </div>
            </section>

            <section className="text-text-secondary">
                <h2 className="text-highlight font-alegreya mb-2 text-2xl font-semibold tracking-wide">Single Albums</h2>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] place-items-center gap-4 *:w-full">
                    {skeletonArray.map((_, idx) => (
                        <MusicCardSkeleton key={idx} />
                    ))}
                </div>
            </section>

            <section className="text-text-secondary">
                <h2 className="text-highlight font-alegreya mb-2 text-2xl font-semibold tracking-wide">Similar Artists</h2>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] place-items-center gap-4 *:w-full">
                    {skeletonArray.map((_, idx) => (
                        <MusicCardSkeleton key={idx} />
                    ))}
                </div>
            </section>
        </>
    );
};
export default loading;
