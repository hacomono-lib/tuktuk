import { emit, on, showUI } from '@create-figma-plugin/utilities'
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from './constants'
import { loadLocalVariables } from './lib'
import { EventName, type RequestCollectVariablesHandler, type ResizeWindowHandler } from './types'

console.clear()

function main() {
  on<ResizeWindowHandler>(EventName.ResizeWindow, ({ width, height }) => figma.ui.resize(width, height))

  on<RequestCollectVariablesHandler>(EventName.RequestCollectVariables, () => {
    emit(EventName.CollectVariables, loadLocalVariables())
  })

  showUI({ height: DEFAULT_HEIGHT, width: DEFAULT_WIDTH })
}

// biome-ignore lint/style/noDefaultExport: <explanation>
export default main
