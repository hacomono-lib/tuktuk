import { defineProject, mergeConfig } from 'vitest/config'
import config from '../../vitest.base'

// biome-ignore lint/style/noDefaultExport: <explanation>
export default mergeConfig(
  config,
  defineProject({
    test: {
      environment: 'node',
    },
  }),
)
