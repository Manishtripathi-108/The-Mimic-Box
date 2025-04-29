/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_URL,
    generateRobotsTxt: true, // generates a robots.txt file automatically
    sitemapSize: 7000, // optional, default is 5000
    changefreq: 'weekly', // tells Google how often your content changes
    priority: 0.7, // page priority (0.0 to 1.0)
    generateIndexSitemap: false, // disables sitemap index if you want a single file
    sitemapFilename: 'mimic-sitemap.xml', // your custom sitemap filename
    // exclude: ['/private-page'], // if you have pages you want to exclude
};
