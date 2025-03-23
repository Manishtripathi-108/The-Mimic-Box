import React, { Suspense } from 'react';

import { auth } from '@/auth';
import AnilistHeader from '@/components/layout/anilist/AnilistHeader';
import AnilistSkeleton from '@/components/layout/anilist/AnilistSkeleton';

const AnilistLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth();
    const anilist = session?.user?.linkedAccounts?.anilist;
    if (!anilist) throw new Error('Anilist account not linked, please link your account to continue.');

    return (
        <main className="bg-primary">
            <AnilistHeader
                bannerUrl={anilist.bannerUrl || 'https://picsum.photos/200'}
                displayName={anilist.displayName || 'Anilist User'}
                imageUrl={anilist.imageUrl}
            />

            <div className="container mx-auto p-6">
                <Suspense fallback={<AnilistSkeleton />}>{children}</Suspense>
            </div>
        </main>
    );
};

export default AnilistLayout;
