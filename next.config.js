const customRuntimeCaching = require("./public/customRuntimeCaching");
const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    //  disable: true,
    register: true,
    skipWaiting: false,
    runtimeCaching: [
        ...customRuntimeCaching,
    ],
    fallbacks: {
        image: '/images/Cardback.webp'
    }
})
module.exports = withPWA({
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ['images.pokemontcg.io'],
        minimumCacheTTL: 60 * 60 * 24 * 30 * 12,
    },
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