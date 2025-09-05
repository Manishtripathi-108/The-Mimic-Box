import cn from '@/lib/utils/cn';

const HelperText = ({ text, children, className, ...props }: { text?: string } & React.ComponentProps<'p'>) => {
    if (!children && !text) return null;

    return (
        <p data-component="form" data-element="helper-text" className={cn('text-text-secondary mt-1 text-xs', className)} {...props}>
            {children || text}
        </p>
    );
};

export default HelperText;
