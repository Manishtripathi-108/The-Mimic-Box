const MusicTrackCardSkeleton = () => {
    return (
        <div className="from-secondary to-tertiary shadow-floating-xs @container flex w-full items-center justify-between gap-4 rounded-2xl bg-linear-150 from-15% to-85% p-3 pr-5 *:animate-pulse">
            <div className="flex w-full items-center gap-3">
                <div className="bg-primary size-7 shrink-0 rounded-full" />

                <div className="flex items-center gap-3">
                    <div className="bg-primary shrink-0 rounded-xl" style={{ width: 50, height: 50 }} />

                    <div className="flex flex-col gap-1">
                        <div className="bg-primary h-4 w-32 rounded" />
                        <div className="bg-primary h-3 w-24 rounded" />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-4 text-sm @md:w-full @md:justify-between">
                <div className="bg-primary hidden h-3 w-24 rounded @md:block" />
                <div className="bg-primary h-3 w-8 rotate-90 rounded @md:rotate-0" />
            </div>
        </div>
    );
};

export default MusicTrackCardSkeleton;
