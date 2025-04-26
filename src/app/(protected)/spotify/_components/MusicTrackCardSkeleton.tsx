export default function MusicTrackCardSkeleton() {
    return (
        <div className="from-secondary to-tertiary shadow-floating-xs @container flex animate-pulse items-center justify-between gap-4 rounded-2xl bg-linear-150 from-15% to-85% p-3 pr-5">
            <div className="flex w-full items-center gap-3">
                {/* Play/Pause Button Skeleton */}
                <div className="bg-muted size-7 shrink-0 rounded-full" />

                <div className="flex items-center gap-3">
                    {/* Album Image Skeleton */}
                    <div className="bg-muted shrink-0 rounded-xl" style={{ width: 50, height: 50 }} />

                    {/* Track Info Skeleton */}
                    <div className="flex flex-col gap-1">
                        <div className="bg-muted h-4 w-32 rounded" />
                        <div className="bg-muted h-3 w-24 rounded" />
                    </div>
                </div>
            </div>

            {/* Right Side (Album Name and Duration) */}
            <div className="flex items-center justify-end gap-4 text-sm @sm:w-full @sm:justify-between">
                <div className="bg-muted hidden h-3 w-24 rounded @sm:block" />
                <div className="bg-muted h-3 w-10 rounded" />
            </div>
        </div>
    );
}
