import { Children, cloneElement, isValidElement, memo, useId } from 'react';

import ErrorText from '@/components/ui/form/ErrorText';
import HelperText from '@/components/ui/form/HelperText';
import Label from '@/components/ui/form/Label';
import cn from '@/lib/utils/cn';

type FormFieldProps = {
    id?: string;
    label?: string;
    error?: string | null;
    helper?: string;
    children: React.ReactNode;
    className?: string;
    labelClassName?: string;
};

const FORM_ELEMENTS = ['input', 'select', 'textarea'];

const FormField = ({ id, label, error, helper, children, className, labelClassName }: FormFieldProps) => {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const hasError = Boolean(error);
    const describedById = helper && !hasError ? `${fieldId}-helper` : error ? `${fieldId}-error` : undefined;

    let applied = false;

    const enhancedChildren = Children.map(children, (child) => {
        if (!isValidElement(child)) return child;

        // only apply to first valid form element
        if (!applied && typeof child.type === 'string' && FORM_ELEMENTS.includes(child.type)) {
            applied = true;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return cloneElement(child as any, {
                id: fieldId,
                'aria-invalid': hasError || undefined,
                'data-invalid': hasError || undefined,
                'aria-describedby': describedById,
            });
        }

        return child;
    });

    return (
        <div data-component="form" data-element="form-field" className={cn('w-full space-y-1', className)}>
            {label && (
                <Label htmlFor={fieldId} className={labelClassName}>
                    {label}
                </Label>
            )}

            {enhancedChildren}

            {hasError ? <ErrorText id={`${fieldId}-error`} text={error!} /> : <HelperText id={`${fieldId}-helper`} text={helper} />}
        </div>
    );
};

export default memo(FormField);
