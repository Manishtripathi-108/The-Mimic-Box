/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_URL,
    generateRobotsTxt: true,
    sitemapSize: 7000, // optional, default is 5000
    changefreq: 'weekly', // tells Google how often your content changes
    priority: 0.7, // page priority (0.0 to 1.0)
    sitemapBaseFileName: 'mimic-sitemap', // your custom sitemap filename
    exclude: [
        '/apple-icon.png',
        '/icon.png',
        '/icon.svg',
        '/opengraph-image.png',
        '/twitter-image.png',
        '/manifest.webmanifest',
        '/redirect',
        '/auth/error',
        '/auth/forgot-password',
        '/auth/reset-password',
        '/auth/verify-email',
        '/auth/change-email',
        '/auth/link-account-error',
        '/dev',
    ],
};
