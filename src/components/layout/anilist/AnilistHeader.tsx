import React from 'react';

import Image from 'next/image';

const AnilistHeader = ({ displayName, imageUrl, bannerUrl }: { displayName: string; imageUrl: string; bannerUrl: string }) => {
    return (
        <header
            style={{ backgroundImage: `url(${bannerUrl})` }}
            className="shadow-pressed-sm bg-secondary flex w-full items-end justify-center border-b bg-cover bg-center bg-no-repeat">
            <div className="mt-10 flex w-5/6 max-w-(--breakpoint-md) items-end justify-start gap-3 opacity-100 md:mt-20">
                <Image width={144} height={160} src={imageUrl} alt={`${displayName}'s avatar`} className="w-28 rounded-t-lg align-text-top md:w-36" />
                <h1 className="text-text-primary font-alegreya mb-3 w-full truncate rounded-lg text-4xl font-bold tracking-wide">{displayName}</h1>
            </div>
        </header>
    );
};

export default AnilistHeader;
