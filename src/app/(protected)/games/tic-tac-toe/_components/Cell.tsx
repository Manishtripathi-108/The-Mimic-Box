'use client';

import React, { memo } from 'react';

import { AnimatePresence, motion } from 'motion/react';

import cn from '@/lib/utils/cn';

const Cell = ({
    value,
    onClick,
    isActive = false,
    classic = false,
    isWinningSquare = false,
}: {
    value: 'X' | 'O' | 'D' | null;
    onClick: () => void;
    isActive?: boolean;
    classic?: boolean;
    isWinningSquare?: boolean;
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={`Cell ${value || 'empty'}`}
            aria-pressed={!!value}
            className={cn(
                'button button-secondary p-2',
                classic ? 'size-20 text-6xl md:size-32 md:text-8xl' : 'size-8 text-xl md:size-12 md:text-4xl',
                {
                    'button-highlight': isActive,
                    active: !!value,
                    'text-accent': isWinningSquare,
                }
            )}>
            <AnimatePresence>
                {value && (
                    <motion.span
                        className="select-none"
                        variants={{
                            hidden: { opacity: 0, scale: 3 },
                            visible: { opacity: 1, scale: 1 },
                            winner: {
                                opacity: [1, 1, 1],
                                scale: [0.8, 1.3, 0.8],
                                transition: {
                                    duration: 1.5,
                                    repeat: Infinity,
                                    repeatType: 'reverse',
                                    ease: 'easeInOut',
                                },
                            },
                            exit: { opacity: 0, scale: 0.5 },
                        }}
                        initial="hidden"
                        animate={isWinningSquare ? 'winner' : 'visible'}
                        exit="exit">
                        {value}
                    </motion.span>
                )}
            </AnimatePresence>
        </button>
    );
};

export default memo(Cell);
