import { MusicCardSkeleton } from '@/app/(protected)/music/_components/MusicCard';

const Loading = () => {
    return (
        <section className="text-text-secondary">
            <h2 className="text-highlight font-alegreya mb-2 text-2xl font-semibold tracking-wide">Albums</h2>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] place-items-center gap-4 *:w-full">
                {Array.from({ length: 20 }).map((_, idx) => (
                    <MusicCardSkeleton key={idx} />
                ))}
            </div>
        </section>
    );
};

export default Loading;
