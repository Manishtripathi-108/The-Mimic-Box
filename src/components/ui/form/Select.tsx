import { DATA_INVALID, DISABLED } from '@/lib/styles/tailwind.helpers';
import cn from '@/lib/utils/cn';

function Select({ className, children, autoComplete = 'on', ...props }: React.ComponentProps<'select'>) {
    return (
        <select
            data-component="form"
            data-element="field"
            data-field-type="select"
            autoComplete={autoComplete}
            className={cn(
                'bg-primary text-text-primary shadow-floating-xs focus:shadow-pressed-xs selection:bg-tertiary selection:text-text-primary flex h-9 w-full min-w-0 rounded-xl border border-transparent px-3 text-sm outline-hidden transition-[color,box-shadow] outline-none',
                DATA_INVALID,
                DISABLED,
                className
            )}
            {...props}>
            {children}
        </select>
    );
}

export default Select;
