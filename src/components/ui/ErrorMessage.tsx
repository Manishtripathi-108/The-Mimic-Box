import Icon from '@/components/ui/Icon';
import cn from '@/lib/utils/cn';

const ErrorMessage = ({ message, className }: { message?: string | null; className?: string }) => {
    if (!message) return null;

    return (
        <p
            role="alert"
            aria-live="assertive"
            className={cn('text-danger my-1 flex items-center rounded-lg bg-red-400/10 px-3 py-1 text-xs', className)}>
            <Icon icon="error" className="mr-1 size-5 shrink-0" />
            {message}
        </p>
    );
};

export default ErrorMessage;
