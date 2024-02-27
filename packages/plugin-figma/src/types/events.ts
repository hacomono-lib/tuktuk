import type { EventHandler } from '@create-figma-plugin/utilities'
import type { VariableSet } from '../lib-main'
import type { CachedToken, Provider } from './git'

export enum EventName {
  ResizeWindow = 'RESIZE_WINDOW',
  RequestCollectVariables = 'REQUEST_COLLECT_VARIABLES',
  CollectVariables = 'COLLECT_VARIABLES',
  RequestCachedGitToken = 'REQUEST_CACHED_GIT_TOKEN',
  CachedGitToken = 'CACHED_GIT_TOKEN',
  CacheGitToken = 'CACHE_GIT_TOKEN',
}

export interface ResizeWindowHandler extends EventHandler {
  name: EventName.ResizeWindow
  handler: (windowSize: { width: number; height: number }) => void
}

export interface RequestCollectVariablesHandler extends EventHandler {
  name: EventName.RequestCollectVariables
  handler: () => void
}

export interface CollectVariablesHandler extends EventHandler {
  name: EventName.CollectVariables
  handler: (variableSets: VariableSet[]) => void
}

export interface RequestCachedGitTokenHandler extends EventHandler {
  name: EventName.RequestCachedGitToken
  handler: (provider: Provider) => void
}

export interface CachedGitTokenHandler extends EventHandler {
  name: EventName.CachedGitToken
  handler: (token: CachedToken) => void
}

export interface CacheGitTokenHandler extends EventHandler {
  name: EventName.CacheGitToken
  handler: (token: CachedToken) => void
}
