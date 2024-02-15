import type { DesignToken } from '@tuktuk/core'

export interface DesignTokenFile {
  name: string
  tokens?: DesignToken
}

export interface DesignTokenDiff {
  name: string
  figma?: DesignTokenFile
  git?: DesignTokenFile
}

export type Provider = 'github'

export interface CachedToken {
  provider: Provider
  accessToken: string
}
