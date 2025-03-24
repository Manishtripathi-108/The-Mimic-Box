import React from 'react';

import Image from 'next/image';

import NavigationBar from '@/components/layout/anilist/NavigationBar';

const AnilistHeader = ({ displayName, imageUrl, bannerUrl }: { displayName: string; imageUrl: string; bannerUrl: string }) => {
    return (
        <header
            style={{ backgroundImage: `url(${bannerUrl})` }}
            className="shadow-pressed-sm bg-secondary relative h-48 border-b bg-cover bg-center bg-no-repeat sm:h-72">
            <div className="absolute inset-x-0 bottom-0 h-fit">
                <div className="mx-auto flex w-full max-w-(--breakpoint-md) items-end justify-start gap-3 opacity-100">
                    <Image
                        width={144}
                        height={144}
                        src={imageUrl}
                        alt={`${displayName}'s avatar`}
                        className="aspect-square w-28 rounded-t-lg align-text-top md:w-36"
                    />
                    <h1 className="text-text-primary font-alegreya mb-3 w-full truncate rounded-lg text-4xl font-bold tracking-wide">
                        {displayName}
                    </h1>
                </div>
                <NavigationBar />
            </div>
        </header>
    );
};

export default AnilistHeader;
