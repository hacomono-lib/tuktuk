/**
 * note:
 * diff2html.min.css には { contents: "\200b" } のスタイルが含まれている.
 * esbuild で css をバンドルすると、 css はそのまま template literal となり、動的に style タグを埋め込むロジックに変わる
 * この際, template literal に含まれる \200b がそのまま埋め込まれ, "Legacy octal escape sequences cannot be used in tempalte literals" エラーとなる
 * これを解消するために, わざとビルド前に css をコピーし, sed s/\\\\/\\\\\\\\/g したものをバンドル対象とする.
 * 詳細は package.json を参照のこと.
 *
 * diff2html.min.css contains { contents: "\200b" }.
 * When bundling css with esbuild, the css becomes a template literal and the logic to embed the style tag dynamically changes.
 * At this time, the \200b included in the template literal is embedded as it is, causing the error "Legacy octal escape sequences cannot be used in tempalte literals".
 * To resolve this, the css is intentionally copied before building and the sed s/\\\\/\\\\\\\\/g is bundled.
 * For details, see package.json.
 */
import '!../build/diff2html.min.css'
import '!../build/index.css'
import { render } from '@create-figma-plugin/ui'
import { createApi } from '@tuktuk/sync-github'
// biome-ignore lint/nursery/noUnusedImports: <explanation>
// biome-ignore lint/correctness/noUnusedVariables: <explanation>
import { h } from 'preact'
import { GitContext, Root } from './lib-ui'

// emit(EventName.RequestCollectVariables)

function Main() {
  const gitApi = createApi()

  return (
    <GitContext.Provider value={gitApi}>
      <Root />
    </GitContext.Provider>
  )
}

// biome-ignore lint/style/noDefaultExport: <explanation>
export default render(Main)
