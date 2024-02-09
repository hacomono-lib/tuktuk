import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'

// biome-ignore lint/style/noDefaultExport: <explanation>
export default defineConfig({
  integrations: [
    starlight({
      title: 'tuktuk',
      social: {
        github: 'https://github.com/hacomono-lib/tuktuk',
      },
      sidebar: [
        {
          label: 'Home',
          link: '/',
        },
        {
          label: 'Introduction',
          collapsed: false,
          items: [
            { label: 'Getting Started', link: '/guides/start' },
            { label: 'Concepts', link: '/guides/concepts' },
          ],
        },
        {
          label: 'Reference',
          collapsed: false,
          autogenerate: { directory: '/reference', collapsed: false },
        },
      ],
    }),
  ],
})
