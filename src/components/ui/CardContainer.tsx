import cn from '@/lib/utils/cn';

type CardContainerProps = {
    contentClassName?: string;
    resetContentClassName?: boolean;
} & React.ComponentProps<'div'>;

const CardContainer = ({ children, className, contentClassName, resetContentClassName = false, ...props }: CardContainerProps) => {
    return (
        <div className={cn('shadow-floating-sm bg-gradient-secondary-to-tertiary rounded-2xl p-2 sm:p-6', className)} {...props}>
            <div className={cn({ 'rounded-lg border p-2 sm:p-6': !resetContentClassName }, contentClassName)}>{children}</div>
        </div>
    );
};

export default CardContainer;
