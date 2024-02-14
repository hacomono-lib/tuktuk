import type { DesignToken } from '@tuktuk/types'

export interface DesignTokenFile {
  name: string
  tokens: DesignToken
}

export type Provider = 'github'

export interface CachedToken {
  provider: Provider
  accessToken: string
}
