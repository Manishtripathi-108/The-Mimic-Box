import { Metadata } from 'next';

import SearchLyrics from '@/app/(protected)/audio/_components/SearchLyrics';
import CardContainer from '@/components/ui/CardContainer';

export const metadata: Metadata = {
    title: 'Search Lyrics',
    description: 'Search and find lyrics for your favorite songs easily.',
};

export default function SearchLyricsPage() {
    return (
        <main className="min-h-calc-full-height flex items-center justify-center p-2">
            <CardContainer contentClassName="p-0" className="w-full max-w-3xl">
                <SearchLyrics />
            </CardContainer>
        </main>
    );
}
