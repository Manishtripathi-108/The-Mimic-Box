import React, { Suspense } from 'react';

import AnilistHeader from '@/components/layout/anilist/AnilistHeader';
import AnilistSkeleton from '@/components/layout/anilist/AnilistSkeleton';

const Anilist = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="bg-primary">
            <AnilistHeader />
            <div className="container mx-auto p-6">
                <Suspense fallback={<AnilistSkeleton />}>{children}</Suspense>
            </div>
        </div>
    );
};

export default Anilist;
