import { definePlugin } from '@tuktuk/core'

const PLUGIN_KEY = 'figma' as const

export interface FigmaFetchConfig {
  token: string
  file: string
}

declare module '@tuktuk/core' {
  export interface FetchConfig {
    figma: FigmaFetchConfig
  }
}

// biome-ignore lint/style/noDefaultExport: <explanation>
export default definePlugin<FigmaFetchConfig>({
  name: PLUGIN_KEY,
  type: 'fetch',
  fetch: (config) => {
    console.log('figma fetcher')
    console.log(config)
    return { values: [] }
  }
})
