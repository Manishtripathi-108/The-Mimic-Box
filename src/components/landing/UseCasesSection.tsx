'use client';

import { motion } from 'motion/react';

import UseCaseCard from './UseCaseCard';

const useCases = [
    {
        title: 'Anime Enthusiasts',
        description: 'Track your watching progress, discover new series, and never lose track of where you left off.',
        icon: 'anime' as const,
    },
    {
        title: 'Music Lovers',
        description: 'Stream from multiple platforms, manage playlists, and find lyrics instantly.',
        icon: 'spotify' as const,
    },
    {
        title: 'Casual Gamers',
        description: 'Enjoy quick games with friends during breaks, no downloads required.',
        icon: 'game' as const,
    },
    {
        title: 'Content Creators',
        description: 'Use audio tools to convert formats and edit metadata for your projects.',
        icon: 'mic' as const,
    },
    {
        title: 'Playlist Managers',
        description: 'Clean up duplicates and organize your music library across platforms.',
        icon: 'playlist' as const,
    },
    {
        title: 'Multi-Platform Users',
        description: 'Access everything from any device with our responsive PWA experience.',
        icon: 'desktop' as const,
    },
];

const UseCasesSection = () => {
    return (
        <section className="bg-primary px-4 py-16 sm:px-6 sm:py-24">
            <div className="mx-auto max-w-7xl">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 text-center sm:mb-16">
                    <h2 className="text-text-primary font-alegreya text-3xl font-bold sm:text-4xl lg:text-5xl">
                        Built For
                        <span className="text-highlight"> Everyone</span>
                    </h2>
                    <p className="text-text-secondary mx-auto mt-4 max-w-2xl text-lg">
                        Whether you&apos;re a casual user or power user, Mimic Box adapts to your needs.
                    </p>
                </motion.div>

                {/* Use Cases Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {useCases.map((useCase, index) => (
                        <UseCaseCard key={useCase.title} title={useCase.title} description={useCase.description} icon={useCase.icon} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UseCasesSection;
