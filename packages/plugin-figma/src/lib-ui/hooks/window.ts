import { useWindowResize as useFigmaWindowResize } from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { EventName, type ResizeWindowHandler } from '../../types'

export type ResizeOption = Parameters<typeof useFigmaWindowResize>[1]

export function useWindowResize(options: ResizeOption) {
  useFigmaWindowResize((windowSize) => {
    emit<ResizeWindowHandler>(EventName.ResizeWindow, windowSize)
  }, options)
}
