import type { Metadata, Viewport } from 'next';
import { Karla, Aladin } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { Icon } from '@iconify/react';
import '@/app/globals.css';
import '@/constants/iconSetup';
import { ICONS } from '@/constants/icons';
import { ThemeProvider, ThemeScript } from '@/context/ThemeProvider';

const fontKarla = Karla({
    variable: '--font-karla',
    subsets: ['latin'],
});

const fontAladin = Aladin({
    variable: '--font-aladin',
    subsets: ['latin'],
    weight: '400',
});

export const metadata: Metadata = {
    title: 'The Mimic Box',
    description: 'Welcome to The Mimic Box.',
};

export const viewport: Viewport = {
    themeColor: '#FFB6B9',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <ThemeScript />
            </head>
            <body className={`bg-primary scrollbar-thin transition-colors font-karla duration-300 ${fontKarla.variable} ${fontAladin.variable}`}>
                <ThemeProvider>{children}</ThemeProvider>

                {/* ✅ Global Toaster with Custom Icons */}
                <Toaster
                    toastOptions={{
                        success: {
                            icon: <Icon icon={ICONS.SUCCESS} className="size-6 text-green-500" />,
                        },
                        error: {
                            icon: <Icon icon={ICONS.ERROR} className="size-7" />,
                        },
                        loading: {
                            icon: <Icon icon={ICONS.LOADING} className="text-accent size-5" />,
                        },
                    }}
                />
            </body>
        </html>
    );
}
