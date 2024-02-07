import { render, useWindowResize } from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { EventName, type ResizeWindowHandler } from './types'

function mainUi() {
  function onWindowResize(windowSize: { width: number; height: number }) {
    emit<ResizeWindowHandler>(EventName.ResizeWindow, windowSize)
  }

  useWindowResize(onWindowResize, {
    maxHeight: 320,
    maxWidth: 320,
    minHeight: 120,
    minWidth: 120,
    resizeBehaviorOnDoubleClick: 'minimize',
  })
  return <h1 class="text-3xl font-bold underline">Hello, World!</h1>
}

// biome-ignore lint/style/noDefaultExport: <explanation>
export default render(mainUi)
