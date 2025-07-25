import type { NextConfig } from 'next';

import withSerwistInit from '@serwist/next';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

import { isDev } from '@/lib/utils/core.utils';

function fileHash(filePath: string) {
    const buffer = fs.readFileSync(path.join(process.cwd(), 'public', filePath));
    return crypto.createHash('md5').update(buffer).digest('hex');
}

const withSerwist = withSerwistInit({
    swSrc: 'src/app/sw.ts',
    swDest: 'public/sw.js',
    disable: isDev,
    additionalPrecacheEntries: [
        {
            url: '/download/ffmpeg-core.js',
            revision: fileHash('download/ffmpeg-core.js'),
        },
        {
            url: '/download/ffmpeg-core.wasm',
            revision: fileHash('download/ffmpeg-core.wasm'),
        },
        {
            url: '/download/ffmpeg-core.worker.js',
            revision: fileHash('download/ffmpeg-core.worker.js'),
        },
    ],
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
    webpack(config) {
        config.experiments = {
            ...config.experiments,
            asyncWebAssembly: true,
        };
        config.module.rules.push({
            test: /\.wasm$/,
            type: 'javascript/auto',
        });
        return config;
    },
};

// Export with Serwist PWA support
export default withSerwist(nextConfig);
