'use client';

import { FieldValues, useController } from 'react-hook-form';

import Icon from '@/components/ui/Icon';
import Slider, { SliderProps } from '@/components/ui/Slider';
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
    sliderProps,
    ...controllerProps
}: RangeSliderProps<TFieldValues> & { sliderProps?: SliderProps }) => {
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

                <Slider
                    id={controllerProps.name}
                    min={min}
                    max={max}
                    step={step}
                    {...field}
                    placeholder={placeholder}
                    className={classNames.field}
                    aria-invalid={!!error}
                    data-invalid={!!error}
                    {...sliderProps}
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
