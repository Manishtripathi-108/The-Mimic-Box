'use client';

import Image from 'next/image';

import A_MediaCard from '@/app/(protected)/anilist/_components/A_MediaCard';
import { IMAGE_URL } from '@/constants/client.constants';
import { AnilistMediaWithRecommendations } from '@/lib/types/anilist.types';

export default function MediaDetail({ media }: { media: AnilistMediaWithRecommendations }) {
    return (
        <div className="bg-primary text-text-primary min-h-screen">
            {/* Banner */}
            <div className="relative h-72 w-full overflow-hidden">
                <Image src={media.bannerImage || IMAGE_URL.BANNER} alt="Banner" className="object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="mx-auto -mt-32 max-w-6xl px-4 sm:px-8">
                <div className="from-secondary to-tertiary shadow-floating-md relative z-10 rounded-xl bg-linear-150 from-15% to-85% p-6 sm:p-10">
                    {/* Header */}
                    <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                        <Image src={media.coverImage.large} alt={media.title.romaji} width={150} height={220} className="rounded-md" />
                        <div>
                            <h1 className="text-3xl font-bold">{media.title.english || media.title.romaji}</h1>
                            <p className="text-text-secondary text-sm italic">{media.title.native}</p>
                            <p className="text-text-secondary mt-2 text-sm">
                                Aired: {media.startDate.year}/{media.startDate.month}/{media.startDate.day}
                            </p>
                            <button onClick={() => {}} className="button button-highlight mt-4">
                                ➕ Add to List
                            </button>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="[&>p>strong]:text-text-primary [&>p]:text-text-secondary mt-8 grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
                        <p>
                            <strong>Type:</strong> {media.type.toLowerCase()}
                        </p>
                        <p>
                            <strong>Status:</strong> {media.status.toLowerCase()}
                        </p>
                        <p>
                            <strong>Format:</strong> {media.format}
                        </p>
                        {media.type === 'ANIME' ? (
                            <>
                                <p>
                                    <strong>Episodes:</strong> {media.episodes || 'N/A'}
                                </p>
                                <p>
                                    <strong>Duration:</strong> {media.duration || 'N/A'} min
                                </p>
                            </>
                        ) : (
                            <p>
                                <strong>Chapters:</strong> {media.chapters || 'N/A'}
                            </p>
                        )}

                        <p>
                            <strong>Score:</strong> {media.averageScore}%
                        </p>
                        <p>
                            <strong>Popularity:</strong> {media.popularity}
                        </p>
                        <p>
                            <strong>Favourites:</strong> {media.favourites}
                        </p>
                    </div>

                    {/* Genres */}
                    <div className="mt-6">
                        <h2 className="text-highlight mb-2 text-lg font-semibold">Genres</h2>
                        <div className="flex flex-wrap gap-2">
                            {media.genres.map((genre) => (
                                <span key={genre} className="bg-primary shadow-pressed-xs text-text-secondary rounded-full border px-3 py-1 text-sm">
                                    {genre}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mt-8">
                        <h2 className="text-highlight mb-2 text-lg font-semibold">Description</h2>
                        <p className="text-text-secondary" dangerouslySetInnerHTML={{ __html: media.description }} />
                    </div>

                    {/* Recommendations */}
                    {media.recommendations.nodes.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-highlight mb-4 text-lg font-semibold">Recommendations</h2>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                {media.recommendations.nodes.map((recommendation) => (
                                    <A_MediaCard key={recommendation.mediaRecommendation.id} media={recommendation.mediaRecommendation} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
