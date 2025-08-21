const Loading = () => {
    return (
        <div className="bg-primary text-text-primary min-h-calc-full-height animate-pulse">
            <div className="bg-secondary relative h-60 w-full" />

            <div className="mx-auto -mt-32 max-w-6xl px-4 sm:px-8">
                <div className="shadow-floating-md bg-gradient-secondary-to-tertiary relative z-10 rounded-xl p-6 sm:p-10">
                    <div className="flex flex-col items-center gap-6 sm:flex-row">
                        <div className="bg-primary aspect-[5/7] w-52 rounded-md" />
                        <div className="space-y-2">
                            <div className="bg-primary h-7 w-60 rounded" />
                            <div className="bg-primary h-4 w-40 rounded" />
                            <div className="bg-primary mt-2 h-4 w-48 rounded" />
                            <div className="bg-highlight/60 mt-4 h-8 w-32 rounded" />
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-2 text-sm sm:gap-4 md:grid-cols-3">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <div key={i} className="bg-primary h-4 w-32 rounded-md" />
                        ))}
                    </div>

                    <div className="mt-6">
                        <h2 className="text-highlight mb-2 text-lg font-semibold">Genres</h2>
                        <div className="flex flex-wrap gap-2">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="bg-primary h-6 w-20 rounded-full" />
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 space-y-2">
                        <h2 className="text-highlight mb-2 text-lg font-semibold">Description</h2>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-primary h-4 w-full rounded" />
                        ))}
                    </div>

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
};

export default Loading;
