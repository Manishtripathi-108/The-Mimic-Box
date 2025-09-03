import { DATA_INVALID, DISABLED } from '@/lib/styles/tailwind.helpers';
import cn from '@/lib/utils/cn';

function Textarea({ className, autoComplete = 'on', ...props }: React.ComponentProps<'textarea'>) {
    return (
        <textarea
            autoComplete={autoComplete}
            data-component="form"
            data-element="field"
            data-field-type="textarea"
            className={cn(
                'scrollbar-thin min-h-20',
                'placeholder:text-text-secondary',
                'selection:bg-tertiary selection:text-text-primary',
                'bg-primary text-text-primary shadow-floating-xs focus:shadow-pressed-xs flex h-10 w-full min-w-0 rounded-xl border border-transparent px-3 py-1 text-base outline-hidden transition-[color,_box-shadow,_border] duration-1000 outline-none md:text-sm',
                DATA_INVALID,
                DISABLED,
                className
            )}
            {...props}
        />
    );
}

export default Textarea;
