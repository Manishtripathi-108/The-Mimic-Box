import Icon from '@/components/ui/Icon';
import cn from '@/lib/utils/cn';

const ErrorMessage = ({ message, className }: { message?: string | null; className?: string }) => {
    if (!message) return null;

    return (
        <p role="alert" aria-live="assertive" className={cn('flex items-center rounded-lg bg-red-400/10 px-3 py-1 text-xs text-red-500', className)}>
            <Icon icon="error" className="h-full shrink-0" />
            {message}
        </p>
    );
};

export default ErrorMessage;
