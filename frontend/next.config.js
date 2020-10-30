require('dotenv').config()
module.exports = {
    exportPathMap: async function (
        defaultPathMap,
        { dev, dir, outDir, distDir, buildId }
    ) {
        return {
            '/': { page: '/' },
            '/login': { page: '/login' },
            '/profile': { page: '/profile' },
            '/reserve': { page: '/reserve' },
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