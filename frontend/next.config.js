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
        production: ""
    }
}