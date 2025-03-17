'use client';

import { useCallback, useEffect, useState } from 'react';

type ThemeType = 'light' | 'dark' | 'system';

const THEME_KEY = 'theme';

const useTheme = () => {
    const [theme, setTheme] = useState<ThemeType>(() => {
        if (typeof window === 'undefined') return 'system';
        return (localStorage.getItem(THEME_KEY) as ThemeType) || 'system';
    });

    // Compute next theme dynamically
    const nextTheme: ThemeType = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';

    // Apply theme to DOM
    const applyTheme = useCallback((newTheme: ThemeType) => {
        const root = document.documentElement;
        if (newTheme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            newTheme = prefersDark ? 'dark' : 'light';
        }

        root.setAttribute('data-theme', newTheme);
        root.classList.toggle('dark', newTheme === 'dark');

        // Update theme-color meta tag
        const primaryColor = getComputedStyle(root).getPropertyValue('--color-primary');
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', primaryColor);
    }, []);

    // Load theme on mount and listen for system changes if needed
    useEffect(() => {
        if (typeof window === 'undefined') return;

        applyTheme(theme);
        if (theme === 'system') {
            const systemThemeListener = window.matchMedia('(prefers-color-scheme: dark)');
            const handleSystemChange = () => applyTheme('system');

            systemThemeListener.addEventListener('change', handleSystemChange);
            return () => systemThemeListener.removeEventListener('change', handleSystemChange);
        }
    }, [theme, applyTheme]);

    // Cycle through themes
    const cycleTheme = useCallback(() => {
        setTheme((current) => {
            const newTheme = current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
            localStorage.setItem(THEME_KEY, newTheme);
            return newTheme;
        });
    }, []);

    return { theme, cycleTheme, nextTheme, setTheme };
};

export default useTheme;
