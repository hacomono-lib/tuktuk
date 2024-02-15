import { emit, on } from '@create-figma-plugin/utilities'
import type { Repository } from '@tuktuk/core'
// biome-ignore lint/nursery/noUnusedImports: <explanation>
// biome-ignore lint/correctness/noUnusedVariables: <explanation>
import { type JSX, h } from 'preact'

import { useContext, useEffect, useMemo, useState } from 'preact/hooks'

import { toTokenFiles } from '..'
import {
  type CollectVariablesHandler,
  type DesignTokenFile,
  EventName,
  type RequestCollectVariablesHandler,
  type ResizeWindowHandler,
} from '../../types'
import { GitContext } from '../contexts'

const PAGE_HEIGHT = 800
const PAGE_WIDTH = 1200

const DEFAULT_DIR = '/token'

interface Props {
  repo: Repository
}

export function FilePreview({ repo }: Props) {
  const gitApi = useContext(GitContext)

  emit<ResizeWindowHandler>(EventName.ResizeWindow, { height: PAGE_HEIGHT, width: PAGE_WIDTH })

  emit<RequestCollectVariablesHandler>(EventName.RequestCollectVariables)

  on<CollectVariablesHandler>(EventName.CollectVariables, (t) => {
    // token.value = toTokenFiles(t)
    setFigmaFiles(toTokenFiles(t))
  })

  const [baseDir, setBaseDir] = useState(DEFAULT_DIR)

  const [gitFiles, setGitFiles] = useState<DesignTokenFile[]>([])

  useEffect(() => {
    (async () => {
      setGitFiles(await gitApi.file.listFiles(baseDir))
    })
  }, [baseDir])

  const [figmaFiles, setFigmaFiles] = useState<DesignTokenFile[]>([])

  const files = useMemo(() => {
    const merged = [...gitFiles, ...figmaFiles].filter((file, index, self) => {
      return index === self.findIndex((t) => t.name === file.name)
    })

    for (const file of merged) {
      const gitFile = gitFiles.find((f) => f.name === file.name)
      const figmaFile = figmaFiles.find((f) => f.name === file.name)
      if (gitFile && figmaFile) {
        file.placements = ['git', 'figma']
      } else if (gitFile) {
        file.placements = ['git']
      } else if (figmaFile) {
        file.placements = ['figma']
      }
    }

    return merged
  }, [gitFiles, figmaFiles])

  return <div> preview </div>
}
