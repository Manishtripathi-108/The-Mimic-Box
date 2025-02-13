'use client';

import { useEffect, useState } from 'react';

const useTheme = () => {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

    // Load theme from localStorage on mount
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
        const initialTheme = storedTheme || 'system';

        setTheme(initialTheme);
        if (initialTheme === 'system') {
            applySystemTheme();
        } else {
            applyTheme(initialTheme);
        }
    }, []);

    // Save theme to localStorage and apply it
    useEffect(() => {
        if (!theme || typeof window === 'undefined') return;

        localStorage.setItem('theme', theme);
        if (theme === 'system') {
            applySystemTheme();
        } else {
            applyTheme(theme);
        }
    }, [theme]);

    // Listen for system theme changes
    useEffect(() => {
        if (theme === 'system' && typeof window !== 'undefined') {
            const systemThemeListener = window.matchMedia('(prefers-color-scheme: dark)');
            systemThemeListener.addEventListener('change', applySystemTheme);
            return () => systemThemeListener.removeEventListener('change', applySystemTheme);
        }
    }, [theme]);

    const applyTheme = (newTheme: 'light' | 'dark') => {
        document.documentElement.setAttribute('data-theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');

        const color = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
    };

    const applySystemTheme = () => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    };

    return { theme, setTheme };
};

export default useTheme;
