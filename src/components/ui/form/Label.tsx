import cn from '@/lib/utils/cn';

const Label = ({ className, ...props }: React.ComponentProps<'label'>) => {
    return (
        <label
            data-component="form"
            data-element="label"
            className={cn(
                // base
                'text-text-secondary inline-flex items-center gap-2 text-sm leading-none font-medium capitalize select-none',

                // input valid state
                '[&:has(+_input:user-valid)]:text-success',

                // input disabled → stop interactions
                '[&:has(+_input:disabled)]:cursor-not-allowed',
                '[&:has(+_input:disabled)]:opacity-50',

                // input state-based styles
                '[&:has(+_input:hover)]:text-text-primary',
                '[&:has(+_input:focus)]:text-text-primary',
                '[&:has(+_input:not(:placeholder-shown))]:text-text-primary',
                '[&:has(+_input[data-invalid=true])]:text-danger',
                '[&:has(+_input:user-invalid)]:text-danger',
                '[&:has(+_input:required)]:text-warning',

                className
            )}
            {...props}
        />
    );
};

export default Label;
