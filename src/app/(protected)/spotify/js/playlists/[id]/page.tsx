import { Metadata } from 'next';

import { saavnGetPlaylistDetails } from '@/actions/saavn.actions';
import MusicActionBtns from '@/app/(protected)/spotify/_components/MusicActionBtns';
import MusicMediaHeader from '@/app/(protected)/spotify/_components/MusicMediaHeader';
import MusicTrackCard from '@/app/(protected)/spotify/_components/MusicTrackCard';
import ErrorCard from '@/components/layout/ErrorCard';
import { APP_ROUTES } from '@/constants/routes.constants';

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> => {
    const { id } = await params;
    const res = await saavnGetPlaylistDetails({ id });

    if (!res.success || !res.payload) {
        return {
            title: 'Playlist Not Found',
            description: 'The requested playlist could not be found.',
            keywords: ['Playlist', 'Music', 'Mimic', 'Metadata', 'Not Found'],
        };
    }

    const playlist = res.payload;

    return {
        title: playlist.name,
        description: playlist.description,
        keywords: ['Spotify', 'Playlist', 'Music', 'Mimic', 'Metadata', playlist.name],
        openGraph: {
            images: [
                {
                    url: playlist.image[2].url || '',
                    width: 300,
                    height: 300,
                    alt: `Cover for ${playlist.name}`,
                },
            ],
        },
    };
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const res = await saavnGetPlaylistDetails({ id, limit: 100 });

    if (!res.success || !res.payload) {
        return <ErrorCard message={res.message || 'Failed to fetch playlist'} />;
    }

    const playlist = res.payload;

    return (
        <>
            <MusicMediaHeader title={playlist.name} description={playlist.description} coverImage={playlist.image?.[2]?.url} />

            <MusicActionBtns context={{ id: playlist.id, type: 'playlist', source: 'saavn' }} className="mt-4" />

            <div className="mt-6 grid w-full gap-2">
                {playlist.songs.map((track, idx) => (
                    <MusicTrackCard
                        key={track.id + idx}
                        id={track.id}
                        title={track.name}
                        link={APP_ROUTES.SPOTIFY.JS.TRACKS(track.id)}
                        duration_ms={(track.duration || 0) * 1000}
                        imageUrl={track.image?.[2]?.url}
                        artists={track.artists.primary.map((artist) => ({
                            id: artist.id,
                            name: artist.name,
                            link: APP_ROUTES.SPOTIFY.JS.ARTISTS(artist.id),
                        }))}
                        album={
                            id in track.album
                                ? {
                                      id: track.album.id!,
                                      name: track.album.name!,
                                      link: APP_ROUTES.SPOTIFY.JS.ALBUMS(track.album.id!),
                                  }
                                : undefined
                        }
                        context={{ id: playlist.id, type: 'playlist', source: 'spotify' }}
                    />
                ))}
            </div>
        </>
    );
};

export default Page;
