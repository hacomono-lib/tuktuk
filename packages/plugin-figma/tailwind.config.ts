import type { Config } from 'tailwindcss'

// biome-ignore lint/style/noDefaultExport: <explanation>
export  default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    exntend: {}
  },
  plugins: [],
  darkMode: ['class', '.figma-dark']
} satisfies Config
