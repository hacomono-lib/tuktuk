import { on, showUI } from '@create-figma-plugin/utilities'
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from './constants'
import { EventName, type ResizeWindowHandler } from './types'

function main() {
  on<ResizeWindowHandler>(EventName.ResizeWindow, ({ width, height }) => figma.ui.resize(width, height))

  showUI({ height: DEFAULT_HEIGHT, width: DEFAULT_WIDTH })
}

// biome-ignore lint/style/noDefaultExport: <explanation>
export default main
