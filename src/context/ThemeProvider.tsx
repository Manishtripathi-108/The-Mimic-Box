'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Define theme types
type ThemeType = 'light' | 'dark' | 'system';

// Context definition
const ThemeContext = createContext<{
    theme: ThemeType | null;
    setTheme: (theme: ThemeType) => void;
}>({
    theme: null, // ✅ Prevent SSR mismatch by starting with `null`
    setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<ThemeType | null>(null); // Start with `null` to match SSR

    // Load theme from localStorage on mount
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const storedTheme = localStorage.getItem('theme') as ThemeType | null;
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

    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

export const ThemeScript = () => {
    return (
        <script
            dangerouslySetInnerHTML={{
                __html: `
                    (function () {
                        try {
                            const theme = localStorage.getItem('theme') || 'system';
                            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                            const appliedTheme = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;
                            
                            document.documentElement.setAttribute('data-theme', appliedTheme);
                            document.documentElement.classList.toggle('dark', appliedTheme === 'dark');
                        } catch (e) {
                            console.error("Error applying theme:", e);
                        }
                    })();
                `,
            }}
        />
    );
};
