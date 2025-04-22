'use client';

import { FieldValues, useController } from 'react-hook-form';

import { FormFieldWithOptionsProps } from '@/lib/types/client.types';
import { getOptionData } from '@/lib/utils/client.utils';
import cn from '@/lib/utils/cn';

const Checkbox = <T extends FieldValues>({ options, label, classNames = {}, ...controllerProps }: FormFieldWithOptionsProps<T>) => {
    const {
        field,
        fieldState: { error },
    } = useController(controllerProps);

    const currentValue: string[] = field.value || [];

    const handleChange = (value: string) => {
        const updatedValue = currentValue?.includes(value) ? currentValue.filter((v) => v !== value) : [...currentValue, value];

        field.onChange(updatedValue);
    };

    return (
        <>
            {label && <p className={cn('form-text', classNames.label)}>{label}</p>}

            <div className={classNames.container}>
                {options.map((option) => {
                    const { label, value } = getOptionData(option);
                    return (
                        <label key={value} htmlFor={value} className="form-checkbox">
                            <input
                                id={value}
                                type="checkbox"
                                value={value}
                                checked={currentValue?.includes(value)}
                                onChange={() => handleChange(value)}
                                className={cn('checkbox-field', classNames.field)}
                            />
                            <span className="form-text">{label}</span>
                        </label>
                    );
                })}
            </div>

            {error?.message && (
                <p className="mt-1 text-xs text-red-500" role="alert" aria-live="assertive">
                    {error.message}
                </p>
            )}
        </>
    );
};

export default Checkbox;
