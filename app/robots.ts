import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/nastavitve', '/affiliate-dashboard'],
    },
    sitemap: 'https://veljavno.si/sitemap.xml',
  }
}