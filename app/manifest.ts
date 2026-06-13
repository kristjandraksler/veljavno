import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Veljavno — Sistem za pravočasne opomnike',
    short_name: 'Veljavno',
    description: 'Vozniško, osebna, potni list — prejmite e-mail opomnik preden je prepozno.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}