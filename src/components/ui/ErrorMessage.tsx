import Icon from '@/components/ui/Icon';
import cn from '@/lib/utils/cn';

const ErrorMessage = ({ message, className }: { message?: string | null; className?: string }) => {
    if (!message) return null;

    return (
        <p
            role="alert"
            aria-live="assertive"
            className={cn('text-danger bg-danger/20 my-2 flex items-center rounded-lg px-3 py-1 text-xs', className)}>
            <Icon icon="error" className="mr-1 size-5 shrink-0" />
            {message}
        </p>
    );
};

export default ErrorMessage;
