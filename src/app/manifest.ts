import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'The Mimic Box',
        short_name: 'Mimic Box',
        start_url: '/',
        theme_color: '#e1102c',
        background_color: '#dfdfdf',
        display: 'standalone',
        icons: [
            {
                src: '/web-app-manifest-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/web-app-manifest-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
        ],
        screenshots: [
            {
                src: '/screenshots/desktop.png',
                sizes: '1280x800',
                type: 'image/png',
                form_factor: 'wide',
            },
            {
                src: '/screenshots/mobile.png',
                sizes: '375x812',
                type: 'image/png',
                form_factor: 'narrow',
            },
        ],
    };
}
