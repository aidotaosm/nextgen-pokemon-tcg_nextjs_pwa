const withPWA = require('next-pwa')

module.exports = withPWA({
    reactStrictMode: true,
    swcMinify: true,
    pwa: {
        dest: 'public',
        disable: false,
        register: true,
        skipWaiting: true,
    },
    // target: 'serverless'
})