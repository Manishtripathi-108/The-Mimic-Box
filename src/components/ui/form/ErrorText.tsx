import cn from '@/lib/utils/cn';

const ErrorText = ({ text, children, className, ...props }: { text?: string | null } & React.ComponentProps<'p'>) => {
    if (!text && !children) return null;

    return (
        <p role="alert" aria-live="assertive" data-component="form" data-element="error-text" className={cn('text-danger text-xs', className)} {...props}>
            {children || text}
        </p>
    );
};

export default ErrorText;
