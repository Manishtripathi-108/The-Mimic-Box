'use client';

import { FieldValues, useController } from 'react-hook-form';

import { TextareaProps } from '@/lib/types/client.types';
import cn from '@/lib/utils/cn';

const Textarea = <TFieldValues extends FieldValues>({
    label,
    placeholder = '',
    rows = 4,
    autoComplete,
    classNames = {},
    ...controllerProps
}: TextareaProps<TFieldValues>) => {
    const {
        field,
        fieldState: { error },
    } = useController(controllerProps);

    return (
        <div className={cn('form-group', classNames.container)}>
            {label && (
                <label htmlFor={controllerProps.name} className={cn('form-text', classNames.label)}>
                    {label}
                </label>
            )}

            <textarea
                id={controllerProps.name}
                autoComplete={autoComplete ?? 'on'}
                {...field}
                placeholder={placeholder}
                rows={rows}
                className={cn('form-field', classNames.field)}
                aria-invalid={!!error}
                data-invalid={!!error}
            />

            {error?.message && (
                <p className="text-xs text-red-500" role="alert" aria-live="assertive">
                    {error.message}
                </p>
            )}
        </div>
    );
};

export default Textarea;
