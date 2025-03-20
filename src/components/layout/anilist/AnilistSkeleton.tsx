import React from 'react';

const AnilistSkeleton = () => {
    return (
        <>
            {/* Controls */}
            <div className="mb-4 flex items-center justify-between *:animate-pulse">
                <div className="bg-tertiary h-8 w-48 rounded-lg"></div>
                <div className="ml-3 flex items-center gap-3 *:rounded-lg">
                    <div className="bg-tertiary h-10 w-10"></div>
                    <div className="bg-tertiary h-10 w-10"></div>
                    <div className="bg-tertiary h-10 w-10"></div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-3 *:animate-pulse *:rounded-lg">
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
