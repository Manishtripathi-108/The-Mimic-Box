'use client';

import React, { memo } from 'react';

import cn from '@/lib/utils/cn';

const Cell = ({
    value,
    isActive = false,
    classic = false,
    isWinningSquare = false,
    ...props
}: {
    value: 'X' | 'O' | 'D' | null;
    isActive?: boolean;
    classic?: boolean;
    isWinningSquare?: boolean;
}) => {
    return (
        <button
            type="button"
            aria-label={`Cell ${value || 'empty'}`}
            aria-pressed={!!value}
            className={cn(
                'button button-secondary p-2',
                classic ? 'size-20 text-6xl md:size-32 md:text-8xl' : 'size-8 text-xl md:size-12 md:text-4xl',
                {
                    'button-highlight': isActive,
                    active: !!value,
                }
            )}
            {...props}>
            {value && (
                <span className={cn('animate-zoom-in transition-transform duration-300 ease-in-out select-none', isWinningSquare && 'text-accent')}>
                    {value}
                </span>
            )}
        </button>
    );
};

export default memo(Cell);
