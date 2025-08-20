import { memo, useId } from 'react';

import { DATA_INVALID, DISABLED } from '@/lib/styles/tailwind.helpers';
import cn from '@/lib/utils/cn';

export type CheckboxProps = {
    id?: string;
    name?: string;
    value?: string;
    defaultChecked?: boolean;
    disabled?: boolean;
    children?: React.ReactNode;
    className?: { label?: string; field?: string };
    position?: 'left' | 'right';

    /** Theme options */
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'secondary' | 'accent' | 'danger' | 'warning' | 'success' | 'highlight';
};

const sizeStyles: Record<NonNullable<CheckboxProps['size']>, string> = {
    sm: 'size-4 text-sm',
    md: 'size-5 text-md',
    lg: 'size-6 text-lg',
};

const colorStyles: Record<NonNullable<CheckboxProps['color']>, string> = {
    primary: 'text-text-primary checked:bg-primary',
    secondary: 'text-text-primary checked:bg-secondary',
    accent: 'text-white checked:bg-accent [--lower-shadow:#a90c21] [--upper-shadow:#ff1437]',
    danger: 'text-white checked:bg-danger [--lower-shadow:#941616] [--upper-shadow:#de2222]',
    warning: 'text-white checked:bg-warning [--lower-shadow:#a35905] [--upper-shadow:#ff9508]',
    success: 'text-white checked:bg-success [--lower-shadow:#10602e] [--upper-shadow:#1aa04c]',
    highlight: 'text-white checked:bg-highlight [--lower-shadow:#004447] [--upper-shadow:#007176]',
};

const Checkbox = ({
    id,
    name,
    value,
    defaultChecked,
    disabled,
    children,
    className,
    position = 'right',
    size = 'md',
    color = 'primary',
    ...props
}: CheckboxProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'className'>) => {
    const checkboxId = useId();

    return (
        <label
            htmlFor={id || checkboxId}
            className={cn(
                'group inline-flex cursor-pointer items-center gap-2 select-none',
                disabled && 'cursor-not-allowed opacity-60',
                position === 'left' && 'flex-row-reverse justify-between',
                className?.label
            )}>
            {/* Native Input */}
            <input
                id={id || checkboxId}
                name={name}
                type="checkbox"
                value={value}
                defaultChecked={defaultChecked}
                disabled={disabled}
                className={cn(
                    'peer checked:shadow-pressed-xs shrink-0 cursor-pointer appearance-none overflow-hidden rounded-sm border transition-[shadow,color] ease-in-out',
                    `checked:after:flex checked:after:size-full checked:after:items-center checked:after:justify-center checked:after:font-bold checked:after:content-['✓']`,
                    sizeStyles[size],
                    colorStyles[color],
                    DISABLED,
                    DATA_INVALID,
                    className?.field
                )}
                {...props}
            />

            {/* Label Content */}
            {children && (
                <span
                    className={cn(
                        'peer-checked:text-highlight group-hover:text-highlight peer-focus:text-highlight text-text-secondary transition-[transform,colors]',
                        position === 'left'
                            ? 'group-hover:-translate-x-1 peer-checked:-translate-x-1 peer-focus:-translate-x-1'
                            : 'group-hover:translate-x-1 peer-checked:translate-x-1 peer-focus:translate-x-1'
                    )}>
                    {children}
                </span>
            )}
        </label>
    );
};

export default memo(Checkbox);
