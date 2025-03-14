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
            // cloudinary Image API
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
        ],
    },
};

export default nextConfig;
