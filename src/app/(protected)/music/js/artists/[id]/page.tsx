import { Metadata } from 'next';

import { saavnGetArtistDetails } from '@/actions/saavn.actions';
import MusicMediaHeader from '@/app/(protected)/music/_components/MusicMediaHeader';
import MusicTrackCard from '@/app/(protected)/music/_components/MusicTrackCard';
import ErrorCard from '@/components/layout/ErrorCard';
import LinkCard from '@/components/ui/LinkCard';
import APP_ROUTES from '@/constants/routes/app.routes';

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> => {
    const { id } = await params;
    const res = await saavnGetArtistDetails({ id, songCount: 0, albumCount: 0 });

    if (!res.success || !res.payload) {
        return {
            title: 'Artist Not Found',
            description: 'The requested artist could not be found.',
            keywords: ['Artist', 'Music', 'Mimic', 'Metadata', 'Not Found'],
        };
    }

    const artist = res.payload;

    return {
        title: artist.name,
        description: `Explore artist profile for ${artist.name} — with ${artist.followerCount} followers.`,
        keywords: ['Music', 'Artist', 'Music', 'Mimic', 'Metadata', artist.name],
        openGraph: {
            images: [{ url: artist.image[2]?.url }],
        },
        twitter: {
            card: 'summary_large_image',
            title: artist.name,
            description: `Explore artist profile for ${artist.name} — with ${artist.followerCount} followers.`,
            images: [artist.image[2]?.url],
        },
    };
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const res = await saavnGetArtistDetails({ id, songCount: 10, albumCount: 10 });

    if (!res.success || !res.payload) {
        return <ErrorCard message={res.message || 'Failed to fetch artist details'} />;
    }

    const artist = res.payload;

    return (
        <div className="flex flex-col gap-6">
            <MusicMediaHeader title={artist.name} coverImage={artist.image[2]?.url} metadata={`Followers: ${artist.followerCount}`} />

            <section className="text-text-secondary">
                <h2 className="text-highlight font-alegreya mb-2 text-2xl font-semibold tracking-wide">Popular Albums</h2>
                {!artist.topAlbums || artist.topAlbums.length === 0 ? (
                    <p>No albums found.</p>
                ) : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4 *:w-full">
                        {artist.topAlbums.map((album) => (
                            <LinkCard
                                icon="play"
                                key={album.id}
                                title={album.name}
                                thumbnailUrl={album.image[2]?.url}
                                href={APP_ROUTES.MUSIC.JS.ALBUMS(album.id)}
                            />
                        ))}
                    </div>
                )}
            </section>

            <section className="text-text-secondary">
                <h2 className="text-highlight font-alegreya mb-2 text-2xl font-semibold tracking-wide">Popular Tracks</h2>
                {!artist.topSongs || artist.topSongs.length === 0 ? (
                    <p>No tracks found.</p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {artist.topSongs.map((t, index) => (
                            <MusicTrackCard
                                key={`${t.id}-${index}`}
                                id={t.id}
                                title={t.name}
                                link={APP_ROUTES.MUSIC.JS.TRACKS(t.id)}
                                duration_ms={(t.duration || 0) * 1000}
                                imageUrl={t.image[2]?.url}
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
                                context={{ type: 'artist', id: id, source: 'saavn' }}
                            />
                        ))}
                    </div>
                )}
            </section>

            <section className="text-text-secondary">
                <h2 className="text-highlight font-alegreya mb-2 text-2xl font-semibold tracking-wide">Single Albums</h2>
                {!artist.singles || artist.singles.length === 0 ? (
                    <p>No Albums found.</p>
                ) : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4 *:w-full">
                        {artist.singles.map((album) => (
                            <LinkCard
                                icon="play"
                                key={album.id}
                                title={album.name}
                                thumbnailUrl={album.image[2]?.url}
                                href={APP_ROUTES.MUSIC.JS.ALBUMS(album.id)}
                            />
                        ))}
                    </div>
                )}
            </section>

            <section className="text-text-secondary">
                <h2 className="text-highlight font-alegreya mb-2 text-2xl font-semibold tracking-wide">Similar Artists</h2>
                {!artist.similarArtists || artist.similarArtists.length === 0 ? (
                    <p>No similar artists found.</p>
                ) : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4 *:w-full">
                        {artist.similarArtists.map((similarArtist) => (
                            <LinkCard
                                key={similarArtist.id}
                                icon="play"
                                title={similarArtist.name}
                                thumbnailUrl={similarArtist.image[2]?.url}
                                href={APP_ROUTES.MUSIC.JS.ARTISTS(similarArtist.id)}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Page;
