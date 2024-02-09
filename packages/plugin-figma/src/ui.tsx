import '!../build/index.css'
import { render, useWindowResize } from '@create-figma-plugin/ui'
import { emit, on } from '@create-figma-plugin/utilities'
import { signal } from '@preact/signals'
// biome-ignore lint/nursery/noUnusedImports: <explanation>
// biome-ignore lint/correctness/noUnusedVariables: <explanation>
import { h } from 'preact'
import { toTokenFiles } from './lib'
import { type CollectVariablesHandler, type DesignTokenFile, EventName, type ResizeWindowHandler } from './types'

  emit(EventName.RequestCollectVariables)

function Main() {
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

  const token = signal<DesignTokenFile[]>([])


  on<CollectVariablesHandler>(EventName.CollectVariables, (t) => {
    console.log('t', t)
    token.value = toTokenFiles(t)
    console.log('token', token.value)
  })

  return <p>{JSON.stringify(token, null, 2)}</p>
}

// biome-ignore lint/style/noDefaultExport: <explanation>
export default render(Main)
