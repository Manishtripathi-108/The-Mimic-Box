'use client';

import { FieldValues, useController } from 'react-hook-form';

import { FormFieldWithOptionsProps } from '@/lib/types/client.types';
import { getOptionData } from '@/lib/utils/client.utils';
import cn from '@/lib/utils/cn';

const RadioGroup = <T extends FieldValues>({ label, options, classNames = {}, ...controllerProps }: FormFieldWithOptionsProps<T>) => {
    const {
        field,
        fieldState: { error },
    } = useController(controllerProps);

    return (
        <>
            {label && <p className={cn('form-text', classNames.label)}>{label}</p>}

            <div className={classNames.container}>
                {options.map((option) => {
                    const { value, label } = getOptionData(option);
                    return (
                        <label key={value} htmlFor={value} className="form-radio">
                            <input
                                type="radio"
                                value={value}
                                id={value}
                                checked={field.value === value}
                                onChange={field.onChange}
                                className={cn('radio-field', classNames.field)}
                            />
                            <div className="radio-indicator"></div>
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

export default RadioGroup;
