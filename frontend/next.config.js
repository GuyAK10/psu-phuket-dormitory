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
            '/admin/profile': { page: '/admin/profile' },
            '/admin/reserve': { page: '/admin/reserve' },
        }
    },
    env: {
        dev: "http://localhost",
        production: ""
    }
}