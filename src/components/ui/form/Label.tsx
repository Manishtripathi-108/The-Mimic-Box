import cn from '@/lib/utils/cn';

const Label = ({ className, ...props }: React.ComponentProps<'label'>) => {
    return (
        <label
            data-component="form"
            data-element="label"
            className={cn(
                // base
                'text-text-secondary inline-flex items-center gap-2 text-sm leading-none font-medium capitalize select-none',

                // input + textarea + select valid state
                '[&:has(+_input:user-valid)]:text-success',
                '[&:has(+_textarea:user-valid)]:text-success',
                '[&:has(+_select:user-valid)]:text-success',

                // input + textarea + select disabled → stop interactions
                '[&:has(+_input:disabled)]:cursor-not-allowed [&:has(+_input:disabled)]:opacity-50',
                '[&:has(+_textarea:disabled)]:cursor-not-allowed [&:has(+_textarea:disabled)]:opacity-50',
                '[&:has(+_select:disabled)]:cursor-not-allowed [&:has(+_select:disabled)]:opacity-50',

                // input + textarea + select state-based styles
                '[&:has(+_input:hover)]:text-text-primary [&:has(+_input:focus)]:text-text-primary [&:has(+_input:not(:placeholder-shown))]:text-text-primary',
                '[&:has(+_textarea:hover)]:text-text-primary [&:has(+_textarea:focus)]:text-text-primary [&:has(+_textarea:not(:placeholder-shown))]:text-text-primary',
                '[&:has(+_select:hover)]:text-text-primary [&:has(+_select:focus)]:text-text-primary [&:has(+_select:not(:placeholder-shown))]:text-text-primary',

                // input + textarea + select invalid states
                '[&:has(+_input[data-invalid=true])]:text-danger [&:has(+_input:user-invalid)]:text-danger',
                '[&:has(+_textarea[data-invalid=true])]:text-danger [&:has(+_textarea:user-invalid)]:text-danger',
                '[&:has(+_select[data-invalid=true])]:text-danger [&:has(+_select:user-invalid)]:text-danger',

                // input + textarea + select required
                '[&:has(+_input:required)]:text-warning',
                '[&:has(+_textarea:required)]:text-warning',
                '[&:has(+_select:required)]:text-warning',

                className
            )}
            {...props}
        />
    );
};

export default Label;
