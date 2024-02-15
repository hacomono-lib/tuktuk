import type { GitApi } from '@tuktuk/core'
import { createApi as createGitHubApi } from '@tuktuk/sync-github'
import type { Provider } from '../types'

// FIXME: Provider is not defined
export function createApi(provider: Provider): GitApi {
  switch (provider) {
    case 'github':
      return createGitHubApi()
    default:
      throw new Error(`Unsupported provider: ${provider}`)
  }
}
