'use client';

import { useEffect, useState } from 'react';

const useTheme = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    // Load theme from localStorage on mount
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        const initialTheme = storedTheme || 'light';

        setTheme(initialTheme);
        applyTheme(initialTheme);
    }, []);

    // Save theme to localStorage and apply it
    useEffect(() => {
        if (!theme || typeof window === 'undefined') return;
        localStorage.setItem('theme', theme);
        applyTheme(theme);
    }, [theme]);

    const applyTheme = (newTheme: 'light' | 'dark') => {
        document.documentElement.setAttribute('data-theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');

        const color = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
    };

    return { theme, setTheme };
};

export default useTheme;
