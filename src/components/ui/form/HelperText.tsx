import cn from '@/lib/utils/cn';

const HelperText = ({ children, className }: { children?: React.ReactNode; className?: string }) => {
    if (!children) return null;

    return (
        <p data-component="form" data-element="helper" className={cn('text-text-secondary mt-1 text-xs', className)}>
            {children}
        </p>
    );
};

export default HelperText;
