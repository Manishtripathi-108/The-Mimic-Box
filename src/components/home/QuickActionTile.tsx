'use client';

import Link from 'next/link';

import { motion } from 'motion/react';

import { T_IconType } from '@/lib/types/client.types';

import Icon from '../ui/Icon';

type QuickActionTileProps = {
    title: string;
    description: string;
    href: string;
    icon: T_IconType;
    color?: 'highlight' | 'accent' | 'success' | 'warning';
    index?: number;
};

const colorClasses = {
    highlight: 'bg-highlight/10 text-highlight group-hover:bg-highlight group-hover:text-on-highlight',
    accent: 'bg-accent/10 text-accent group-hover:bg-accent group-hover:text-on-accent',
    success: 'bg-success/10 text-success group-hover:bg-success group-hover:text-on-success',
    warning: 'bg-warning/10 text-warning group-hover:bg-warning group-hover:text-on-warning',
};

const QuickActionTile = ({ title, description, href, icon, color = 'highlight', index = 0 }: QuickActionTileProps) => {
    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
            <Link
                href={href}
                className="shadow-floating-xs bg-secondary group hover:shadow-raised-sm focus:ring-highlight/50 flex items-center gap-4 rounded-xl p-4 transition-all duration-300 focus:ring-2 focus:outline-none">
                <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${colorClasses[color]}`}>
                    <Icon icon={icon} className="size-6" />
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="text-text-primary group-hover:text-highlight line-clamp-1 font-semibold transition-colors">{title}</h3>
                    <p className="text-text-secondary line-clamp-1 text-sm">{description}</p>
                </div>
                <Icon icon="right" className="text-text-secondary size-5 shrink-0 transition-transform group-hover:translate-x-1" />
            </Link>
        </motion.div>
    );
};

export default QuickActionTile;
