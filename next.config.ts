import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
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
        ],
    },
};

export default nextConfig;
