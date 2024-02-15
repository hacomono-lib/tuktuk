import { createFetch } from '@tuktuk/core'

const BASE_URL = 'https://api.github.com'

export const $fetch = createFetch({
  // biome-ignore lint/style/useNamingConvention: <explanation>
  baseURL: BASE_URL,
  headers: {
    'X-GitHub-Api-Version': '2022-11-28',
    accept: 'application/vnd.github+json'
  }
})
