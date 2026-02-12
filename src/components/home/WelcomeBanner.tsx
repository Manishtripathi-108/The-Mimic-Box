'use client';

import Image from 'next/image';

import { motion } from 'motion/react';
import { Session } from 'next-auth';

import Icon from '../ui/Icon';

type WelcomeBannerProps = {
    user?: Session['user'];
};

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
};

const WelcomeBanner = ({ user }: WelcomeBannerProps) => {
    const greeting = getGreeting();
    const firstName = user?.name || 'there';

    return (
        <motion.section
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="shadow-floating-md bg-gradient-secondary-to-tertiary relative overflow-hidden rounded-3xl p-6 sm:p-8">
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10">
                <div className="bg-highlight/5 absolute -top-20 -right-20 size-40 rounded-full blur-3xl" />
                <div className="bg-accent/5 absolute -bottom-20 -left-20 size-40 rounded-full blur-3xl" />
            </div>

            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
                {/* Text Content */}
                <div className="flex-1">
                    <h1 className="text-text-primary font-alegreya text-2xl font-bold sm:text-3xl lg:text-4xl">
                        {greeting},<span className="text-highlight"> {firstName}</span>!
                    </h1>
                    <p className="text-text-secondary mt-2 max-w-lg text-base sm:text-lg">
                        Ready to explore? Jump into your music, anime, or start a new game.
                    </p>
                </div>

                {/* User Avatar or Illustration */}
                <div className="shadow-raised-md relative size-20 shrink-0 overflow-hidden rounded-full sm:size-24">
                    {user?.image ? (
                        <Image
                            src={user.image}
                            alt={`Profile picture of ${user.name || 'user'}`}
                            fill
                            sizes="96px"
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="bg-secondary flex size-full items-center justify-center">
                            <Icon icon="person" className="text-text-secondary size-10 sm:size-12" />
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                <div className="shadow-pressed-xs bg-primary rounded-xl p-3 text-center">
                    <p className="text-highlight text-lg font-bold sm:text-xl">--</p>
                    <p className="text-text-secondary text-xs sm:text-sm">Playlists</p>
                </div>
                <div className="shadow-pressed-xs bg-primary rounded-xl p-3 text-center">
                    <p className="text-highlight text-lg font-bold sm:text-xl">--</p>
                    <p className="text-text-secondary text-xs sm:text-sm">Anime</p>
                </div>
                <div className="shadow-pressed-xs bg-primary rounded-xl p-3 text-center">
                    <p className="text-highlight text-lg font-bold sm:text-xl">--</p>
                    <p className="text-text-secondary text-xs sm:text-sm">Games</p>
                </div>
                <div className="shadow-pressed-xs bg-primary rounded-xl p-3 text-center">
                    <p className="text-highlight text-lg font-bold sm:text-xl">--</p>
                    <p className="text-text-secondary text-xs sm:text-sm">Tracks</p>
                </div>
            </div>
        </motion.section>
    );
};

export default WelcomeBanner;
