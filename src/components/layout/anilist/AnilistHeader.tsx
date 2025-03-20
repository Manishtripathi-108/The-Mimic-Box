import React from 'react';

import Image from 'next/image';

import { auth } from '@/auth';
import { PROFILE_IMAGE_URL } from '@/constants/client.constants';

const AnilistHeader = async () => {
    const session = await auth();

    const userData = session?.user?.linkedAccounts?.anilist;
    const bannerStyle = {
        backgroundImage: `url(${userData?.bannerUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    return (
        <header className="shadow-pressed-sm bg-secondary flex w-full items-end justify-center border-b" style={bannerStyle}>
            <div className="mt-10 flex w-5/6 max-w-(--breakpoint-md) items-end justify-start gap-3 opacity-100 md:mt-20">
                <Image
                    width={144}
                    height={160}
                    src={userData?.imageUrl || PROFILE_IMAGE_URL}
                    alt={`${userData?.displayName}'s avatar`}
                    className="w-28 rounded-t-lg align-text-top md:w-36"
                />
                <h1 className="text-text-primary font-alegreya mb-3 w-full truncate rounded-lg text-4xl font-bold tracking-wide">
                    {userData?.displayName}
                </h1>
            </div>
        </header>
    );
};

export default AnilistHeader;
