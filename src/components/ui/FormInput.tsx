'use client';

import { FieldValues, useController } from 'react-hook-form';

import Icon from '@/components/ui/Icon';
import { T_FormInputProps } from '@/lib/types/form.types';
import cn from '@/lib/utils/cn';

const FormInput = <TFieldValues extends FieldValues>({
    label,
    placeholder = '',
    type = 'text',
    iconName,
    max,
    min,
    iconPosition = 'left',
    onIconClick,
    classNames = {},
    autoComplete,
    ...controllerProps
}: T_FormInputProps<TFieldValues>) => {
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

            <div className={cn({ 'form-field-wrapper': iconName })}>
                {iconName && iconPosition === 'left' && (
                    <Icon
                        tabIndex={onIconClick ? 0 : -1}
                        onClick={onIconClick}
                        icon={iconName}
                        className={cn('form-icon', onIconClick && 'cursor-pointer', classNames.icon)}
                    />
                )}

                <input
                    id={controllerProps.name}
                    autoComplete={autoComplete ?? 'on'}
                    type={type}
                    inputMode={type === 'number' ? 'numeric' : 'text'}
                    {...field}
                    max={max}
                    min={min}
                    placeholder={placeholder}
                    className={cn('form-field', classNames.field)}
                    aria-invalid={!!error}
                    data-invalid={!!error}
                />

                {iconName && iconPosition === 'right' && (
                    <Icon
                        tabIndex={onIconClick ? 0 : -1}
                        onClick={onIconClick}
                        icon={iconName}
                        className={cn('form-icon', onIconClick && 'cursor-pointer', classNames.icon)}
                    />
                )}
            </div>

            {error?.message && (
                <p className="text-danger text-xs" role="alert" aria-live="assertive">
                    {error.message}
                </p>
            )}
        </div>
    );
};

export default FormInput;
