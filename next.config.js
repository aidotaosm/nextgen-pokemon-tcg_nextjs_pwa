const customRuntimeCaching = require("./public/customRuntimeCaching");
const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    //  disable: true,
    register: true,
    skipWaiting: true,
    runtimeCaching: [
        ...customRuntimeCaching,
    ],
    fallbacks: {
        image: '/images/Cardback.webp'
    },
    maximumFileSizeToCacheInBytes: 50000000,
    reloadOnOnline: false,
    publicExcludes: ['!noprecache/**/*', '!sitemap.xml']
})
module.exports = withPWA({
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ['images.pokemontcg.io'],
        minimumCacheTTL: 60 * 60 * 24 * 30 * 12,
    }, api: {
        responseLimit: false,
    },
    staticPageGenerationTimeout: 1000,
    // target: 'serverless'
})

// "CacheFirst"

// ,
// "CacheOnly"

// ,
// "NetworkFirst"

// ,
// "NetworkOnly"

// , or
// "StaleWhileRevalidate"