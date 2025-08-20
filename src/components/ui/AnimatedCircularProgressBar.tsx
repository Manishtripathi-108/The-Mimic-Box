'use client';

import { memo, useCallback, useImperativeHandle, useRef } from 'react';

import cn from '@/lib/utils/cn';

export type AnimatedCircularProgressBarHandle = {
    value: (val: number) => void;
};

type AnimatedCircularProgressBarProps = {
    min?: number;
    max?: number;
    value?: number;
    gaugePrimaryColor?: string;
    gaugeSecondaryColor?: string;
    className?: string;
    ref?: React.Ref<AnimatedCircularProgressBarHandle>;
};

const circumference = 2 * Math.PI * 45;
const percentPx = circumference / 100;

const AnimatedCircularProgressBar = ({
    min = 0,
    max = 100,
    value = 0,
    gaugePrimaryColor = 'var(--color-theme-accent)',
    gaugeSecondaryColor = 'var(--color-theme-tertiary)',
    className,
    ref,
}: AnimatedCircularProgressBarProps) => {
    const iRef = useRef<HTMLDivElement>(null);

    const getPercent = useCallback((val: number) => Math.round(((val - min) / (max - min)) * 100), [min, max]);

    const currentPercent = getPercent(value);
    useImperativeHandle(
        ref,
        (): AnimatedCircularProgressBarHandle => ({
            value: (val: number) => {
                const el = iRef.current;
                if (!el) return;

                const percent = getPercent(val);
                console.log('🪵 > AnimatedCircularProgressBar.tsx:46 > AnimatedCircularProgressBar > percent:', percent);

                // Update CSS variable & dataset
                el.style.setProperty('--percent', String(percent));
                el.dataset.percent = String(percent);

                const spanChild = el.querySelector<HTMLSpanElement>('span');
                const svgFirstCircle = el.querySelector<SVGCircleElement>('svg circle:first-child');

                // Update span text
                if (spanChild) spanChild.textContent = `${percent}%`;

                // Toggle visibility
                if (svgFirstCircle) {
                    svgFirstCircle.classList.toggle('hidden', val > 90);
                }
            },
        }),
        [getPercent]
    );

    return (
        <div
            ref={iRef}
            className={cn('relative size-40 text-2xl font-semibold', className)}
            style={
                {
                    '--circle-size': '100px',
                    '--circumference': circumference,
                    '--percent-to-px': `${percentPx}px`,
                    '--gap-percent': '5',
                    '--offset-factor': '0',
                    '--transition-length': '1s',
                    '--transition-step': '200ms',
                    '--delay': '0s',
                    '--percent-to-deg': '3.6deg',
                    '--percent': currentPercent,
                    transform: 'translateZ(0)',
                } as React.CSSProperties
            }
            data-percent={currentPercent}>
            <svg fill="none" className="size-full" strokeWidth="2" viewBox="0 0 100 100">
                {/* Secondary circle */}
                {currentPercent <= 90 && currentPercent >= 0 && (
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        strokeWidth="10"
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-100"
                        style={
                            {
                                stroke: gaugeSecondaryColor,
                                '--stroke-percent': 'calc(90 - var(--percent))',
                                '--offset-factor-secondary': 'calc(1 - var(--offset-factor))',
                                strokeDasharray: 'calc(var(--stroke-percent) * var(--percent-to-px)) var(--circumference)',
                                transform:
                                    'rotate(calc(1turn - 90deg - (var(--gap-percent) * var(--percent-to-deg) * var(--offset-factor-secondary)))) scaleY(-1)',
                                transition: 'all var(--transition-length) ease var(--delay)',
                                transformOrigin: 'calc(var(--circle-size) / 2) calc(var(--circle-size) / 2)',
                            } as React.CSSProperties
                        }
                    />
                )}

                {/* Primary circle */}
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    strokeWidth="10"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-100"
                    style={
                        {
                            stroke: gaugePrimaryColor,
                            '--stroke-percent': 'var(--percent)',
                            strokeDasharray: 'calc(var(--stroke-percent) * var(--percent-to-px)) var(--circumference)',
                            transition: 'var(--transition-length) ease var(--delay), stroke var(--transition-length) ease var(--delay)',
                            transitionProperty: 'stroke-dasharray, transform',
                            transform: 'rotate(calc(-90deg + var(--gap-percent) * var(--offset-factor) * var(--percent-to-deg)))',
                            transformOrigin: 'calc(var(--circle-size) / 2) calc(var(--circle-size) / 2)',
                        } as React.CSSProperties
                    }
                />
            </svg>

            {/* Text label */}
            <span className="animate-in fade-in text-text-primary absolute inset-0 m-auto size-fit delay-[var(--delay)] duration-[var(--transition-length)] ease-linear">
                {currentPercent}%
            </span>
        </div>
    );
};

export default memo(AnimatedCircularProgressBar);
