import MusicTrackCardSkeleton from '@/app/(protected)/spotify/_components/MusicTrackCardSkeleton';

const PlaylistPageSkeleton = () => {
    return (
        <main className="min-h-calc-full-height p-2 sm:p-6">
            {/* Mobile Title */}
            <div className="bg-secondary mx-auto h-8 w-40 animate-pulse rounded sm:hidden" />

            {/* Top Section */}
            <section className="text-text-primary mt-4 mb-8 flex animate-pulse flex-col gap-6 px-4 sm:flex-row sm:items-end">
                {/* Cover Image Skeleton */}
                <div className="shadow-floating-sm bg-tertiary mx-auto aspect-square w-full max-w-60 shrink-0 rounded-xl p-2 sm:mx-0" />

                {/* Right Side Info */}
                <div className="flex flex-col gap-3">
                    {/* Desktop Title */}
                    <div className="bg-secondary hidden h-10 w-60 rounded sm:block md:h-12 lg:h-16" />

                    {/* Description */}
                    <div className="bg-secondary h-4 w-64 rounded sm:w-80" />

                    {/* Owner Info */}
                    <div className="text-text-secondary flex gap-2 text-sm">
                        <div className="bg-secondary h-4 w-24 rounded" />
                        <div className="bg-secondary h-4 w-16 rounded" />
                    </div>
                </div>
            </section>

            {/* Action Buttons */}
            <div className="mx-auto flex animate-pulse items-end justify-center gap-x-6 px-4 sm:justify-between">
                <div className="bg-secondary size-9 rounded-full" />
                <div className="bg-secondary size-14 rounded-full" />
                <div className="bg-secondary size-9 rounded-full" />
            </div>

            {/* Songs List */}
            <div className="mt-6 grid w-full gap-2">
                {Array.from({ length: 5 }).map((_, idx) => (
                    <MusicTrackCardSkeleton key={idx} />
                ))}
            </div>
        </main>
    );
};

export default PlaylistPageSkeleton;
