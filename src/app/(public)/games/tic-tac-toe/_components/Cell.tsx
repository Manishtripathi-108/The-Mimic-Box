'use client';

import React, { memo } from 'react';

import Icon from '@/components/ui/Icon';
import cn from '@/lib/utils/cn';

const Cell = ({
    value,
    isActive = false,
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
            className={cn('button button-secondary aspect-square size-full p-1', {
                'button-highlight': isActive,
                'text-accent': isWinningSquare,
                active: !!value,
            })}
            {...props}>
            {value && (
                <Icon
                    icon={value === 'D' ? 'draw' : value === 'X' ? 'close' : 'circle'}
                    className="animate-zoom-in size-full transition-transform duration-300 ease-in-out select-none"
                />
            )}
        </button>
    );
};

export default memo(Cell);
