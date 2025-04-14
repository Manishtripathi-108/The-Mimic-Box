'use client';

import { FieldValues, useController } from 'react-hook-form';

import Icon from '@/components/ui/Icon';
import { RangeSliderProps } from '@/lib/types/client.types';
import cn from '@/lib/utils/cn';

const RangeSlider = <TFieldValues extends FieldValues>({
    label,
    placeholder = '',
    iconName,
    iconPosition = 'left',
    min = 0,
    max = 100,
    step = 1,
    onIconClick,
    classNames = {},
    ...controllerProps
}: RangeSliderProps<TFieldValues>) => {
    const {
        field,
        fieldState: { error },
    } = useController(controllerProps);

    const value = !isNaN(field.value) ? field.value : min;
    const percentage = ((value - min) / (max - min)) * 100;

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
                    autoComplete={controllerProps.name}
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    {...field}
                    style={{ '--value-percentage': `${percentage}%` } as React.CSSProperties}
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
                <p className="text-xs text-red-500" role="alert" aria-live="assertive">
                    {error.message}
                </p>
            )}
        </div>
    );
};

export default RangeSlider;
