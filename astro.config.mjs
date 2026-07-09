import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import partytown from '@astrojs/partytown'

export default defineConfig({
    site: 'https://bengkelvalo.com',
    trailingSlash: 'ignore',
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
