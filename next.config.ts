import type { NextConfig } from 'next';





const nextConfig: NextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '100mb',
        },
    },
    images: {
        remotePatterns: [
            // picsum Image API
            {
                protocol: 'https',
                hostname: 'picsum.photos',
            },
            // google Image API
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            // spotify Image API
            {
                protocol: 'https',
                hostname: 'i.scdn.co',
            },
            {
                protocol: 'https',
                hostname: 'mosaic.scdn.co',
            },
            {
                protocol: 'https',
                hostname: 'image-cdn-ak.spotifycdn.com',
            },
            {
                protocol: 'https',
                hostname: 'image-cdn-fa.spotifycdn.com',
            },
            // anilist Image API
            {
                protocol: 'https',
                hostname: 's4.anilist.co',
            },
            // cloudinary Image API
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
        ],
    },
};

export default nextConfig;