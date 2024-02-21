import { Bold, Button, Text } from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import type { Branch, PullRequest, Repository } from '@tuktuk/core'
// biome-ignore lint/nursery/noUnusedImports: <explanation>
// biome-ignore lint/correctness/noUnusedVariables: <explanation>
import { Fragment, h } from 'preact'

import { useState } from 'preact/hooks'
// import { useState } from 'preact/hooks'
import { type DesignTokenDiff, EventName, type ResizeWindowHandler } from '../../types'
// import { loadFigmaFiles, loadGitFiles, toDiffSet } from '../hooks'
import { Diff, FileList, ReviewHeader, SidebarLayout } from '../components'
import { loadFigmaFiles, loadGitFiles, toDiffSet } from '../hooks'

const PAGE_HEIGHT = 800
const PAGE_WIDTH = 1200

const DEFAULT_DIR = '/tokens'

interface ReviewProps {
  repo: Repository
  onCreatedPullRequest: (pullRequest: PullRequest) => void
  onBack: () => void
  onSignOut: () => void
}

export function Review({ repo, onBack }: ReviewProps) {
  const [baseDir, setBaseDir] = useState(DEFAULT_DIR)

  const [branch, setBranch] = useState<Branch>(repo.defaultBranch)

  const { files: gitFiles, loading: loadingFiles } = loadGitFiles(repo, branch, baseDir)

  const figmaFiles = loadFigmaFiles()

  if (loadingFiles) {
    return <Loading />
  }

  const diffSet = toDiffSet(figmaFiles, gitFiles)

  if (diffSet.length <= 0) {
    return <NoFilesFound backToSelectRepos={onBack} />
  }

  emit<ResizeWindowHandler>(EventName.ResizeWindow, { height: PAGE_HEIGHT, width: PAGE_WIDTH })

  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  // biome-ignore lint/correctness/useHookAtTopLevel: <explanation> FIXME: 実力不足のため追加
  const [selectedFile, setSelectedFile] = useState<DesignTokenDiff>(diffSet[0]!)

  return (
    <Fragment>
      <SidebarLayout>
        <SidebarLayout.Sidebar>
          <FileList files={diffSet} selected={selectedFile} onSelectFile={setSelectedFile} />
        </SidebarLayout.Sidebar>
        <SidebarLayout.MainContent>
          <SidebarLayout.MainContentHeader>
            <ReviewHeader
              repo={repo}
              baseDir={baseDir}
              onBaseDirChange={setBaseDir}
              branch={branch}
              onBranchChange={setBranch}
            />
          </SidebarLayout.MainContentHeader>
          <SidebarLayout.MainContentBody>
            <Diff class="p-8" diff={selectedFile} />
          </SidebarLayout.MainContentBody>
        </SidebarLayout.MainContent>
      </SidebarLayout>
      <SidebarLayout.Footer>Footer</SidebarLayout.Footer>
    </Fragment>
  )
}

function Loading() {
  return (
    <Fragment>
      <Text>Loading</Text>
    </Fragment>
  )
}

interface NoFilesFoundProps {
  backToSelectRepos: () => void
}

function NoFilesFound({ backToSelectRepos }: NoFilesFoundProps) {
  return (
    <Fragment>
      <Text>
        <Bold>No files found</Bold>
      </Text>
      <Button onClick={backToSelectRepos}>Back</Button>
    </Fragment>
  )
}
