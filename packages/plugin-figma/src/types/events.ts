import type { EventHandler } from '@create-figma-plugin/utilities'
import type { VariableSet } from '../lib'

export enum EventName {
  ResizeWindow = 'RESIZE_WINDOW',
  RequestCollectVariables = 'REQUEST_COLLECT_VARIABLES',
  CollectVariables = 'COLLECT_VARIABLES',
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
