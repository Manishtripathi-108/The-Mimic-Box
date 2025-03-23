import React from 'react';

const AnilistSkeleton = () => {
    return (
        <>
            {/* Controls */}
            <div className="mb-4 flex items-center justify-between gap-6 *:animate-pulse">
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

            {/* Tabs */}
            <div className="bg-secondary flex w-fit gap-3 rounded-xl p-2 *:animate-pulse *:rounded-lg">
                <div className="bg-tertiary h-10 w-24"></div>
                <div className="bg-tertiary h-10 w-24"></div>
                <div className="bg-tertiary h-10 w-24"></div>
                <div className="bg-tertiary h-10 w-24"></div>
            </div>

            {/* Media List */}
            <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2 *:animate-pulse *:rounded-xl">
                {Array.from({ length: 18 }).map((_, index) => (
                    <div key={index} className="bg-tertiary h-52 w-full rounded"></div>
                ))}
            </div>
        </>
    );
};

export default AnilistSkeleton;
