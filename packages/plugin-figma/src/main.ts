import { emit, on, showUI } from '@create-figma-plugin/utilities'
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from './constants'
import { cacheGitToken, getCachedGitToken, loadLocalVariables } from './lib-main'
import {
  type CacheGitTokenHandler,
  EventName,
  type RequestCachedGitTokenHandler,
  type RequestCollectVariablesHandler,
  type ResizeWindowHandler,
} from './types'

console.clear()

function main() {
  on<ResizeWindowHandler>(EventName.ResizeWindow, ({ width, height }) => figma.ui.resize(width, height))

  on<RequestCollectVariablesHandler>(EventName.RequestCollectVariables, () => {
    emit(EventName.CollectVariables, loadLocalVariables())
  })

  on<RequestCachedGitTokenHandler>(EventName.RequestCachedGitToken, async (provider) => {
    const token = await getCachedGitToken(provider)
    if (token === undefined) {
      emit(EventName.CachedGitToken, token)
      return
    }
  })

  on<CacheGitTokenHandler>(EventName.CacheGitToken, async (token) => {
    const cached = await getCachedGitToken(token.provider)
    if (cached !== undefined && cached.accessToken === token.accessToken) {
      return
    }

    await cacheGitToken(token)
  })

  showUI({ height: DEFAULT_HEIGHT, width: DEFAULT_WIDTH })
}

// biome-ignore lint/style/noDefaultExport: <explanation>
export default main
