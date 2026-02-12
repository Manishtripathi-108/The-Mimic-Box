'use client';

import Image from 'next/image';

import { motion } from 'motion/react';

import { T_IconType } from '@/lib/types/client.types';

import Icon from '../ui/Icon';

type FeatureCardProps = {
    title: string;
    description: string;
    icon?: T_IconType;
    image?: {
        src: string;
        alt: string;
    };
    index?: number;
};

const FeatureCard = ({ title, description, icon, image, index = 0 }: FeatureCardProps) => {
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="shadow-floating-sm bg-gradient-secondary-to-tertiary group hover:shadow-raised-md flex flex-col items-center rounded-2xl p-6 text-center transition-all duration-300">
            {/* Icon or Image */}
            <div className="shadow-raised-sm bg-primary mb-6 flex size-16 items-center justify-center rounded-2xl transition-transform group-hover:scale-110">
                {icon ? (
                    <Icon icon={icon} className="text-highlight size-8" />
                ) : image ? (
                    <div className="relative size-full overflow-hidden rounded-xl">
                        <Image src={image.src} alt={image.alt} fill sizes="64px" className="object-cover" />
                    </div>
                ) : (
                    <div className="bg-highlight/20 size-full rounded-xl" />
                )}
            </div>

            {/* Content */}
            <h3 className="text-text-primary mb-3 text-xl font-semibold">{title}</h3>
            <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
        </motion.article>
    );
};

export default FeatureCard;
