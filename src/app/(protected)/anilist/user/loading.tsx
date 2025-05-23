const Loading = () => {
    return (
        <div className="container mx-auto p-2 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-4 *:animate-pulse">
                <div className="bg-tertiary h-8 w-48 rounded-lg"></div>
                <div className="bg-tertiary hidden h-8 w-md rounded-lg sm:block"></div>
                <div className="flex items-center gap-3">
                    <div className="flex divide-x overflow-hidden rounded-full">
                        <div className="bg-tertiary size-7"></div>
                        <div className="bg-tertiary size-7"></div>
                    </div>
                    <div className="bg-tertiary size-7 rounded-lg"></div>
                </div>
            </div>

            <div className="bg-secondary flex w-full max-w-md gap-2 rounded-xl p-2 *:animate-pulse *:rounded-lg">
                <div className="bg-tertiary h-8 w-full"></div>
                <div className="bg-tertiary h-8 w-full"></div>
                <div className="bg-tertiary h-8 w-full"></div>
                <div className="bg-tertiary h-8 w-full"></div>
                <div className="bg-tertiary h-8 w-full"></div>
                <div className="bg-tertiary h-8 w-full"></div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 *:animate-pulse *:rounded-xl sm:grid-cols-3 lg:grid-cols-6">
                {Array.from({ length: 18 }).map((_, index) => (
                    <div key={index} className="bg-tertiary aspect-5/7 w-full rounded-md"></div>
                ))}
            </div>
        </div>
    );
};

export default Loading;
