'use client';

import { motion } from 'motion/react';

import { T_IconType } from '@/lib/types/client.types';

import Icon from '../ui/Icon';

type UseCaseCardProps = {
    title: string;
    description: string;
    icon: T_IconType;
    index?: number;
};

const UseCaseCard = ({ title, description, icon, index = 0 }: UseCaseCardProps) => {
    return (
        <motion.article
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="shadow-floating-xs bg-tertiary group hover:shadow-raised-sm flex items-start gap-4 rounded-xl p-5 transition-all duration-300">
            <div className="shadow-pressed-xs bg-secondary text-highlight group-hover:bg-highlight group-hover:text-on-highlight flex size-12 shrink-0 items-center justify-center rounded-xl transition-colors">
                <Icon icon={icon} className="size-6" />
            </div>
            <div>
                <h3 className="text-text-primary mb-1 font-semibold">{title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
            </div>
        </motion.article>
    );
};

export default UseCaseCard;
