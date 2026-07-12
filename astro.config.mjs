import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import partytown from '@astrojs/partytown'

export default defineConfig({
    site: 'https://bengkelvalo.com',
    trailingSlash: 'ignore',
    build: {
        // CSS di-inline ke tiap halaman: menghapus request render-blocking
        // (nilai tukar: HTML sedikit lebih besar, tapi paint pertama lebih cepat)
        inlineStylesheets: 'always',
    },
    i18n: {
        defaultLocale: 'id',
        locales: ['id', 'en'],
        routing: {
            prefixDefaultLocale: false,
        },
    },
    integrations: [
        sitemap({
            i18n: {
                defaultLocale: 'id',
                locales: { id: 'id', en: 'en' },
            },
        }),
        partytown({
            config: {
                forward: ['dataLayer.push', 'gtag'],
            },
        }),
    ],
})
