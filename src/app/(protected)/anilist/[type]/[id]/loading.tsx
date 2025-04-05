export default function MediaDetailSkeleton() {
    return (
        <div className="bg-primary text-text-primary min-h-calc-full-height animate-pulse">
            {/* Banner Skeleton */}
            <div className="bg-secondary relative h-60 w-full" />

            {/* Content */}
            <div className="mx-auto -mt-32 max-w-6xl px-4 sm:px-8">
                <div className="from-secondary to-tertiary shadow-floating-md relative z-10 rounded-xl bg-linear-150 from-15% to-85% p-6 sm:p-10">
                    {/* Header */}
                    <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                        <div className="bg-primary h-[220px] w-[150px] rounded-md" />
                        <div className="space-y-2">
                            <div className="bg-primary h-7 w-60 rounded" />
                            <div className="bg-primary h-4 w-40 rounded" />
                            <div className="bg-primary mt-2 h-4 w-48 rounded" />
                            <div className="bg-highlight/60 mt-4 h-8 w-32 rounded" />
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="mt-8 grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <div key={i} className="bg-primary h-4 w-32 rounded" />
                        ))}
                    </div>

                    {/* Genres */}
                    <div className="mt-6">
                        <h2 className="text-highlight mb-2 text-lg font-semibold">Genres</h2>
                        <div className="flex flex-wrap gap-2">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="bg-primary h-6 w-20 rounded-full" />
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mt-8 space-y-2">
                        <h2 className="text-highlight mb-2 text-lg font-semibold">Description</h2>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-primary h-4 w-full rounded" />
                        ))}
                    </div>

                    {/* Recommendations */}
                    <div className="mt-8">
                        <h2 className="text-highlight mb-4 text-lg font-semibold">Recommendations</h2>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="bg-primary aspect-[5/7] w-full rounded-md" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
