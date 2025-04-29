/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_URL,
    generateRobotsTxt: true, // generates a robots.txt file automatically
    sitemapSize: 7000, // optional, default is 5000
    changefreq: 'weekly', // tells Google how often your content changes
    priority: 0.7, // page priority (0.0 to 1.0)
    // exclude: ['/private-page'], // if you have pages you want to exclude
};
