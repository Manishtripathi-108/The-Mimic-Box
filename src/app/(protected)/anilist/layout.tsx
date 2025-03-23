import React, { Suspense } from 'react';

import { auth } from '@/auth';
import AnilistHeader from '@/components/layout/anilist/AnilistHeader';
import AnilistSkeleton from '@/components/layout/anilist/AnilistSkeleton';
import { ConnectAccount } from '@/components/ui/LinkedAccountButtons';
import { APP_ROUTES } from '@/constants/routes.constants';

const AnilistLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth();
    const anilist = session?.user?.linkedAccounts?.anilist;
    if (!anilist) {
        return (
            <main>
                you need to link your Anilist account first
                <ConnectAccount account="anilist" callBackUrl={APP_ROUTES.ANILIST_ANIME} />
            </main>
        );
    }

    return (
        <main className="bg-primary">
            <AnilistHeader />

            <div className="container mx-auto p-6">
                <Suspense fallback={<AnilistSkeleton />}>{children}</Suspense>
            </div>
        </main>
    );
};

export default AnilistLayout;
