import React from 'react';

import A_Navbar from '@/app/(protected)/anilist/_components/A_Navbar';

const AnilistSearchLayout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="container mx-auto">
            <A_Navbar />

            <div className="p-2 sm:p-6">{children}</div>
        </main>
    );
};

export default AnilistSearchLayout;
