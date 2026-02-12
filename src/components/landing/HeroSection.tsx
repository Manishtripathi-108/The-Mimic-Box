'use client';

import Image from 'next/image';
import Link from 'next/link';

import { motion } from 'framer-motion';

import { Button } from '@/components/ui/Button';
import APP_ROUTES from '@/constants/routes/app.routes';

const HeroSection = () => {
    return (
        <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10">
                <div className="bg-gradient-secondary-to-tertiary absolute inset-0 opacity-50" />
                <div className="bg-highlight/5 animate-blob absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl" />
                <div
                    className="bg-accent/5 animate-blob absolute -bottom-40 -left-40 h-80 w-80 rounded-full blur-3xl"
                    style={{ animationDelay: '2s' }}
                />
            </div>

            <div className="mx-auto max-w-7xl">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center lg:text-left">
                        <h1 className="text-text-primary font-alegreya text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                            Your Ultimate
                            <span className="text-highlight block">Media & Gaming Hub</span>
                        </h1>

                        <p className="text-text-secondary mt-6 max-w-xl text-lg leading-relaxed sm:text-xl">
                            Stream music, manage your anime library, play games with friends, and sync your media across platforms — all in one sleek,
                            modern experience.
                        </p>

                        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                            <Button asChild variant="highlight" size="xl">
                                <Link href={APP_ROUTES.AUTH.REGISTER}>Get Started Free</Link>
                            </Button>
                            <Button asChild variant="outline" size="xl">
                                <Link href="#features">Explore Features</Link>
                            </Button>
                        </div>

                        {/* Trust indicators */}
                        <div className="text-text-secondary mt-8 flex flex-wrap items-center justify-center gap-4 text-sm lg:justify-start">
                            <span className="flex items-center gap-1">
                                <span className="bg-success inline-block size-2 rounded-full" />
                                No credit card required
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="bg-success inline-block size-2 rounded-full" />
                                Free forever
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="bg-success inline-block size-2 rounded-full" />
                                Open source
                            </span>
                        </div>
                    </motion.div>

                    {/* Hero Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative">
                        <div className="shadow-raised-lg relative aspect-[4/3] overflow-hidden rounded-3xl">
                            <Image
                                src="/images/hero.png"
                                alt="Hero illustration showing the Mimic Box dashboard with music streaming, anime tracking, and gaming features displayed across multiple device screens"
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                            />
                        </div>

                        {/* Floating cards decoration */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="shadow-floating-md bg-tertiary absolute -right-4 -bottom-4 rounded-xl p-3 sm:-right-8 sm:-bottom-8 sm:p-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-highlight/20 flex size-10 items-center justify-center rounded-full sm:size-12">
                                    <span className="text-highlight text-lg sm:text-xl">🎵</span>
                                </div>
                                <div>
                                    <p className="text-text-primary text-sm font-semibold sm:text-base">Now Playing</p>
                                    <p className="text-text-secondary text-xs sm:text-sm">Your favorite track</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                            className="shadow-floating-md bg-tertiary absolute -top-4 -left-4 rounded-xl p-3 sm:-top-8 sm:-left-8 sm:p-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-accent/20 flex size-10 items-center justify-center rounded-full sm:size-12">
                                    <span className="text-lg sm:text-xl">🎮</span>
                                </div>
                                <div>
                                    <p className="text-text-primary text-sm font-semibold sm:text-base">Games Online</p>
                                    <p className="text-text-secondary text-xs sm:text-sm">Play with friends</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
