import { memo } from 'react';

import Slot from '@/components/Slot';
import Icon from '@/components/ui/Icon';
import { DISABLED, FOCUS_RING, SVG_UTILS } from '@/lib/styles/tailwind.helpers';
import { T_IconType } from '@/lib/types/client.types';
import cn from '@/lib/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'highlight' | 'accent' | 'danger' | 'outline' | 'ghost' | 'link' | 'transparent';

type ButtonSize = 'sm' | 'md' | 'lg';

type CommonProps = {
    variant?: ButtonVariant;
    size?: ButtonSize;
    active?: boolean;
};

type ButtonWithChild = CommonProps & {
    asChild: true;
    icon?: never;
    iconClassName?: never;
    children: React.ReactNode;
};

type ButtonWithoutChild = CommonProps & {
    asChild?: false;
    icon?: T_IconType;
    iconClassName?: string;
    children?: React.ReactNode;
};

type ButtonProps = React.ComponentProps<'button'> & (ButtonWithChild | ButtonWithoutChild);

const BASE_CLASSES =
    'inline-flex items-center justify-center gap-2 text-sm font-medium whitespace-nowrap transition-all transform outline-none cursor-pointer shadow-floating-xs active:shadow-pressed-xs [&:hover:not(.active)]:scale-105 [&:focus:not(.active)]:scale-105';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
    primary: 'bg-primary text-text-secondary hover:text-text-primary hover:bg-primary/90',
    secondary: 'bg-secondary text-text-secondary hover:text-text-primary hover:bg-secondary/80',
    tertiary: 'bg-tertiary text-text-secondary hover:text-text-primary hover:bg-tertiary/80',
    highlight: 'from-highlight bg-linear-150 from-25% to-[#003032] to-75% text-gray-100 hover:text-white dark:to-[#1a676a]',
    accent: 'from-accent bg-linear-150 from-25% to-[#af1e32] to-75% text-gray-100 hover:text-white hover:text-gray-200 dark:to-[#ff0022]',
    danger: 'bg-linear-150 from-red-500 from-25% to-red-900 to-75% text-gray-100 hover:text-white dark:to-[#ff0022]',
    outline: 'shadow-none border text-text-secondary hover:text-text-primary hover:border-text-primary',
    ghost: 'shadow-none text-text-secondary hover:text-text-primary hover:shadow-floating-xs hover:bg-secondary',
    transparent: 'shadow-none hover:text-text-primary text-text-secondary',
    link: 'shadow-none text-text-secondary hover:text-text-primary underline-offset-4 hover:underline',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
    sm: 'h-6 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-xs',
    md: 'h-8 rounded-lg px-4 py-2 has-[>svg]:px-3',
    lg: 'h-10 rounded-xl px-6 has-[>svg]:px-4 text-base',
};

const ICON_ONLY_SIZE_CLASSES: Record<ButtonSize, string> = {
    sm: 'size-6 p-1 rounded-full',
    md: 'size-8 p-1.5 rounded-full',
    lg: 'size-10 p-2 rounded-full',
};

const groupButtonStyles: Record<ButtonSize, string> = {
    sm: 'group-[.group]:rounded-none group-[.group]:first:rounded-l-md group-[.group]:last:rounded-r-md',
    md: 'group-[.group]:rounded-none group-[.group]:first:rounded-l-lg group-[.group]:last:rounded-r-lg',
    lg: 'group-[.group]:rounded-none group-[.group]:first:rounded-l-xl group-[.group]:last:rounded-r-xl',
};

export const Button = memo(
    ({ className, variant = 'primary', size = 'md', asChild = false, active = false, icon, iconClassName, children, ...props }: ButtonProps) => {
        const isIconOnly = !!icon && !children;
        const Comp = asChild ? Slot : 'button';

        const finalClassName = cn(
            BASE_CLASSES,
            SVG_UTILS,
            FOCUS_RING,
            DISABLED,
            VARIANT_CLASSES[variant],
            isIconOnly ? ICON_ONLY_SIZE_CLASSES[size] : SIZE_CLASSES[size],
            groupButtonStyles[size],
            className,
            active && 'shadow-pressed-xs active'
        );

        props = {
            ...props,
            type: !asChild ? props.type || 'button' : undefined,
        };

        return (
            <Comp className={finalClassName} {...props}>
                {icon && <Icon icon={icon} className={cn('pointer-events-none shrink-0', isIconOnly ? 'size-full' : 'size-5', iconClassName)} />}
                {children}
            </Comp>
        );
    }
);

Button.displayName = 'Button';

export const ButtonGroup = memo(({ children }: { children: React.ReactNode }) => {
    return <div className="group inline-flex rounded-xl">{children}</div>;
});

ButtonGroup.displayName = 'ButtonGroup';
