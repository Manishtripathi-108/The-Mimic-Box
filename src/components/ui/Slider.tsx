import { memo } from 'react';

import { DATA_INVALID, DISABLED } from '@/lib/styles/tailwind.helpers';
import cn from '@/lib/utils/cn';

type SliderSize = 'xs' | 'sm' | 'md' | 'lg';
type SliderVariant = 'primary' | 'secondary' | 'accent' | 'danger' | 'warning' | 'success' | 'highlight';

const SLIDER_SIZE_SCALE: Record<SliderSize, number> = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
};

const SLIDER_VARIANT_COLORS: Record<
    SliderVariant,
    {
        fill: string;
        fillAlt: string;
        track: string;
        trackAlt: string;
        thumb: string;
        thumbAlt: string;
        thumbDark: string;
    }
> = {
    primary: {
        fill: 'var(--color-theme-primary)',
        fillAlt: 'var(--color-theme-secondary)',
        track: 'var(--color-theme-secondary)',
        trackAlt: 'var(--color-theme-tertiary)',
        thumb: 'var(--color-theme-primary)',
        thumbAlt: 'var(--color-theme-secondary)',
        thumbDark: 'var(--color-theme-text-primary)',
    },
    secondary: {
        fill: 'var(--color-theme-secondary)',
        fillAlt: 'var(--color-theme-primary)',
        track: 'var(--color-theme-primary)',
        trackAlt: 'var(--color-theme-tertiary)',
        thumb: 'var(--color-theme-secondary)',
        thumbAlt: 'var(--color-theme-primary)',
        thumbDark: 'var(--color-theme-text-secondary)',
    },
    accent: {
        fill: 'var(--color-theme-accent)',
        fillAlt: '#af1e32',
        track: 'var(--color-theme-primary)',
        trackAlt: 'var(--color-theme-tertiary)',
        thumb: 'var(--color-theme-accent)',
        thumbAlt: '#eb2300',
        thumbDark: '#af1e32',
    },
    danger: {
        fill: '#ef4444',
        fillAlt: '#dc2626',
        track: 'var(--color-theme-primary)',
        trackAlt: 'var(--color-theme-tertiary)',
        thumb: '#ef4444',
        thumbAlt: '#dc2626',
        thumbDark: '#b91c1c',
    },
    warning: {
        fill: '#f59e0b',
        fillAlt: '#d97706',
        track: 'var(--color-theme-primary)',
        trackAlt: 'var(--color-theme-tertiary)',
        thumb: '#f59e0b',
        thumbAlt: '#d97706',
        thumbDark: '#b45309',
    },
    success: {
        fill: '#10b981',
        fillAlt: '#059669',
        track: 'var(--color-theme-primary)',
        trackAlt: 'var(--color-theme-tertiary)',
        thumb: '#10b981',
        thumbAlt: '#059669',
        thumbDark: '#047857',
    },
    highlight: {
        fill: 'var(--color-theme-highlight)',
        fillAlt: '#004649',
        track: 'var(--color-theme-primary)',
        trackAlt: 'var(--color-theme-tertiary)',
        thumb: 'var(--color-theme-highlight)',
        thumbAlt: '#004649',
        thumbDark: '#002f31',
    },
};

export type SliderProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> & {
    min?: number;
    max?: number;
    step?: number;
    value?: number;
    defaultValue?: number;
    sliderSize?: SliderSize;
    height?: number;
    margin?: number;
    thumbSize?: number;
    variant?: SliderVariant;
};

const Slider: React.FC<SliderProps> = ({
    min = 0,
    max = 100,
    step = 1,
    value,
    defaultValue = min,
    sliderSize = 'md',
    height,
    margin,
    thumbSize,
    variant = 'accent',
    className,
    ...rest
}) => {
    const colors = SLIDER_VARIANT_COLORS[variant];

    const sliderHeight = `${(height ?? SLIDER_SIZE_SCALE[sliderSize]) * 0.2}rem`;
    const sliderMargin = `${(margin ?? SLIDER_SIZE_SCALE[sliderSize]) * 0.125}rem`;
    const sliderThumbSize = `${(thumbSize ?? SLIDER_SIZE_SCALE[sliderSize]) * 0.5}rem`;

    const onInput = (e: React.FormEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement;
        const percent = ((+input.value - min) / (max - min)) * 100;
        input.style.setProperty('--slider-progress', `${percent}%`);
    };

    return (
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            defaultValue={value === undefined ? defaultValue : undefined}
            onInput={onInput}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value ?? defaultValue}
            style={
                {
                    '--slider-height': sliderHeight,
                    '--slider-margins': sliderMargin,
                    '--slider-thumb-size': sliderThumbSize,
                    '--slider-track': colors.track,
                    '--slider-track-alt': colors.trackAlt,
                    '--slider-fill': colors.fill,
                    '--slider-fill-alt': colors.fillAlt,
                    '--slider-thumb': colors.thumb,
                    '--slider-thumb-alt': colors.thumbAlt,
                    '--slider-thumb-dark': colors.thumbDark,
                    '--slider-progress': `${(((value ?? defaultValue) - min) / (max - min)) * 100}%`,
                } as React.CSSProperties
            }
            className={cn(
                'shadow-pressed-xs flex h-fit cursor-pointer appearance-none items-center justify-center rounded-full p-0',

                // Track
                '[&::-webkit-slider-runnable-track]:-m-(--slider-margins)',

                // Track
                '[&::-webkit-slider-container]:border-secondary [&::-webkit-slider-container]:m-(--slider-margins) [&::-webkit-slider-container]:h-(--slider-height) [&::-webkit-slider-container]:rounded-full [&::-webkit-slider-container]:border [&::-webkit-slider-container]:[background:linear-gradient(var(--slider-fill),_var(--slider-fill-alt))_0/_var(--slider-progress)_no-repeat,linear-gradient(var(--slider-track),_var(--slider-track-alt))]',

                // Thumb
                '[&::-webkit-slider-thumb]:size-(--slider-thumb-size) [&::-webkit-slider-thumb]:cursor-ew-resize [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-5 [&::-webkit-slider-thumb]:border-transparent [&::-webkit-slider-thumb]:shadow-xs [&::-webkit-slider-thumb]:shadow-black [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:[background:linear-gradient(var(--slider-thumb-alt),var(--slider-thumb))_padding-box,linear-gradient(var(--slider-thumb),var(--slider-thumb-dark))_border-box]',

                // Hover & focus states
                'hover:[&::-webkit-slider-thumb]:scale-120 focus:[&::-webkit-slider-thumb]:scale-120 focus-visible:[&::-webkit-slider-thumb]:outline',
                DISABLED,
                DATA_INVALID,
                className
            )}
            {...rest}
        />
    );
};

export default memo(Slider);
