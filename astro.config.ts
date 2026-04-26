import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  output: 'static',
  site: 'https://insighty.io',
  build: {
    inlineStylesheets: 'always',
  },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/use-cases/template') &&
        !page.includes('/sitemap/') &&
        !page.includes('/404/'),
      namespaces: {
        news: false,
        xhtml: false,
        image: false,
        video: false,
      },
      serialize(item) {
        const url = item.url

        // Homepage
        if (url === 'https://insighty.io/') {
          return { ...item, changefreq: 'weekly', priority: 1.0, lastmod: new Date() }
        }

        // High-value conversion pages
        if (['/pricing/', '/founding-member/', '/request-a-demo/'].some(p => url.endsWith(p))) {
          return { ...item, changefreq: 'weekly', priority: 0.9, lastmod: new Date() }
        }

        // Use case pages
        if (url.includes('/use-cases/')) {
          return { ...item, changefreq: 'monthly', priority: 0.8, lastmod: new Date() }
        }

        // Compare pages
        if (url.includes('/compare/')) {
          return { ...item, changefreq: 'monthly', priority: 0.8, lastmod: new Date() }
        }

        // Blog index
        if (url.endsWith('/blog/')) {
          return { ...item, changefreq: 'daily', priority: 0.8, lastmod: new Date() }
        }

        // Individual blog posts
        if (url.includes('/blog/')) {
          return { ...item, changefreq: 'monthly', priority: 0.7, lastmod: new Date() }
        }

        // Tools
        if (url.includes('/tools/')) {
          return { ...item, changefreq: 'monthly', priority: 0.7, lastmod: new Date() }
        }

        // About, contact, privacy, sitemap
        return { ...item, changefreq: 'yearly', priority: 0.3, lastmod: new Date() }
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})
