'use client';

import React, { memo } from 'react';

import { Button } from '@/components/ui/Button';
import cn from '@/lib/utils/cn';

type T_CellValue = 'X' | 'O' | 'D' | null;

type CellProps = Omit<React.ComponentProps<'button'>, 'value'> & {
    value: T_CellValue;
    isActive?: boolean;
    isWinningSquare?: boolean;
    disabled?: boolean;
};

const Cell = ({ value, isActive = false, isWinningSquare = false, disabled = false, ...props }: CellProps) => {
    const hasValue = !!value;
    const icon = value === 'X' ? 'close' : value === 'O' ? 'circle' : value === 'D' ? 'draw' : undefined;

    return (
        <Button
            aria-label={`Cell ${value ?? 'empty'}`}
            aria-pressed={hasValue}
            variant={isActive ? 'highlight' : 'secondary'}
            className={cn('disabled:text-text-primary relative aspect-square size-full rounded-lg p-1', isWinningSquare && 'text-accent')}
            icon={icon}
            iconClassName="size-full select-none animate-zoom-in transition-transform duration-300 ease-in-out"
            active={hasValue}
            disabled={hasValue || disabled}
            {...props}
        />
    );
};

export default memo(Cell);
