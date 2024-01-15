import { defineConfig } from '@tuktuk/core'
import '@tuktuk/fetcher-figma'
import '@tuktuk/transformer-w3c'

// biome-ignore lint/style/noDefaultExport: <explanation>
export default defineConfig({
  plugins: [
    '@tuktuk/fetcher-figma',
    '@tuktuk/transformer-w3c',
  ],
  pipelines: [
    {
      fetch: {
        figma: {
          token: process.env.FIGMA_TOKEN,
          file: process.env.FIGMA_FILE,
        }
      },
      transform: {
        w3c: {

        }
      }
    }
  ]
})
