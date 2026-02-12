'use client';

import { motion } from 'framer-motion';

import StepCard from './StepCard';

const steps = [
    {
        stepNumber: 1,
        title: 'Create Your Account',
        description: 'Sign up in seconds with email or Google. No credit card required — everything is free.',
        image: {
            src: '/images/create_account.png',
            alt: 'Step illustration showing the simple sign up form with email and Google authentication options',
        },
    },
    {
        stepNumber: 2,
        title: 'Connect Your Services',
        description: 'Link your Spotify, AniList, and other accounts to unlock the full power of Mimic Box.',
        image: {
            src: '/images/connect_services.png',
            alt: 'Step illustration showing account linking interface with Spotify, AniList, and other service icons',
        },
    },
    {
        stepNumber: 3,
        title: 'Start Exploring',
        description: 'Stream music, track anime, play games, and enjoy a unified entertainment experience.',
        image: {
            src: '/images/start_exploring.png',
            alt: 'Step illustration showing the main dashboard with music player, anime list, and game options',
        },
    },
];

const HowItWorksSection = () => {
    return (
        <section className="bg-secondary px-4 py-16 sm:px-6 sm:py-24">
            <div className="mx-auto max-w-7xl">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 text-center sm:mb-16">
                    <h2 className="text-text-primary font-alegreya text-3xl font-bold sm:text-4xl lg:text-5xl">
                        Get Started in
                        <span className="text-highlight"> 3 Simple Steps</span>
                    </h2>
                    <p className="text-text-secondary mx-auto mt-4 max-w-2xl text-lg">
                        Setting up your entertainment hub takes less than a minute. Here&apos;s how it works.
                    </p>
                </motion.div>

                {/* Steps Grid */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
                    {steps.map((step, index) => (
                        <StepCard
                            key={step.stepNumber}
                            stepNumber={step.stepNumber}
                            title={step.title}
                            description={step.description}
                            image={step.image}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
