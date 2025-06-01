import Image from 'next/image';
import Link from 'next/link';

import MusicActionBtns from '@/app/(protected)/music/_components/MusicActionBtns';
import CardContainer from '@/components/ui/CardContainer';
import { T_AudioEntityLink, T_AudioSourceContext } from '@/lib/types/client.types';

type props = {
    imageUrl: string;
    title: string;
    artists: T_AudioEntityLink[];
    album: T_AudioEntityLink;
    description: string[];
    context: T_AudioSourceContext;
};

const MusicTrackPage = ({ imageUrl, title, artists, album, description, context }: props) => {
    return (
        <section className="flex h-full items-center justify-center">
            <div className="mt-30 w-full max-w-4xl">
                <CardContainer>
                    <div className="shadow-pressed-xs bg-secondary relative mx-auto -mt-20 w-fit overflow-hidden rounded-2xl border p-1 sm:-mt-32 sm:p-2">
                        <Image
                            src={imageUrl}
                            alt={`cover for ${title}`}
                            width={300}
                            height={300}
                            className="size-44 rounded-xl border object-cover sm:size-60"
                            priority
                        />
                    </div>

                    <h1 className="text-text-primary mt-4 text-center font-serif text-3xl leading-tight font-bold tracking-tight sm:text-5xl">
                        {title}
                    </h1>

                    <p className="text-text-secondary text-center text-base sm:text-lg">
                        {artists.map((artist, idx) => (
                            <Link
                                key={artist.id}
                                href={artist.link}
                                className="text-text-secondary hover:text-text-primary underline-offset-2 hover:underline">
                                {artist.name}
                                {idx < artists.length - 1 && ', '}
                            </Link>
                        ))}
                    </p>

                    <p className="text-text-secondary mt-1 text-center text-sm">
                        <Link href={album.link} className="text-text-secondary hover:text-text-primary underline-offset-2 hover:underline">
                            {album.name}
                        </Link>
                    </p>

                    {description.length && (
                        <div className="text-text-secondary mt-4 flex flex-wrap items-center justify-center gap-4 text-sm">
                            {description.map((desc, idx) => (
                                <span key={idx} className="text-text-secondary flex">
                                    {desc}
                                    {idx < description.length - 1 && <span className="ml-4">•</span>}
                                </span>
                            ))}
                        </div>
                    )}

                    <MusicActionBtns className="mt-8 sm:justify-center" context={context} />
                </CardContainer>
            </div>
        </section>
    );
};

export default MusicTrackPage;
