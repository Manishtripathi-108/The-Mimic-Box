import { LinkCardSkeleton } from '@/components/ui/LinkCard';

const Loading = () => {
    return (
        <section>
            <h1 className="text-highlight font-alegreya mb-6 text-center text-3xl font-bold sm:text-4xl">Your Playlists</h1>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] place-items-center gap-4 *:w-full">
                {Array.from({ length: 20 }).map((_, idx) => (
                    <LinkCardSkeleton key={idx} />
                ))}
            </div>
        </section>
    );
};

export default Loading;
