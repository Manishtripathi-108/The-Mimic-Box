import { Children, cloneElement, isValidElement, memo, useId } from 'react';

import cn from '@/lib/utils/cn';

import ErrorText from './ErrorText';
import HelperText from './HelperText';
import Label from './Label';

type FormFieldProps = {
    id?: string;
    label?: string;
    error?: string | null;
    helper?: string;
    children: React.ReactNode;
    className?: string;
};

const FormField = ({ id, label, error, helper, children, className }: FormFieldProps) => {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const hasError = Boolean(error);
    const describedById = helper && !error ? `${fieldId}-helper` : error ? `${fieldId}-error` : undefined;

    const enhancedChildren = Children.map(children, (child) =>
        isValidElement(child)
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              cloneElement(child as any, {
                  id: fieldId,
                  'aria-invalid': hasError || undefined,
                  'data-invalid': hasError || undefined,
                  'aria-describedby': describedById,
              })
            : child
    );

    return (
        <div data-component="form" data-element="form-field" className={cn('w-full space-y-1', className)}>
            {label && <Label htmlFor={fieldId}>{label}</Label>}

            {enhancedChildren}

            {hasError ? <ErrorText id={`${fieldId}-helper`} text={error!} /> : helper && <HelperText id={`${fieldId}-helper`} text={helper} />}
        </div>
    );
};

export default memo(FormField);
