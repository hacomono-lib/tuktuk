import type { PullRequest, Repository } from '@tuktuk/core'
// biome-ignore lint/nursery/noUnusedImports: <explanation>
// biome-ignore lint/correctness/noUnusedVariables: <explanation>
import { Fragment, h } from 'preact'
import { useMemo, useState } from 'preact/hooks'
import { Completed } from './Completed'
// import { GitContext } from '../contexts'
import { Review } from './Review'
import { SelectRepo } from './SelectRepos'
import { Unauthorized } from './Unauthorized'

enum PageState {
  Unauthorized = 0,
  SelectRepo = 1,
  Review = 2,
  Completed = 3,
}

export function Root() {
  // const gitApi = useContext(GitContext)

  const [authorized, setAuthorized] = useState(false)

  const [repo, setRepo] = useState<Repository | null>(null)

  const [pullRequest, setPullRequest] = useState<PullRequest | null>(null)

  const signin = () => {
    // emit<CacheGitTokenHandler>(EventName.CacheGitToken, { provider: 'github', accessToken: gitApi.token })
    setAuthorized(true)
  }

  const signout = () => {
    setAuthorized(false)
    setRepo(null)
    setPullRequest(null)
  }

  const backToSelectRepos = () => {
    setRepo(null)
    setPullRequest(null)
  }

  const backToEdit = () => {
    setPullRequest(null)
  }

  const state = useMemo(() => {
    if (!authorized) {
      return PageState.Unauthorized
    }

    if (!repo) {
      return PageState.SelectRepo
    }

    if (!pullRequest) {
      return PageState.Review
    }

    return PageState.Completed
  }, [authorized, repo, pullRequest])

  return (
    <Fragment>
      {(() => {
        switch (state) {
          case PageState.Unauthorized:
            return <Unauthorized onAuthorized={signin} />
          case PageState.SelectRepo:
            return <SelectRepo onSelectedRepo={setRepo} onSignOut={signout} />
          case PageState.Review:
            return (
              <Review
                // biome-ignore lint/style/noNonNullAssertion: <explanation>
                repo={repo!}
                onCreatedPullRequest={setPullRequest}
                onBack={backToSelectRepos}
                onSignOut={signout}
              />
            )
          case PageState.Completed:
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            return <Completed pullRequest={pullRequest!} onBack={backToEdit} onSignOut={signout} />
        }
      })()}
    </Fragment>
  )
}
