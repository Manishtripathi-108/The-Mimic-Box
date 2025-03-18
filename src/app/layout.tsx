import type { Metadata, Viewport } from 'next';

import { Aladin, Alegreya, Karla } from 'next/font/google';

import { Icon } from '@iconify/react';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

import '@/app/globals.css';
import { ReactScan } from '@/components/ReactScan';
import Header from '@/components/layout/Header';
import '@/constants/iconSetup';
import ICON_SET from '@/constants/icons';
import { ThemeScript } from '@/lib/utils/theme';

const fontKarla = Karla({
    variable: '--font-karla',
    subsets: ['latin'],
});

const fontAladin = Aladin({
    variable: '--font-aladin',
    subsets: ['latin'],
    weight: '400',
});

const fontAlegreya = Alegreya({
    variable: '--font-alegreya',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'The Mimic Box',
    description: 'Welcome to The Mimic Box.',
};

export const viewport: Viewport = {
    themeColor: '#dfdfdf',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* <script crossOrigin="anonymous" src="//unpkg.com/react-scan/dist/auto.global.js" /> */}
                <ThemeScript />
                <meta name="apple-mobile-web-app-title" content="Mimic Box" />
                <ReactScan />
            </head>
            <SessionProvider>
                <body
                    className={`bg-primary scrollbar-thin font-karla transition-colors duration-300 ${fontKarla.variable} ${fontAladin.variable} ${fontAlegreya.variable}`}>
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
            </SessionProvider>
        </html>
    );
}
