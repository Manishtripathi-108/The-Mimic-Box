'use client';

import { FieldValues, useController } from 'react-hook-form';

import { SelectProps } from '@/lib/types/client.types';
import { getOptionData } from '@/lib/utils/client.utils';
import cn from '@/lib/utils/cn';

const Select = <T extends FieldValues>({
    label,
    placeholder = 'Select an option',
    autoComplete,
    options,
    classNames = {},
    ...controllerProps
}: SelectProps<T>) => {
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

            <select
                id={controllerProps.name}
                autoComplete={autoComplete ?? 'on'}
                {...field}
                className={cn('form-field', classNames.field)}
                data-invalid={!!error}
                aria-invalid={!!error}>
                {placeholder && (
                    <option value="" disabled hidden>
                        {placeholder}
                    </option>
                )}

                {options.map((option) => {
                    const { label, value } = getOptionData(option);
                    return (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    );
                })}
            </select>

            {error?.message && (
                <p className="text-xs text-red-500" role="alert" aria-live="assertive">
                    {error.message}
                </p>
            )}
        </div>
    );
};

export default Select;
