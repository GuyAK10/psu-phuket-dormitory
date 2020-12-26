require('dotenv').config()
module.exports = {
    exportPathMap: async function (
        defaultPathMap,
        { dev, dir, outDir, distDir, buildId }
    ) {
        return {
            '/': { page: '/' },
            '/login': { page: '/login' },
            '/payment': { page: '/payment' },
            '/payment-history': { page: '/payment/history' },
            '/profile': { page: '/profile' },
            '/profile-result': { page: '/profile-result' },
            '/guide': { page: '/guide' },
            '/support': { page: '/support' },
            '/reserve': { page: '/reserve' },
            '/reserve-result': { page: '/reserve-result' },
            '/admin/profiles': { page: '/admin/profiles' },
            '/admin/reserve': { page: '/admin/reserve' },
        }
    },
    env: {
        dev: "http://localhost",
        production: "",
        ENDPOINT: process.env.END_POINT,
        PORT: process.env.PORT,
    }
}