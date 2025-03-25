import React from 'react';

import { auth } from '@/auth';
import AccountLinkCTA from '@/components/layout/AccountLinkCTA';
import AnilistHeader from '@/components/layout/anilist/AnilistHeader';

const AnilistLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth();
    const anilist = session?.user?.linkedAccounts?.anilist;

    if (!anilist) {
        return (
            <main className="h-calc-full-height grid place-items-center">
                <AccountLinkCTA account="anilist" message="Link your Anilist account to view and manage your anime collection." />
            </main>
        );
    }

    return (
        <main className="bg-primary">
            <AnilistHeader bannerUrl={anilist.bannerUrl} displayName={anilist.displayName || 'Anilist User'} imageUrl={anilist.imageUrl} />

            <div className="container mx-auto p-2 sm:p-6">{children}</div>
        </main>
    );
};

export default AnilistLayout;
