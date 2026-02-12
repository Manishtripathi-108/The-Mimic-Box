'use client';

import { motion } from 'framer-motion';

import FeatureCard from './FeatureCard';

const features = [
    {
        title: 'Music Streaming',
        description: 'Connect your Spotify and JioSaavn accounts to stream, manage playlists, and discover new music seamlessly.',
        icon: 'spotify' as const,
    },
    {
        title: 'Anime & Manga Tracking',
        description: 'Sync with AniList to track your anime and manga progress, manage watchlists, and explore recommendations.',
        icon: 'anilist' as const,
    },
    {
        title: 'Multiplayer Games',
        description: 'Challenge friends to classic games like Tic Tac Toe with real-time multiplayer support.',
        icon: 'game' as const,
    },
    {
        title: 'Audio Tools',
        description: 'Convert audio formats, edit metadata tags, and search for lyrics with our powerful audio toolkit.',
        icon: 'audio' as const,
    },
    {
        title: 'Playlist Sync',
        description: 'Remove duplicate tracks and sync your playlists across different streaming platforms effortlessly.',
        icon: 'playlist' as const,
    },
    {
        title: 'Cross-Platform',
        description: 'Access your media library from any device with our responsive, PWA-enabled web application.',
        icon: 'desktop' as const,
    },
];

const FeaturesSection = () => {
    return (
        <section id="features" className="bg-primary px-4 py-16 sm:px-6 sm:py-24">
            <div className="mx-auto max-w-7xl">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 text-center sm:mb-16">
                    <h2 className="text-text-primary font-alegreya text-3xl font-bold sm:text-4xl lg:text-5xl">
                        Everything You Need,
                        <span className="text-highlight block">One Platform</span>
                    </h2>
                    <p className="text-text-secondary mx-auto mt-4 max-w-2xl text-lg">
                        From music to anime, gaming to productivity — Mimic Box brings all your entertainment and media tools together.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <FeatureCard key={feature.title} title={feature.title} description={feature.description} icon={feature.icon} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
