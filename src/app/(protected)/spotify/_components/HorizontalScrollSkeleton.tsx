export default function HorizontalScrollSkeleton() {
    const skeletonArray = Array.from({ length: 10 });

    return (
        <section>
            <div className="mb-2 flex items-center justify-between px-4 sm:px-6">
                <div className="bg-secondary h-7 w-40 animate-pulse rounded" />
                <div className="bg-secondary h-7 w-7 animate-pulse rounded-full" />
            </div>

            <div className="relative">
                <div className="from-primary pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l to-transparent" />
                <div className="from-primary pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r to-transparent" />

                <div className="flex gap-2 overflow-x-auto px-4 sm:gap-4 sm:px-6 sm:[scrollbar-width:none]">
                    {skeletonArray.map((_, idx) => (
                        <div key={idx} className="w-40 flex-shrink-0">
                            <div className="bg-secondary aspect-square w-full animate-pulse rounded-lg" />
                            <div className="bg-secondary mt-2 h-4 w-24 animate-pulse rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
