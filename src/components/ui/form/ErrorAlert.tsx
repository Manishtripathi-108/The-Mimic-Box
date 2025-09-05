import Icon from '@/components/ui/Icon';
import ErrorText from '@/components/ui/form/ErrorText';
import cn from '@/lib/utils/cn';

const ErrorAlert = ({ text, children, className, ...props }: { text?: string | null } & React.ComponentProps<'p'>) => {
    if (!text || !children) return null;

    return (
        <ErrorText
            text={text}
            data-element="error-alert"
            className={cn('bg-danger/20 my-2 flex items-center rounded-lg px-3 py-1', className)}
            {...props}>
            <Icon icon="error" className="mr-1 size-5 shrink-0" />
            {children}
        </ErrorText>
    );
};

export default ErrorAlert;
