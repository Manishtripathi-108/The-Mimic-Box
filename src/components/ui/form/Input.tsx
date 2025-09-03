import { DATA_INVALID, DISABLED } from '@/lib/styles/tailwind.helpers';
import cn from '@/lib/utils/cn';

const Input = ({ className, type, autoComplete = 'on', ...props }: React.ComponentProps<'input'>) => {
    return (
        <input
            type={type}
            autoComplete={autoComplete}
            data-component="form"
            data-element="field"
            data-field-type="input"
            className={cn(
                'placeholder:text-text-secondary',
                'selection:bg-tertiary selection:text-text-primary',
                'bg-primary text-text-primary shadow-floating-xs focus:shadow-pressed-xs flex h-10 w-full min-w-0 rounded-xl border border-transparent px-3 py-1 text-base outline-hidden transition-[color,_box-shadow,_border] duration-1000 outline-none md:text-sm',
                'file:bg-accent file:inline-flex file:h-7 file:cursor-pointer file:border-0 file:text-sm file:font-medium file:text-white',
                DATA_INVALID,
                DISABLED,
                className
            )}
            {...props}
        />
    );
};

export default Input;
