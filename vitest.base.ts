import { defineConfig } from 'vitest/config'

// biome-ignore lint/style/noDefaultExport: <explanation>
export default defineConfig({
  test: {
    reporters: ['html', 'json'],
  },
})
