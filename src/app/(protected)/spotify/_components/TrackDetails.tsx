import Image from 'next/image';
import Link from 'next/link';

import CardContainer from '@/components/ui/CardContainer';
import Icon from '@/components/ui/Icon';
import { APP_ROUTES } from '@/constants/routes.constants';
import { T_SpotifyTrack } from '@/lib/types/spotify.types';
import { formatTimeDuration } from '@/lib/utils/core.utils';

const TrackDetailCard = ({ track }: { track: T_SpotifyTrack }) => {
    return (
        <section className="min-h-calc-full-height flex items-center justify-center p-6">
            <main className="w-full max-w-4xl">
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

                    <h1 className="text-text-primary text-center font-serif text-3xl leading-tight font-bold tracking-tight sm:text-6xl">
                        {track.name}
                    </h1>

                    <p className="text-text-secondary text-center text-base sm:text-lg">
                        {track.artists.map((artist, index) => (
                            <Link
                                key={artist.id}
                                href={APP_ROUTES.SPOTIFY_ARTISTS(artist.id)}
                                className="hover:text-text-primary underline-offset-2 hover:underline">
                                {artist.name}
                                {index < track.artists.length - 1 && ', '}
                            </Link>
                        ))}
                    </p>

                    <p className="text-text-secondary mt-1 text-center text-sm">
                        <Link href={APP_ROUTES.SPOTIFY_ALBUMS(track.album.id)} className="hover:text-text-primary underline-offset-2 hover:underline">
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

                    <div className="mt-8 flex items-center justify-center gap-6">
                        <button type="button" aria-label="Share Track" className="button inline-flex size-9 rounded-full p-2">
                            <Icon icon="share" className="size-full" />
                        </button>
                        <button type="button" aria-label="Play Track" className="button button-highlight inline-flex size-14 rounded-full p-2">
                            <Icon icon="play" className="size-full" />
                        </button>
                        <button type="button" aria-label="More Options" className="button inline-flex size-9 rounded-full p-2">
                            <Icon icon="moreDots" className="size-full rotate-90" />
                        </button>
                    </div>
                </CardContainer>
            </main>
        </section>
    );
};

export default TrackDetailCard;
