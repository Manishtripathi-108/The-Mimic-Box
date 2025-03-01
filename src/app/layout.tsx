import '@/app/globals.css';
import Header from '@/components/layout/Header';
import '@/constants/iconSetup';
import ICON_SET from '@/constants/icons';
import { ThemeScript } from '@/lib/utils/theme';
import { Icon } from '@iconify/react';
import type { Metadata, Viewport } from 'next';
import { Aladin, Karla } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

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
            <body className={`bg-primary scrollbar-thin font-karla transition-colors duration-300 ${fontKarla.variable} ${fontAladin.variable}`}>
                <Header />
                {children}

                {/* ✅ Global Toaster with Custom Icons */}
                <Toaster
                    toastOptions={{
                        success: {
                            icon: <Icon icon={ICON_SET.SUCCESS} className="size-6 shrink-0 text-green-500" />,
                        },
                        error: {
                            icon: <Icon icon={ICON_SET.ERROR} className="size-7 shrink-0" />,
                        },
                        loading: {
                            icon: <Icon icon={ICON_SET.LOADING} className="text-accent size-5 shrink-0" />,
                        },
                    }}
                />
            </body>
        </html>
    );
}
