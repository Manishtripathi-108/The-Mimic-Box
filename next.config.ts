import type { NextConfig } from 'next';

import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
    swSrc: 'src/app/sw.ts',
    swDest: 'public/sw.js',
    disable: process.env.NODE_ENV === 'development',

    additionalPrecacheEntries: ['/download/ffmpeg-core.js', '/download/ffmpeg-core.wasm', '/download/ffmpeg-core.worker.js'],
});

const nextConfig: NextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '100mb',
        },
    },
    images: {
        remotePatterns: [
            // picsum Image API
            { protocol: 'https', hostname: 'picsum.photos' },

            // google Image API
            { protocol: 'https', hostname: 'lh3.googleusercontent.com' },

            // spotify Image API
            { protocol: 'https', hostname: 'i.scdn.co' },
            { protocol: 'https', hostname: 'mosaic.scdn.co' },
            { protocol: 'https', hostname: 'image-cdn-ak.spotifycdn.com' },
            { protocol: 'https', hostname: 'image-cdn-fa.spotifycdn.com' },

            // jio saavn Image API
            { protocol: 'https', hostname: 'c.saavncdn.com' },
            { protocol: 'https', hostname: 'c.sop.saavncdn.com' },
            { protocol: 'https', hostname: 'www.jiosaavn.com' },

            // anilist Image API
            { protocol: 'https', hostname: 's4.anilist.co' },

            // cloudinary Image API
            { protocol: 'https', hostname: 'res.cloudinary.com' },
        ],
    },
};

// Export with Serwist PWA support
export default withSerwist({
    ...nextConfig,
});
