import { LinkCardSkeleton } from '@/components/ui/LinkCard';

const Loading = () => {
    return (
        <main className="bg-primary p-2 sm:p-6">
            <h1 className="text-highlight font-alegreya mb-6 text-center text-3xl font-bold sm:text-4xl">Choose a Playlists to remove duplicates</h1>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] place-items-center gap-4 *:w-full">
                {Array.from({ length: 20 }).map((_, idx) => (
                    <LinkCardSkeleton key={idx} />
                ))}
            </div>
        </main>
    );
};

export default Loading;
