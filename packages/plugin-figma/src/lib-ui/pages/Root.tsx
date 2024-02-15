import { emit } from '@create-figma-plugin/utilities'
import type { Repository } from '@tuktuk/core'
// biome-ignore lint/nursery/noUnusedImports: <explanation>
// biome-ignore lint/correctness/noUnusedVariables: <explanation>
import { Fragment, h } from 'preact'
import { useContext, useMemo, useState } from 'preact/hooks'
import { type CacheGitTokenHandler, EventName } from '../../types'
import { GitContext } from '../contexts'
import { FilePreview } from './FilePreview'
import { SelectRepo } from './SelectRepos'
import { Unauthorized } from './Unauthorized'

enum PageState {
  Unauthorized = 0,
  SelectRepos = 1,
  FilePreview = 2,
  Completed = 3,
}

export function Root() {
  const gitApi = useContext(GitContext)

  const [authorized, setAuthorized] = useState(false)

  const [repo, setRepo] = useState<Repository | null>(null)

  const [pullRequestUrl, setPullRequestUrl] = useState<string | undefined>(undefined)

  const signin = () => {
    if (!gitApi.token) {
      return
    }

    emit<CacheGitTokenHandler>(EventName.CacheGitToken, { provider: 'github', accessToken: gitApi.token })
    setAuthorized(true)
  }

  const signout = () => {
    setAuthorized(false)
    setRepo(null)
    setPullRequestUrl(undefined)
  }

  const backToSelectRepos = () => {
    setRepo(null)
    setPullRequestUrl(undefined)
  }

  const backToEdit = () => {
    setPullRequestUrl(undefined)
  }

  const state = useMemo(() => {
    if (!authorized) {
      return PageState.Unauthorized
    }

    if (!repo) {
      return PageState.SelectRepos
    }

    if (!pullRequestUrl) {
      return PageState.FilePreview
    }

    return PageState.Completed
  }, [authorized, repo, pullRequestUrl])

  return (
    <Fragment>
      {(() => {
        switch (state) {
          case PageState.Unauthorized:
            return <Unauthorized onAuthorized={signin} />
          case PageState.SelectRepos:
            return <SelectRepo onSelectedRepo={setRepo} onSignOut={signout} />
          case PageState.FilePreview:
            return <FilePreview onCreatedPullRequest={setPullRequestUrl} onBack={backToSelectRepos} onSignOut={signout} />
          case PageState.Completed:
            return <div> Completed </div>
        }
      })()}
    </Fragment>
  )
}
