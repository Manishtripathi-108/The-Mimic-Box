// app/spotify/track/[id]/page.tsx
import { Metadata } from 'next';

import { getSpotifyTrackDetails } from '@/actions/spotify.actions';
import TrackDetailCard from '@/app/(protected)/spotify/_components/TrackDetails';
import ErrorCard from '@/components/layout/ErrorCard';

export const generateMetadata = async ({ params }: { params: { id: string } }): Promise<Metadata> => {
    const res = await getSpotifyTrackDetails(params.id);

    if (!res.success || !res.payload) {
        return {
            title: 'Track Not Found',
            description: 'The requested Spotify track could not be found.',
        };
    }

    const track = res.payload;

    return {
        title: `${track.name}`,
        description: `View details about "${track.name}" by ${track.artists.map((a) => a.name).join(', ')}.`,
        keywords: ['Spotify', 'Track', 'Music', 'Details', track.name, ...track.artists.map((a) => a.name)],
        openGraph: {
            images: [
                {
                    url: track.album.images?.[0]?.url || '',
                    width: 300,
                    height: 300,
                    alt: `Album art for ${track.album.name}`,
                },
            ],
        },
    };
};

export default async function TrackDetailsPage({ params }: { params: { id: string } }) {
    const res = await getSpotifyTrackDetails(params.id);

    if (!res.success || !res.payload) {
        return <ErrorCard message={res.message || 'Failed to fetch track'} />;
    }

    return <TrackDetailCard track={res.payload} />;
}
