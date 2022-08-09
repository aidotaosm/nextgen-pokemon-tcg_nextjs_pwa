const withPWA = require('next-pwa')
const customRuntimeCaching = require("./public/customRuntimeCaching");

module.exports = withPWA({
    reactStrictMode: true,
    swcMinify: true,
    pwa: {
        dest: 'public',
        disable: false,
        register: true,
        skipWaiting: true,
        runtimeCaching: [
            ...customRuntimeCaching,
        ],
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