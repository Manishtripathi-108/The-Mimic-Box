import { memo, useId } from 'react';

import { DATA_INVALID, DISABLED } from '@/lib/styles/tailwind.helpers';
import cn from '@/lib/utils/cn';

export type RadioProps = {
    id?: string;
    name: string;
    value: string;
    defaultChecked?: boolean;
    disabled?: boolean;
    children?: React.ReactNode;
    className?: { label?: string; field?: string };
    color?: 'primary' | 'secondary' | 'accent' | 'danger' | 'warning' | 'success' | 'highlight';
};

const colorStyles = {
    primary: 'text-text-primary checked:bg-primary',
    secondary: 'text-text-primary checked:bg-secondary',
    accent: 'text-white checked:bg-accent',
    danger: 'text-white checked:bg-danger',
    warning: 'text-white checked:bg-warning',
    success: 'text-white checked:bg-success',
    highlight: 'text-white checked:bg-highlight',
};

const Radio = ({
    id,
    name,
    value,
    defaultChecked,
    disabled,
    children,
    className,
    color = 'primary',
    ...props
}: RadioProps & Omit<React.ComponentProps<'input'>, 'className'>) => {
    const radioId = useId();

    return (
        <label
            htmlFor={id || radioId}
            className={cn(
                'group inline-flex cursor-pointer items-center gap-2 select-none',
                disabled && 'cursor-not-allowed opacity-60',
                className?.label
            )}>
            <input
                id={id || radioId}
                name={name}
                type="radio"
                value={value}
                defaultChecked={defaultChecked}
                disabled={disabled}
                data-component="form"
                data-element="field"
                data-field-type="radio"
                className={cn(
                    'peer checked:shadow-pressed-xs shrink-0 cursor-pointer appearance-none rounded-full border transition-[shadow,color]',
                    'checked:after:flex checked:after:size-full checked:after:items-center checked:after:justify-center checked:after:rounded-full checked:after:content-["●"]',
                    colorStyles[color],
                    DISABLED,
                    DATA_INVALID,
                    className?.field
                )}
                {...props}
            />

            {children && <span className="peer-checked:text-highlight text-text-secondary transition-colors">{children}</span>}
        </label>
    );
};

export default memo(Radio);
