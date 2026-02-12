'use client';

import Image from 'next/image';
import Link from 'next/link';

import { motion } from 'framer-motion';

import { T_IconType } from '@/lib/types/client.types';

import Icon from '../ui/Icon';

type HighlightCardProps = {
    title: string;
    subtitle?: string;
    image: {
        src: string;
        alt: string;
    };
    href: string;
    icon?: T_IconType;
    index?: number;
};

const HighlightCard = ({ title, subtitle, image, href, icon, index = 0 }: HighlightCardProps) => {
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group relative w-44 shrink-0 sm:w-48">
            <Link href={href} className="block focus:outline-none" title={title} aria-label={title}>
                {/* Image Container */}
                <div className="shadow-floating-sm group-hover:shadow-raised-md group-focus:shadow-raised-md relative aspect-square overflow-hidden rounded-2xl transition-shadow duration-300">
                    <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 640px) 176px, 192px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105 group-focus:scale-105"
                    />

                    {/* Hover Overlay */}
                    <div className="bg-secondary/50 absolute inset-0 flex items-center justify-center opacity-0 backdrop-blur-xs transition-opacity duration-300 group-hover:opacity-100 group-focus:opacity-100">
                        {icon && <Icon icon={icon} className="text-text-primary size-12" />}
                    </div>
                </div>

                {/* Text Content */}
                <div className="mt-3 px-1">
                    <h3 className="text-text-primary group-hover:text-highlight line-clamp-1 font-semibold transition-colors">{title}</h3>
                    {subtitle && <p className="text-text-secondary mt-0.5 line-clamp-1 text-sm">{subtitle}</p>}
                </div>
            </Link>
        </motion.article>
    );
};

export const HighlightCardSkeleton = () => {
    return (
        <div className="w-44 shrink-0 animate-pulse sm:w-48">
            <div className="bg-secondary aspect-square rounded-2xl" />
            <div className="mt-3 px-1">
                <div className="bg-secondary h-5 w-3/4 rounded" />
                <div className="bg-secondary mt-1.5 h-4 w-1/2 rounded" />
            </div>
        </div>
    );
};

export default HighlightCard;
