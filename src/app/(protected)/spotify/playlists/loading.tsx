export default function PlaylistGridSkeleton() {
    return (
        <section className="px-4 py-6">
            <h1 className="text-highlight font-alegreya mb-6 text-center text-3xl font-bold sm:text-4xl">Your Playlists</h1>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] place-items-center gap-4 *:w-full">
                {Array.from({ length: 20 }).map((_, idx) => (
                    <div key={idx} className="flex animate-pulse flex-col">
                        {/* Cover Placeholder */}
                        <div className="bg-secondary aspect-square w-full rounded-xl" />

                        {/* Title */}
                        <div className="bg-secondary mt-3 h-4 w-24 rounded" />

                        {/* Subtitle */}
                        <div className="bg-secondary mt-1 h-3 w-16 rounded" />
                    </div>
                ))}
            </div>
        </section>
    );
}
