const withPWA = require('next-pwa')
const customRuntimeCaching = require("./public/customRuntimeCaching");

module.exports = withPWA({
    reactStrictMode: true,
    swcMinify: true,
    pwa: {
        dest: 'public',
        disable: false,
        register: true,
        skipWaiting: false,
        runtimeCaching: [
            ...customRuntimeCaching,
        ],
        fallbacks: {
            image: '/images/Cardback.webp'
        }
    },
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