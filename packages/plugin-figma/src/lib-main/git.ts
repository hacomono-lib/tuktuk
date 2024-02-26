import { PLUGIN_NAME } from '../constants'
import type { CachedToken, Provider } from '../types'

/**
 * Use only on the main side
 */
export async function getCachedGitToken(provider: Provider): Promise<CachedToken | undefined> {
  const previousToken = await figma.clientStorage.getAsync(getCacheKey(provider))

  if (!isToken(previousToken)) {
    return
  }

  return previousToken
}

/**
 * Use only on the main side
 */
export async function cacheGitToken(token: CachedToken): Promise<void> {
  await figma.clientStorage.setAsync(getCacheKey(token.provider), token)
}

function getCacheKey(provider: Provider): string {
  return `__${PLUGIN_NAME}__${provider}_accessToken`
}

function isToken(token: unknown): token is CachedToken {
  return typeof token === 'object' && token !== null && 'provider' in token && 'accessToken' in token
}
