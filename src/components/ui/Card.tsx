import { forwardRef } from 'react';

import cn from '@/lib/utils/cn';

export const Card = forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(({ className, ...props }, ref) => (
    <div
        data-slot="card"
        className={cn(
            'bg-secondary text-text-secondary flex flex-col gap-6 overflow-hidden rounded-xl py-6 shadow-sm has-data-[slot=card-footer]:pb-0 has-data-[slot=card-header]:pt-0',
            className
        )}
        ref={ref}
        {...props}
    />
));

Card.displayName = 'Card';

export const CardHeader = ({ className, ...props }: React.ComponentProps<'div'>) => (
    <div
        data-slot="card-header"
        className={cn(
            'shadow-raised-xs @container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 p-6 has-data-[slot=card-action]:grid-cols-[1fr_auto]',
            className
        )}
        {...props}
    />
);

export const CardTitle = ({ className, ...props }: React.ComponentProps<'div'>) => (
    <div data-slot="card-title" className={cn('text-text-primary text-xl leading-none font-semibold', className)} {...props} />
);

export const CardDescription = ({ className, ...props }: React.ComponentProps<'div'>) => (
    <div data-slot="card-description" className={cn('text-text-secondary text-sm', className)} {...props} />
);

export const CardAction = ({ className, ...props }: React.ComponentProps<'div'>) => (
    <div data-slot="card-action" className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)} {...props} />
);

export const CardContent = forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(({ className, ...props }, ref) => (
    <div data-slot="card-content" className={cn('px-6', className)} ref={ref} {...props} />
));

CardContent.displayName = 'CardContent';

export const CardFooter = ({ className, ...props }: React.ComponentProps<'div'>) => (
    <div data-slot="card-footer" className={cn('flex items-center px-6 pb-6 [.border-t]:pt-6', className)} {...props} />
);
