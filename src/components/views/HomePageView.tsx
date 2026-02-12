'use client';

import { Session } from 'next-auth';

import { ActivityCard, HighlightCard, QuickActionTile, WelcomeBanner } from '@/components/home';
import { Footer } from '@/components/landing';
import { Button } from '@/components/ui/Button';
import APP_ROUTES from '@/constants/routes/app.routes';

type HomePageViewProps = {
    session: Session;
};

const quickActions = [
    {
        title: 'Music Dashboard',
        description: 'Stream and manage your playlists',
        href: APP_ROUTES.MUSIC.DASHBOARD,
        icon: 'spotify' as const,
        color: 'highlight' as const,
    },
    {
        title: 'Anime List',
        description: 'Track your anime progress',
        href: APP_ROUTES.ANILIST.USER.ANIME,
        icon: 'anilist' as const,
        color: 'accent' as const,
    },
    {
        title: 'Play Games',
        description: 'Challenge friends online',
        href: APP_ROUTES.GAMES.TIC_TAC_TOE.ROOT,
        icon: 'game' as const,
        color: 'success' as const,
    },
    {
        title: 'Audio Tools',
        description: 'Convert and edit audio files',
        href: APP_ROUTES.AUDIO.CONVERTER,
        icon: 'audio' as const,
        color: 'warning' as const,
    },
];

const trendingItems = [
    {
        title: 'Top Playlists',
        subtitle: 'Your most played',
        href: APP_ROUTES.MUSIC.PLAYLISTS,
        image: {
            src: '/images/Top_Playlists.png',
            alt: 'Album cover art placeholder for your top playlist with colorful abstract music visualization',
        },
        icon: 'playlist' as const,
    },
    {
        title: 'Trending Anime',
        subtitle: 'Popular this season',
        href: APP_ROUTES.ANILIST.USER.ANIME,
        image: {
            src: '/images/trending_anime.jpg',
            alt: 'Anime cover art placeholder showing a dynamic action scene from a popular anime series',
        },
        icon: 'anime' as const,
    },
    {
        title: 'Classic Games',
        subtitle: 'Quick fun games',
        href: APP_ROUTES.GAMES.TIC_TAC_TOE.CLASSIC,
        image: {
            src: '/images/classic_game.jpg',
            alt: 'Game preview placeholder showing a tic-tac-toe board with colorful game pieces',
        },
        icon: 'game' as const,
    },
    {
        title: 'Lyrics Search',
        subtitle: 'Find any song lyrics',
        href: APP_ROUTES.AUDIO.SEARCH_LYRICS,
        image: {
            src: '/images/lyrics_search.png',
            alt: 'Lyrics search placeholder showing musical notes and text lines representing song lyrics',
        },
        icon: 'lyrics' as const,
    },
    {
        title: 'Audio Converter',
        subtitle: 'Convert audio formats',
        href: APP_ROUTES.AUDIO.CONVERTER,
        image: {
            src: '/images/audio_converter.png',
            alt: 'Audio converter placeholder showing audio waveform transforming between different formats',
        },
        icon: 'musicConvert' as const,
    },
    {
        title: 'Tune Sync',
        subtitle: 'Clean your playlists',
        href: APP_ROUTES.TUNE_SYNC.REMOVE_DUPLICATES.ROOT,
        image: {
            src: '/images/tune_sync.png',
            alt: 'Tune sync placeholder showing playlist items being organized and duplicates being removed',
        },
        icon: 'refresh' as const,
    },
];

const recentActivity = [
    {
        title: 'Welcome to Mimic Box!',
        description: 'Start exploring your dashboard',
        time: 'Just now',
        href: APP_ROUTES.ROOT,
        image: {
            src: '/images/welcome.png',
            alt: 'Activity thumbnail placeholder showing a welcome celebration icon',
        },
    },
    {
        title: 'Connect Spotify',
        description: 'Link your account to get started',
        time: 'Pending',
        href: APP_ROUTES.USER.PROFILE,
        image: {
            src: '/images/music_service.png',
            alt: 'Activity thumbnail placeholder showing Spotify logo for account connection',
        },
    },
    {
        title: 'Connect AniList',
        description: 'Sync your anime library',
        time: 'Pending',
        href: APP_ROUTES.USER.PROFILE,
        image: {
            src: '/images/anime_service.png',
            alt: 'Activity thumbnail placeholder showing AniList logo for account connection',
        },
    },
];

const HomePageView = ({ session }: HomePageViewProps) => {
    return (
        <div className="min-h-calc-full-height">
            <main className="mx-auto max-w-7xl space-y-8 p-4 sm:space-y-12 sm:p-6">
                {/* Welcome Banner */}
                <WelcomeBanner user={session.user} />

                {/* Quick Actions */}
                <section>
                    <h2 className="text-highlight font-alegreya mb-4 px-2 text-2xl font-semibold tracking-wide">Quick Actions</h2>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {quickActions.map((action, index) => (
                            <QuickActionTile
                                key={action.title}
                                title={action.title}
                                description={action.description}
                                href={action.href}
                                icon={action.icon}
                                color={action.color}
                                index={index}
                            />
                        ))}
                    </div>
                </section>

                {/* Trending / Highlights */}
                <section>
                    <h2 className="text-highlight font-alegreya mb-4 px-2 text-2xl font-semibold tracking-wide">Explore Features</h2>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {trendingItems.map((item, index) => (
                            <HighlightCard
                                key={item.title}
                                title={item.title}
                                subtitle={item.subtitle}
                                href={item.href}
                                image={item.image}
                                icon={item.icon}
                                index={index}
                            />
                        ))}
                    </div>
                </section>

                {/* Recent Activity */}
                <section>
                    <h2 className="text-highlight font-alegreya mb-4 px-2 text-2xl font-semibold tracking-wide">Getting Started</h2>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {recentActivity.map((activity, index) => (
                            <ActivityCard
                                key={activity.title}
                                title={activity.title}
                                description={activity.description}
                                time={activity.time}
                                href={activity.href}
                                image={activity.image}
                                index={index}
                            />
                        ))}
                    </div>
                </section>

                {/* Additional Feature Sections */}
                <section className="shadow-floating-md bg-secondary rounded-3xl p-6 sm:p-8">
                    <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:text-left">
                        <div className="flex-1">
                            <h2 className="text-text-primary font-alegreya text-2xl font-bold sm:text-3xl">
                                Ready to Play?
                                <span className="text-highlight"> Challenge a Friend!</span>
                            </h2>
                            <p className="text-text-secondary mt-2 max-w-lg">
                                Jump into Tic Tac Toe — classic or ultimate mode. Play online with friends or practice against yourself.
                            </p>
                        </div>
                        <div className="flex shrink-0 gap-3">
                            <Button asChild variant="highlight" size="lg">
                                <a href={APP_ROUTES.GAMES.TIC_TAC_TOE.CLASSIC}>Play Classic</a>
                            </Button>
                            <Button asChild variant="accent" size="lg">
                                <a href={APP_ROUTES.GAMES.TIC_TAC_TOE.ULTIMATE}>Play Ultimate</a>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default HomePageView;
