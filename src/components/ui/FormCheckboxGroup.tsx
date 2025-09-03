'use client';

import { FieldValues, useController } from 'react-hook-form';

import Checkbox from '@/components/ui/form/Checkbox';
import { T_FormFieldWithOptionsProps } from '@/lib/types/form.types';
import { getOptionData } from '@/lib/utils/client.utils';
import cn from '@/lib/utils/cn';

const FormCheckboxGroup = <T extends FieldValues>({ options, label, classNames = {}, ...controllerProps }: T_FormFieldWithOptionsProps<T>) => {
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
            {label && <p className={cn('form-text', classNames.container)}>{label}</p>}

            <div className={classNames.container}>
                {options.map((option) => {
                    const { label, value } = getOptionData(option);
                    return (
                        <Checkbox key={value} checked={currentValue?.includes(value)} onChange={() => handleChange(value)} className={classNames}>
                            {label}
                        </Checkbox>
                    );
                })}
            </div>

            {error?.message && (
                <p className="text-danger mt-1 text-xs" role="alert" aria-live="assertive">
                    {error.message}
                </p>
            )}
        </>
    );
};

export default FormCheckboxGroup;
