import starlight from '@astrojs/starlight'
// eslint-disable-next-line import/extensions
import { defineConfig } from 'astro/config'

export default defineConfig({
  integrations: [
    starlight({
      title: 'json-reef',
      social: {
        github: 'https://github.com/hacomono-lib/json-reef',
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
