import { emit } from '@create-figma-plugin/utilities'
// biome-ignore lint/nursery/noUnusedImports: <explanation>
// biome-ignore lint/correctness/noUnusedVariables: <explanation>
import { Fragment, h } from 'preact'
import { useContext, useMemo, useState } from 'preact/hooks'
import { type CacheGitTokenHandler, EventName } from '../../types'
import { GitContext } from '../contexts'
import { SelectRepo } from './SelectRepos'
import { Unauthorized } from './Unauthorized'

enum PageState {
  Unauthorized = 0,
  SelectRepos = 1,
  Edit = 2,
  Completed = 3,
}

const DEFAULT_PAGE_DIR = '/'

export function Root() {
  const gitApi = useContext(GitContext)

  const [authorized, setAuthorized] = useState(false)

  const [repo, setRepo] = useState<string | undefined>(undefined)

  const [baseDir, setBaseDir] = useState<string>(DEFAULT_PAGE_DIR)

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
    setRepo(undefined)
    setBaseDir(DEFAULT_PAGE_DIR)
    setPullRequestUrl(undefined)
  }

  const backToEdit = () => {
    setBaseDir(DEFAULT_PAGE_DIR)
    setPullRequestUrl(undefined)
  }

  const onCompleted = (pullRequestUrl: string) => {
    setPullRequestUrl(pullRequestUrl)
  }

  const state = useMemo(() => {
    if (!authorized) {
      return PageState.Unauthorized
    }

    if (!repo) {
      return PageState.SelectRepos
    }

    if (!pullRequestUrl) {
      return PageState.Edit
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
          case PageState.Edit:
            return <div> Edit </div>
          case PageState.Completed:
            return <div> Completed </div>
        }
      })()}
    </Fragment>
  )
}
