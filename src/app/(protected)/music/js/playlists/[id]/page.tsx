import { Metadata } from 'next';

import { saavnGetPlaylistDetails } from '@/actions/saavn.actions';
import MusicActionBtns from '@/app/(protected)/music/_components/MusicActionBtns';
import MusicMediaHeader from '@/app/(protected)/music/_components/MusicMediaHeader';
import MusicTrackCard from '@/app/(protected)/music/_components/MusicTrackCard';
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
        keywords: ['Music', 'Playlist', 'Music', 'Mimic', 'Metadata', playlist.name],
        openGraph: {
            images: [{ url: playlist.image[2].url}],
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
                {playlist.songs.map((t, idx) => (
                    <MusicTrackCard
                        key={`${t.id}-${idx}`}
                        id={t.id}
                        title={t.name}
                        link={APP_ROUTES.MUSIC.JS.TRACKS(t.id)}
                        duration_ms={(t.duration || 0) * 1000}
                        imageUrl={t.image?.[2]?.url}
                        artists={t.artists.primary.map((artist) => ({
                            id: artist.id,
                            name: artist.name,
                            link: APP_ROUTES.MUSIC.JS.ARTISTS(artist.id),
                        }))}
                        album={
                            id in t.album
                                ? {
                                      id: t.album.id!,
                                      name: t.album.name!,
                                      link: APP_ROUTES.MUSIC.JS.ALBUMS(t.album.id!),
                                  }
                                : undefined
                        }
                        context={{ id: playlist.id, type: 'playlist', source: 'saavn' }}
                    />
                ))}
            </div>
        </>
    );
};

export default Page;
