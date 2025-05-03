import { Metadata } from 'next';

import { getSpotifyTrackDetails } from '@/actions/spotify.actions';
import TrackDetailCard from '@/app/(protected)/spotify/_components/TrackDetails';
import ErrorCard from '@/components/layout/ErrorCard';

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> => {
    const { id } = await params;
    const res = await getSpotifyTrackDetails(id);

    if (!res.success || !res.payload) {
        return {
            title: 'Track Not Found',
            description: 'The requested Spotify track could not be found.',
        };
    }

    const track = res.payload;

    return {
        title: `${track.name} by ${track.artists[0].name}`,
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

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const res = await getSpotifyTrackDetails(id);
    if (!res.success || !res.payload) {
        return <ErrorCard message={res.message || 'Failed to fetch track'} />;
    }

    return <TrackDetailCard track={res.payload} />;
};

export default Page;
