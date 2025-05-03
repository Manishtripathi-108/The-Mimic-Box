import type { Metadata, Viewport } from 'next';

import { Aladin, Alegreya, Karla } from 'next/font/google';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

import '@/app/globals.css';
import { ReactScan } from '@/components/ReactScan';
import Header from '@/components/layout/Header';
import Icon from '@/components/ui/Icon';
import '@/lib/iconSetup';
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
    title: {
        default: 'The Mimic Box',
        template: '%s | The Mimic Box',
    },
    description: 'Welcome to The Mimic Box.',
    keywords: [
        'Mimic Box',
        'The Mimic Box',
        'Mimic Box Games',
        'Mimic Box Tic Tac Toe',
        'Mimic Box Online Games',
        'Mimic Box Classic Games',
        'Mimic Box Multiplayer Games',
        'Mimic Box Fun Games',
        'Mimic Box Entertainment',
        'Mimic Box Community',
        'Mimic Box Gaming',
        'Mimic Box Fun',
        'Mimic Box Online',
    ],
};

export const viewport: Viewport = {
    themeColor: '#dfdfdf',
    colorScheme: 'light dark',
};

const page = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en" suppressHydrationWarning className="scroll-smooth">
            <head>
                {/* <script crossOrigin="anonymous" src="//unpkg.com/react-scan/dist/auto.global.js" /> */}
                <meta name="apple-mobile-web-app-title" content="Mimic Box" />
                <ThemeScript />
                <ReactScan />
            </head>
            <SessionProvider>
                <body
                    className={`bg-primary scrollbar-thin font-karla transition-colors duration-300 ${fontKarla.variable} ${fontAladin.variable} ${fontAlegreya.variable}`}>
                    <Header />
                    {children}
                    <Toaster
                        toastOptions={{
                            success: {
                                icon: <Icon icon="success" className="size-6 shrink-0 text-green-500" />,
                            },
                            error: {
                                icon: <Icon icon="error" className="size-7 shrink-0 text-red-500" />,
                            },
                            loading: {
                                icon: <Icon icon="loading" className="text-highlight size-5 shrink-0" />,
                            },
                        }}
                    />
                </body>
            </SessionProvider>
        </html>
    );
};

export default page;
