import type { Config } from '@tuktuk/core'
import { loadConfig as load } from 'c12'

const defaultConfig = {
  pipelines: []
} as const satisfies Config

export async function loadConfig(): Promise<Config> {
  const { config } = (await load<Config>({ name: 'tuktuk' })) 
  return config ?? defaultConfig
}
