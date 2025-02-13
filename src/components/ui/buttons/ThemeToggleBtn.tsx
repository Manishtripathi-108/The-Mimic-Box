'use client';
import React from 'react';

import { Icon } from '@iconify/react';

import ICON_SET from '@/constants/icons';
import useTheme from '@/hooks/useTheme';

const ThemeToggleBtn = () => {
    const { theme, setTheme } = useTheme();

    const buttonClass =
        'text-text-secondary cursor-pointer hover:text-text-primary data-[state=active]:text-text-primary inline-flex h-[var(--sz)] max-h-[var(--sz)] min-h-[var(--sz)] w-[var(--sz)] min-w-[var(--sz)] max-w-[var(--sz)] items-center justify-center  rounded-full  p-0.5 ring-offset-secondary transition-all [--sz:36px] hover:bg-transparent focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-secondary focus-visible:ring-offset-1 active:shadow-neumorphic-inset-xs disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border data-[state=active]:shadow-neumorphic-xs data-[state=""]:hover:scale-105 data-[state=""]:active:scale-95  dark:ring-offset-secondary dark:focus-visible:ring-secondary';
    return (
        <div className="flex w-max items-center rounded-full border p-1">
            <button
                className={`${buttonClass}`}
                title="Dark Mode"
                onClick={() => setTheme('dark')}
                aria-label="dark"
                data-state={theme === 'dark' ? 'active' : ''}
                role="button"
                type="button">
                <Icon icon={ICON_SET.MOON} className="size-6" />
            </button>
            <button
                className={`${buttonClass}`}
                title="System Mode"
                onClick={() => setTheme('system')}
                aria-label="system"
                data-state={theme === 'system' ? 'active' : ''}
                role="button"
                type="button">
                <Icon icon={ICON_SET.DESKTOP} className="size-4" />
            </button>
            <button
                className={`${buttonClass}`}
                title="Light Mode"
                onClick={() => setTheme('light')}
                aria-label="light"
                data-state={theme === 'light' ? 'active' : ''}
                role="button"
                type="button">
                <Icon icon={ICON_SET.SUN} className="size-6" />
            </button>
        </div>
    );
};

export default ThemeToggleBtn;
