import type { EventHandler } from '@create-figma-plugin/utilities'

export enum EventName {
  ResizeWindow  = 'RESIZE_WINDOW'
}

export interface ResizeWindowHandler extends EventHandler {
  name: EventName.ResizeWindow,
  handler: (windowSize: { width: number; height: number }) => void
}
