import type { Metadata, Viewport } from 'next';

import { Aladin, Alegreya, Karla } from 'next/font/google';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

import '@/app/globals.css';
import Header from '@/components/layout/Header';
import Icon from '@/components/ui/Icon';
import ProgressBarProvider from '@/contexts/ProgressProvider';
import { ThemeScript } from '@/hooks/useTheme';
import '@/lib/iconSetup';

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;

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
        default: APP_NAME!,
        template: `%s | ${APP_NAME}`,
    },
    description: `Discover ${APP_NAME}, the ultimate Next.js-powered gaming and media platform. Play fun online games like Tic Tac Toe, manage your media with Spotify, JioSaavn, and Anilist integrations, and enjoy seamless media playback, file uploads, and a modern, responsive design. Join ${APP_NAME}'s community for social gaming, media syncing, and entertainment!`,
    keywords: [
        `${APP_NAME}`,
        `${APP_NAME} platform`,
        `${APP_NAME} online games`,
        `${APP_NAME} Next.js app`,
        `${APP_NAME} media player`,
        `${APP_NAME} Spotify integration`,
        `${APP_NAME} JioSaavn integration`,
        `${APP_NAME} Anilist integration`,
        `${APP_NAME} multiplayer games`,
        `${APP_NAME} social gaming`,
        `${APP_NAME} file uploads`,
        `${APP_NAME} TypeScript app`,
        `${APP_NAME} Tailwind CSS`,
        `${APP_NAME} media synchronization`,
        `${APP_NAME} React Context API`,
        `${APP_NAME} Prisma PostgreSQL`,
        `${APP_NAME} game night`,
        `${APP_NAME} entertainment hub`,
        `${APP_NAME} responsive design`,
        `${APP_NAME} fun casual games`,
        `${APP_NAME} audio player`,
        `${APP_NAME} gaming experience`,
        `${APP_NAME} play with friends`,
        `${APP_NAME} tech stack project`,
        `${APP_NAME} open source media platform`,
    ],
};

export const viewport: Viewport = {
    themeColor: '#dfdfdf',
    colorScheme: 'light dark',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className="scroll-smooth">
            <head>
                {/* <script crossOrigin="anonymous" src="//unpkg.com/react-scan/dist/auto.global.js" async /> */}
                <meta name="google-site-verification" content="D12BQGTOqvlZdSNhlyOAbpAjZNHzdS7LPaJCn8ucgpg" />
                <meta name="apple-mobile-web-app-title" content="Mimic Box" />
                <ThemeScript />
            </head>
            <SessionProvider>
                <body
                    className={`bg-primary scrollbar-thin font-karla transition-colors duration-300 ${fontKarla.variable} ${fontAladin.variable} ${fontAlegreya.variable}`}>
                    <ProgressBarProvider>
                        <Header />
                        {children}
                        <Toaster
                            toastOptions={{
                                success: {
                                    icon: <Icon icon="success" className="text-success size-6 shrink-0" />,
                                },
                                error: {
                                    icon: <Icon icon="error" className="text-danger size-7 shrink-0" />,
                                },
                                loading: {
                                    icon: <Icon icon="loading" className="text-highlight size-5 shrink-0" />,
                                },
                            }}
                        />
                    </ProgressBarProvider>
                </body>
            </SessionProvider>
        </html>
    );
};

export default RootLayout;
