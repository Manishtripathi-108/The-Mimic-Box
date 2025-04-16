'use client';

import Image from 'next/image';

import A_AddToListBtn from '@/app/(protected)/anilist/_components/A_AddToListBtn';
import A_MediaCard from '@/app/(protected)/anilist/_components/A_MediaCard';
import { IMAGE_URL } from '@/constants/client.constants';
import { AnilistMediaWithRecommendations } from '@/lib/types/anilist.types';
import { getMonthName } from '@/lib/utils/client.utils';

export default function MediaDetail({ media }: { media: AnilistMediaWithRecommendations }) {
    const { title, startDate, bannerImage, coverImage, recommendations } = media;
    const formattedDate = `${startDate.day} ${getMonthName(startDate.month || 1)} ${startDate.year}`;

    return (
        <main className="bg-primary text-text-primary min-h-screen" itemScope itemType="https://schema.org/CreativeWork">
            {/* Banner */}
            <section className="relative h-60 w-full overflow-hidden" aria-hidden="true">
                <Image
                    src={bannerImage || IMAGE_URL.BANNER}
                    alt="Banner image"
                    width={2000}
                    height={2000}
                    className="size-full object-cover opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </section>

            {/* Content */}
            <div className="mx-auto -mt-32 max-w-6xl px-4 sm:px-8">
                <article
                    className="from-secondary/70 to-tertiary shadow-floating-md relative z-10 rounded-xl bg-linear-150 from-15% to-85% p-6 sm:p-10"
                    aria-labelledby="media-title">
                    {/* Header */}
                    <header className="flex flex-col items-center gap-6 sm:flex-row">
                        <Image
                            src={coverImage.extraLarge}
                            alt={`Cover for ${title.english || title.romaji}`}
                            width={500}
                            height={700}
                            className="aspect-[5/7] w-52 rounded-md"
                        />
                        <div>
                            <h1 id="media-title" itemProp="name" className="text-3xl font-bold">
                                {title.english || title.romaji}
                            </h1>
                            <p className="text-text-secondary text-sm italic" itemProp="alternateName">
                                {title.native}
                            </p>
                            <p className="text-text-secondary mt-2 text-sm" itemProp="datePublished">
                                Aired: {formattedDate}
                            </p>
                            <A_AddToListBtn mediaId={media.id} type={media.type} className="mt-4" />
                        </div>
                    </header>

                    {/* Info Grid */}
                    <dl className="[&>div>dt]:text-text-primary [&>div>dd]:text-text-secondary mt-8 grid grid-cols-2 gap-4 text-sm capitalize md:grid-cols-3">
                        <div>
                            <dt>Type</dt>
                            <dd itemProp="genre">{media.type.toLowerCase()}</dd>
                        </div>
                        <div>
                            <dt>Status</dt>
                            <dd>{media.status.toLowerCase().replaceAll('_', ' ')}</dd>
                        </div>
                        <div>
                            <dt>Format</dt>
                            <dd>{media.format.toLowerCase().replace('_', ' ')}</dd>
                        </div>
                        {media.type === 'ANIME' ? (
                            <>
                                <div>
                                    <dt>Episodes</dt>
                                    <dd>{media.episodes || 'N/A'}</dd>
                                </div>
                                <div>
                                    <dt>Duration</dt>
                                    <dd>{media.duration || 'N/A'} min</dd>
                                </div>
                            </>
                        ) : (
                            <div>
                                <dt>Chapters</dt>
                                <dd>{media.chapters || 'N/A'}</dd>
                            </div>
                        )}
                        <div>
                            <dt>Score</dt>
                            <dd>{media.averageScore}%</dd>
                        </div>
                        <div>
                            <dt>Popularity</dt>
                            <dd>{media.popularity}</dd>
                        </div>
                        <div>
                            <dt>Favourites</dt>
                            <dd>{media.favourites}</dd>
                        </div>
                    </dl>

                    {/* Genres */}
                    <section className="mt-6" aria-labelledby="genres-heading">
                        <h2 id="genres-heading" className="text-highlight mb-2 text-lg font-semibold">
                            Genres
                        </h2>
                        <ul className="flex flex-wrap gap-2" itemProp="keywords">
                            {media.genres.map((genre) => (
                                <li key={genre}>
                                    <span className="bg-primary shadow-pressed-xs text-text-secondary rounded-full border px-3 py-1 text-sm">
                                        {genre}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Description */}
                    <section className="mt-8" aria-labelledby="description-heading">
                        <h2 id="description-heading" className="text-highlight mb-2 text-lg font-semibold">
                            Description
                        </h2>
                        <div
                            className="text-text-secondary prose max-w-none"
                            itemProp="description"
                            dangerouslySetInnerHTML={{ __html: media.description }}
                        />
                    </section>

                    {/* Recommendations */}
                    {recommendations.nodes.length > 0 && (
                        <section className="mt-8" aria-labelledby="recommendations-heading">
                            <h2 id="recommendations-heading" className="text-highlight mb-4 text-lg font-semibold">
                                Recommendations
                            </h2>
                            <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                                {recommendations.nodes.map(({ mediaRecommendation }) => (
                                    <A_MediaCard key={mediaRecommendation.id} media={mediaRecommendation} />
                                ))}
                            </div>
                        </section>
                    )}
                </article>
            </div>
        </main>
    );
}
