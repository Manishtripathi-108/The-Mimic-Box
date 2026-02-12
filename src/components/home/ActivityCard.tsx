'use client';

import Image from 'next/image';
import Link from 'next/link';

import { motion } from 'framer-motion';

import Icon from '../ui/Icon';

type ActivityCardProps = {
    title: string;
    description: string;
    time: string;
    image?: {
        src: string;
        alt: string;
    };
    href: string;
    index?: number;
};

const ActivityCard = ({ title, description, time, image, href, index = 0 }: ActivityCardProps) => {
    return (
        <motion.article initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
            <Link
                href={href}
                className="shadow-floating-xs bg-tertiary group hover:shadow-raised-sm flex items-center gap-3 rounded-xl p-3 transition-all duration-300">
                {/* Image or Icon */}
                <div className="bg-secondary shadow-pressed-xs relative size-12 shrink-0 overflow-hidden rounded-lg">
                    {image ? (
                        <Image src={image.src} alt={image.alt} fill sizes="48px" className="object-cover" />
                    ) : (
                        <div className="flex size-full items-center justify-center">
                            <Icon icon="pending" className="text-text-secondary size-6" />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                    <h4 className="text-text-primary group-hover:text-highlight line-clamp-1 text-sm font-semibold transition-colors">{title}</h4>
                    <p className="text-text-secondary line-clamp-1 text-xs">{description}</p>
                </div>

                {/* Time */}
                <span className="text-text-secondary shrink-0 text-xs">{time}</span>
            </Link>
        </motion.article>
    );
};

export const ActivityCardSkeleton = () => {
    return (
        <div className="bg-tertiary flex animate-pulse items-center gap-3 rounded-xl p-3">
            <div className="bg-secondary size-12 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
                <div className="bg-secondary h-4 w-3/4 rounded" />
                <div className="bg-secondary h-3 w-1/2 rounded" />
            </div>
            <div className="bg-secondary h-3 w-12 rounded" />
        </div>
    );
};

export default ActivityCard;
