import { Metadata } from 'next';

import { saavnGetSongDetails } from '@/actions/saavn.actions';
import MusicTrackPage from '@/app/(protected)/music/_components/MusicTrackPage';
import ErrorCard from '@/components/layout/ErrorCard';
import APP_ROUTES from '@/constants/routes/app.routes';
import { formatTimeDuration } from '@/lib/utils/core.utils';

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> => {
    const { id } = await params;
    const res = await saavnGetSongDetails(id);

    if (!res.success || !res.payload) {
        return {
            title: 'Track Not Found',
            description: 'The requested track could not be found.',
            keywords: ['Track', 'Music', 'Mimic', 'Metadata', 'Not Found'],
        };
    }

    const { name, artists, album, image } = res.payload[0];
    const artistNames = artists?.primary.map((a) => a.name).filter(Boolean) || ['Unknown'];
    const albumName = album?.name || 'Unknown Album';
    const coverImage = image?.[2]?.url;

    return {
        title: `${name} by ${artistNames[0]}`,
        description: `Listen to "${name}" by ${artistNames.join(', ')} from the album "${albumName}".`,
        keywords: ['Music', 'Track', 'Music', 'Mimic', 'Metadata', name, albumName, ...artistNames],
        openGraph: {
            images: [{ url: coverImage }],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${name} by ${artistNames[0]}`,
            description: `Listen to "${name}" by ${artistNames.join(', ')} from the album "${albumName}".`,
            images: [coverImage],
        },
    };
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const res = await saavnGetSongDetails(id);

    if (!res.success || !res.payload) {
        return <ErrorCard message={res.message || 'Failed to fetch track'} />;
    }

    const track = res.payload[0];

    const artists =
        track.artists?.primary.map((artist) => ({
            id: artist.id,
            name: artist.name,
            link: APP_ROUTES.MUSIC.JS.ARTISTS(artist.id),
        })) || [];

    const album = {
        id: track.album?.id || '',
        name: track.album?.name || 'Unknown Album',
        link: APP_ROUTES.MUSIC.JS.ALBUMS(track.album?.id || ''),
    };

    const description = [formatTimeDuration((track.duration || 0) * 1000, 'minutes'), track.language, `${track.playCount} plays`];

    return (
        <MusicTrackPage
            imageUrl={track.image?.[2]?.url}
            title={track.name}
            artists={artists}
            album={album}
            description={description}
            context={{ id: track.id, type: 'track', source: 'saavn' }}
        />
    );
};

export default Page;
