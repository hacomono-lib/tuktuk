export interface DesignTokenFile {
  name: string
  filename: string
  contents?: string
}

export interface DesignTokenDiff {
  name: string
  figma?: DesignTokenFile
  git?: DesignTokenFile
  diff: string
}

export type Provider = 'github'

export interface CachedToken {
  provider: Provider
  accessToken: string
}
