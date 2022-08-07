const { isDisabled } = require('@testing-library/user-event/dist/utils')
const withPWA = require('next-pwa')

module.exports = withPWA({
    pwa: {
        dest: 'public',
        disable: true
    }
})