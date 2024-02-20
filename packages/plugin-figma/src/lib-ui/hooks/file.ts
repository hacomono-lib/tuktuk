import { emit, on } from '@create-figma-plugin/utilities'
import type { Repository } from '@tuktuk/core'
import { createTwoFilesPatch } from 'diff'
import { useContext, useEffect, useMemo, useState } from 'preact/hooks'
import {
  type CollectVariablesHandler,
  type DesignTokenDiff,
  type DesignTokenFile,
  EventName,
  type RequestCollectVariablesHandler,
} from '../../types'
import { GitContext } from '../contexts'
import { toTokenFiles } from '../format'

interface LoadFilesState {
  loading: boolean
  files: DesignTokenFile[]
}

export function loadGitFiles(repo: Repository, branch: string, baseDir: string): LoadFilesState {
  const gitApi = useContext(GitContext)

  const [gitFiles, setGitFiles] = useState<DesignTokenFile[]>([])

  const [fileLoading, setFileLoading] = useState(false)

  useEffect(() => {
    setFileLoading(true)
    ;(async () => {
      const files = await gitApi.file.listTokenFiles(repo, branch, baseDir)

      const loadedFiles = await Promise.all(
        files.map(async (file) => {
          const content = await gitApi.file.getTokenFile(repo, branch, file.filename)
          return content ? { ...file, contents: content.contents } : file
        }),
      )
      setGitFiles(loadedFiles)
      setFileLoading(false)
    })()
  }, [repo, branch, baseDir])

  return { loading: fileLoading, files: gitFiles }
}

export function loadFigmaFiles(): DesignTokenFile[] {
  const [figmaFiles, setFigmaFiles] = useState<DesignTokenFile[]>([])

  useEffect(() => {
    on<CollectVariablesHandler>(EventName.CollectVariables, (t) => {
      const files = toTokenFiles(t)

      setFigmaFiles(files)
    })

    emit<RequestCollectVariablesHandler>(EventName.RequestCollectVariables)
  }, [])

  return figmaFiles
}

export function toDiffSet(figmaFiles: DesignTokenFile[], gitFiles: DesignTokenFile[]): DesignTokenDiff[] {
  return useMemo(() => {
    const diffSet = [] as Omit<DesignTokenDiff, 'diff'>[]

    for (const figmaFile of figmaFiles) {
      const gitFile = gitFiles.find((file) => file.name === `${figmaFile.name}.json`)
      diffSet.push({
        name: figmaFile.name,
        figma: figmaFile,
        git: gitFile,
      })
    }

    for (const gitFile of gitFiles) {
      const findFigmaFile = diffSet.find((file) => `${file.name}.json` === gitFile.name)
      if (!findFigmaFile) {
        const extractedName = gitFile.name.split('.').slice(0, -1).join('.')

        diffSet.push({
          name: extractedName,
          git: gitFile,
        })
      }
    }

    return diffSet.map(completionDiff)
  }, [figmaFiles, gitFiles])
}

// 補完
// eng
// completiono

function completionDiff(diff: Omit<DesignTokenDiff, 'diff'>): DesignTokenDiff {
  // new file
  if (!diff.git && diff.figma) {
    const filename = `${diff.figma.name}.json`
    return {
      ...diff,
      diff: createTwoFilesPatch(filename, filename, '', diff.figma.contents ?? ''),
    }
  }

  // delete file
  if (!diff.figma && diff.git) {
    const filename = diff.git.name
    return {
      ...diff,
      diff: createTwoFilesPatch(filename, filename, diff.git.contents ?? '', ''),
    }
  }

  if (!(diff.figma || diff.git)) {
    throw new Error('Invalid diff')
  }

  // update file
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const filename = `${diff.figma!.name}.json`
  return {
    ...diff,
    diff: createTwoFilesPatch(filename, filename, diff.figma?.contents ?? '', diff.git?.contents ?? ''),
  }
}
