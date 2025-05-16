import { Metadata } from 'next';

import Image from 'next/image';
import Link from 'next/link';

import { getSpotifyTrackDetails } from '@/actions/spotify.actions';
import MusicActionBtns from '@/app/(protected)/spotify/_components/MusicActionBtns';
import ErrorCard from '@/components/layout/ErrorCard';
import CardContainer from '@/components/ui/CardContainer';
import { APP_ROUTES } from '@/constants/routes.constants';
import { formatTimeDuration } from '@/lib/utils/core.utils';

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> => {
    const { id } = await params;
    const res = await getSpotifyTrackDetails(id);

    if (!res.success || !res.payload) {
        return {
            title: 'Track Not Found',
            description: 'The requested Spotify track could not be found.',
            keywords: ['Spotify', 'Track', 'Music', 'Mimic', 'Metadata', 'Not Found'],
        };
    }

    const { name, artists, album } = res.payload;
    const artistNames = artists?.map((a) => a.name).filter(Boolean) || ['Unknown'];
    const albumName = album?.name || 'Unknown Album';
    const coverImage = album?.images?.[0]?.url || '';

    return {
        title: `${name} by ${artistNames[0]}`,
        description: `Listen to "${name}" by ${artistNames.join(', ')} from the album "${albumName}".`,
        keywords: ['Spotify', 'Track', 'Music', 'Mimic', 'Metadata', name, albumName, ...artistNames],
        openGraph: {
            images: [
                {
                    url: coverImage,
                    width: 300,
                    height: 300,
                    alt: `Album art for ${albumName}`,
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

    const track = res.payload;

    return (
        <section className="h-calc-full-height flex items-center justify-center">
            <div className="mt-20 w-full max-w-4xl">
                <CardContainer>
                    <div className="shadow-pressed-xs bg-secondary relative mx-auto -mt-20 w-fit overflow-hidden rounded-2xl border p-1 sm:-mt-32 sm:p-2">
                        <Image
                            src={track.album.images?.[0]?.url}
                            alt={`Album cover for ${track.album.name}`}
                            width={300}
                            height={300}
                            className="size-44 rounded-xl border object-cover sm:size-60"
                            priority
                        />
                    </div>

                    <h1 className="text-text-primary mt-4 text-center font-serif text-3xl leading-tight font-bold tracking-tight sm:text-5xl">
                        {track.name}
                    </h1>

                    <p className="text-text-secondary text-center text-base sm:text-lg">
                        {track.artists.map((artist, idx) => (
                            <Link
                                key={artist.id}
                                href={APP_ROUTES.SPOTIFY.ARTISTS(artist.id)}
                                className="text-text-secondary hover:text-text-primary underline-offset-2 hover:underline">
                                {artist.name}
                                {idx < track.artists.length - 1 && ', '}
                            </Link>
                        ))}
                    </p>

                    <p className="text-text-secondary mt-1 text-center text-sm">
                        <Link
                            href={APP_ROUTES.SPOTIFY.ALBUMS(track.album.id)}
                            className="text-text-secondary hover:text-text-primary underline-offset-2 hover:underline">
                            {track.album.name}
                        </Link>
                    </p>

                    <div className="text-text-secondary mt-4 flex flex-wrap items-center justify-center gap-4 text-sm">
                        <span>{formatTimeDuration(track.duration_ms, 'minutes')}</span>
                        <span>•</span>
                        <span>{track.album.release_date}</span>
                        <span>•</span>
                        <span>{track.popularity}% Popularity</span>
                    </div>

                    <MusicActionBtns className="mt-8 sm:justify-center" spotifyTracks={[track]} context={{ type: 'track', id: track.id, name: track.name }} />
                </CardContainer>
            </div>
        </section>
    );
};

export default Page;
