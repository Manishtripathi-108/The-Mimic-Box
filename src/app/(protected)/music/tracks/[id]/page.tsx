import { Metadata } from 'next';

import { getSpotifyTrackDetails } from '@/actions/spotify.actions';
import MusicTrackPage from '@/app/(protected)/music/_components/MusicTrackPage';
import ErrorCard from '@/components/layout/ErrorCard';
import { APP_ROUTES } from '@/constants/routes.constants';
import { formatTimeDuration } from '@/lib/utils/core.utils';

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> => {
    const { id } = await params;
    const res = await getSpotifyTrackDetails(id);

    if (!res.success || !res.payload) {
        return {
            title: 'Track Not Found',
            description: 'The requested Spotify track could not be found.',
            keywords: ['Music', 'Track', 'Music', 'Mimic', 'Metadata', 'Not Found'],
        };
    }

    const { name, artists, album } = res.payload;
    const artistNames = artists?.map((a) => a.name).filter(Boolean) || ['Unknown'];
    const albumName = album?.name || 'Unknown Album';
    const coverImage = album?.images?.[0]?.url || '';

    return {
        title: `${name} by ${artistNames[0]}`,
        description: `Listen to "${name}" by ${artistNames.join(', ')} from the album "${albumName}".`,
        keywords: ['Music', 'Track', 'Music', 'Mimic', 'Metadata', name, albumName, ...artistNames],
        openGraph: {
            images: [{ url: coverImage }],
        },
    };
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const res = await getSpotifyTrackDetails(id);

    if (!res.success || !res.payload) {
        return <ErrorCard message={res.message || 'Failed to fetch track'} />;
    }

    const track = res.payload;

    const artists =
        track.artists?.map((artist) => ({
            id: artist.id,
            name: artist.name,
            link: APP_ROUTES.MUSIC.ARTISTS(artist.id),
        })) || [];

    const album = {
        id: track.album?.id || '',
        name: track.album?.name || 'Unknown Album',
        link: APP_ROUTES.MUSIC.ALBUMS(track.album?.id || ''),
    };

    const description = [formatTimeDuration(track.duration_ms, 'minutes'), track.album.release_date, `${track.popularity}% Popularity`];

    return (
        <MusicTrackPage
            imageUrl={track.album.images?.[0]?.url}
            title={track.name}
            artists={artists}
            album={album}
            description={description}
            context={{ id: track.id, type: 'track', source: 'spotify' }}
        />
    );
};

export default Page;
