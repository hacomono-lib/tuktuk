import type { GitApi, Organization, Repository, User } from '@tuktuk/core'
import type { GitDesignTokenFile } from '@tuktuk/core'
import { Octokit, RequestError } from 'octokit'
import { decode } from './encode'
import { fixPath } from './path'

export function createApi(): GitApi {
  return new GitApiImpl() as any
}

class GitApiImpl implements GitApi {
  #octokit = new Octokit()

  // biome-ignore lint/nursery/useAwait: <explanation>
  async authorize(token?: string): Promise<void> {
    if (token) {
      this.#setToken(token)
      return
    }

    // const { verificationUri } = await fetchVerificationUrl()

    // window.open(verificationUri, '_blank')
  }

  #setToken(token: string) {
    this.#octokit = new Octokit({
      auth: token,
    })
  }

  signout() {
    this.#octokit = new Octokit()
  }

  readonly branch = {} as any

  readonly file = {
    listTokenFiles: async (repo: Repository, branch: string, dir: string): Promise<GitDesignTokenFile[]> => {
      try {
        const response = await this.#octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
          owner: repo.owner.name,
          repo: repo.name,
          path: fixPath(dir),
          ref: branch,
        })
        console.log(response)

        const files = Array.isArray(response.data) ? response.data : [response.data]

        return files
          .filter((f): f is typeof f & { type: 'file'; encoding?: string } => f.type === 'file')
          .filter((f) => f.name.endsWith('.json'))
          .map(
            (file): GitDesignTokenFile => ({
              filename: file.path,
              name: file.name,
              contents: !!file.content && !!file.encoding ? decode(file.content, file.encoding) : undefined,
            }),
          )
      } catch (e) {
        if (e instanceof RequestError && e.status === 404) {
          return []
        }
        throw e
      }
    },

    getTokenFile: async (repo: Repository, branch: string, filepath: string): Promise<GitDesignTokenFile | null> => {
      if (!filepath.endsWith('.json')) {
        return null
      }

      try {
        const response = await this.#octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
          owner: repo.owner.name,
          repo: repo.name,
          path: fixPath(filepath),
          ref: branch,
        })

        const file = response.data

        if (Array.isArray(file) || file.type !== 'file') {
          throw new Error('Not a file')
        }

        console.log(file)

        return {
          filename: file.path,
          name: file.name,
          contents: !!file.content && !!file.encoding ? decode(file.content, file.encoding) : undefined,
        }
      } catch (e) {
        if (e instanceof RequestError && e.status === 404) {
          return null
        }
        throw e
      }
    },
  } as any

  readonly pullRequest = {} as any

  readonly repos = {
    listByUser: async (user: User): Promise<Repository[]> => {
      const response = await this.#octokit.request('GET /users/{username}/repos', {
        username: user.name,
      })

      return response.data.map(
        (repo): Repository => ({
          id: repo.id,
          name: repo.name,
          fullName: repo.full_name,
          private: repo.private,
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          defaultBranch: repo.default_branch!,
          url: repo.url,
          htmlUrl: repo.html_url,
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          gitUrl: repo.git_url!,
          contentsUrl: repo.contents_url,
          permissions: repo.permissions ?? {},
          owner: {
            name: repo.owner.login,
            type: repo.owner.type as 'User' | 'Organization',
          },
        }),
      )
    },

    listByOrganization: async (organization: Organization): Promise<Repository[]> => {
      const response = await this.#octokit.request('GET /orgs/{org}/repos', { org: organization.name })
      return response.data.map(
        (repo): Repository => ({
          id: repo.id,
          name: repo.name,
          fullName: repo.full_name,
          private: repo.private,
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          defaultBranch: repo.default_branch!,
          url: repo.url,
          htmlUrl: repo.html_url,
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          gitUrl: repo.git_url!,
          contentsUrl: repo.contents_url,
          permissions: repo.permissions ?? {},
          owner: {
            name: repo.owner.login,
            type: repo.owner.type as 'User' | 'Organization',
          },
        }),
      )
    },
  }

  readonly user = {
    getCurrent: async (): Promise<User> => {
      const response = await this.#octokit.request('GET /user')
      return {
        id: response.data.id,
        name: response.data.login,
        avatarUrl: response.data.avatar_url,
      }
    },
  }

  readonly org = {
    list: async (): Promise<Organization[]> => {
      const response = await this.#octokit.request('GET /user/orgs')
      return response.data.map((org) => ({
        id: org.id,
        name: org.login,
        avatarUrl: org.avatar_url,
      }))
    },
  }
}
