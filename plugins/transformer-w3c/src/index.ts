import { definePlugin } from '@tuktuk/core'

export interface W3cTransformConfig {
  /**
   * @default true
   */
  includeMeta?: boolean
}

declare module '@tuktuk/core' {
  export interface TransformConfig extends W3cTransformConfig {
    w3c: W3cTransformConfig
  }
}

// biome-ignore lint/style/noDefaultExport: <explanation>
export default definePlugin({
  name: 'w3c',
  type: 'transform',
  transform: (config, context) => {
    console.log('w3c transformer')
    return []
  },
})
