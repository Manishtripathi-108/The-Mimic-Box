import { HTMLAttributes, ReactNode } from 'react';

import cn from '@/lib/utils/cn';

interface CardContainerProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
    contentClassName?: string;
    resetContentClassName?: boolean;
}

const CardContainer = ({ children, className, contentClassName, resetContentClassName = false, ...props }: CardContainerProps) => {
    return (
        <div
            className={cn('from-secondary to-tertiary shadow-floating-sm rounded-2xl bg-linear-150 from-15% to-85% p-2 sm:p-6', className)}
            {...props}>
            <div className={cn({ 'rounded-lg border p-2 sm:p-6': !resetContentClassName }, contentClassName)}>{children}</div>
        </div>
    );
};

export default CardContainer;
