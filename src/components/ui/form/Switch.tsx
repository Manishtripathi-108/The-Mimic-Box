'use client';

import { memo, useId } from 'react';

import cn from '@/lib/utils/cn';

export type SwitchProps = {
    id?: string;
    checked?: boolean;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
    className?: string;
};

const Switch = ({
    id,
    checked,
    disabled,
    onChange,
    className,
    ...props
}: SwitchProps & Omit<React.ComponentProps<'button'>, 'onChange' | 'type'>) => {
    const switchId = useId();

    return (
        <button
            id={id || switchId}
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            data-component="form"
            data-element="field"
            data-field-type="switch"
            onClick={() => !disabled && onChange?.(!checked)}
            className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                checked ? 'bg-primary' : 'bg-gray-300',
                disabled && 'cursor-not-allowed opacity-60',
                className
            )}
            {...props}>
            <span
                className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    checked ? 'translate-x-6' : 'translate-x-1'
                )}
            />
        </button>
    );
};

export default memo(Switch);
