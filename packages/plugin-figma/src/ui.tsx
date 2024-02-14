import '!../build/index.css'
import { render } from '@create-figma-plugin/ui'
// biome-ignore lint/nursery/noUnusedImports: <explanation>
// biome-ignore lint/correctness/noUnusedVariables: <explanation>
import { h } from 'preact'
import { GitContext, Root, createApi } from './lib-ui'

// emit(EventName.RequestCollectVariables)

function Main() {
  // const token = signal<DesignTokenFile[]>([])

  // const tokenJson = computed(() => JSON.stringify(token.value, null, 2))

  // on<CollectVariablesHandler>(EventName.CollectVariables, (t) => {
  //   token.value = toTokenFiles(t)
  // })

  const gitApi = createApi('github')

  return (
    <GitContext.Provider value={gitApi}>
      <Root />
    </GitContext.Provider>
  )
}

// biome-ignore lint/style/noDefaultExport: <explanation>
export default render(Main)
