import type { DiffFile } from 'diff2html/lib-esm/types'
import { Diff2HtmlUI as Diff2HtmlUiBase, type Diff2HtmlUIConfig } from 'diff2html/lib-esm/ui/js/diff2html-ui-base'
import hljs from 'highlight.js'
import json from 'highlight.js/lib/languages/json'
// biome-ignore lint/nursery/noUnusedImports: <explanation>
// biome-ignore lint/correctness/noUnusedVariables: <explanation>
import { createRef, h } from 'preact'
import { useEffect } from 'preact/hooks'
import type { DesignTokenDiff } from '../../../types'

export interface PrettyDiffProps {
  diff: DesignTokenDiff
  class: string
}

hljs.registerLanguage('json', json)

class Diff2HtmlUi extends Diff2HtmlUiBase {
  constructor(target: HTMLElement, diffInput?: string | DiffFile[], config?: Diff2HtmlUIConfig) {
    super(target, diffInput, config, hljs)
  }
}

export function Diff({ diff, class: className }: PrettyDiffProps) {
  const ref = createRef()

  useEffect(() => {
    const element = ref.current

    new Diff2HtmlUi(element, diff.diff, {
      fileListToggle: false,
      fileListStartVisible: false,
      smartSelection: true,
      fileContentToggle: false,
      stickyFileHeaders: true,
      drawFileList: false,
    }).draw()
  }, [diff])

  return <div class={className} ref={ref} />
}
