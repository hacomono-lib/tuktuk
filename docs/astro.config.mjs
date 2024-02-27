import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'

// biome-ignore lint/style/noDefaultExport: <explanation>
export default defineConfig({
  site: 'https://hacomono-lib.github.io',
  base: '/tuktuk',
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
          autogenerate: { directory: '/guides', collapsed: false },
        },
        {
          label: 'Figma Plugin',
          collapsed: false,
          autogenerate: { directory: '/figma', collapsed: false },
        },
        {
          label: 'GitHub',
          collapsed: false,
          autogenerate: { directory: '/github', collapsed: false },
        },
      ],
    }),
  ],
})
