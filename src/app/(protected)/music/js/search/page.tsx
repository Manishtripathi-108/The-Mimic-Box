import { Suspense } from 'react';

import { Metadata } from 'next';

import MusicSearchResults from '@/app/(protected)/music/_components/MusicSearchResults';
import Icon from '@/components/ui/Icon';

export const metadata: Metadata = {
    title: 'Search Music',
    description: 'Search for songs, albums, artists, and playlists with JioSaavn.',
    keywords: ['Music', 'Search', 'Songs', 'Albums', 'Artists', 'Playlists', 'JioSaavn', 'Mimic Box'],
};

const Page = () => {
    return (
        <Suspense
            fallback={
                <div className="text-text-secondary flex h-40 items-center justify-center gap-2">
                    <Icon icon="loading" className="size-8" />
                    Loading...
                </div>
            }>
            <MusicSearchResults />
        </Suspense>
    );
};

export default Page;
