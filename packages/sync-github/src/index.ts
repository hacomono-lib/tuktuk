import type { Branch, GitApi, Organization, Repository, User } from '@tuktuk/core'
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

  readonly branch = {
    list: async ({ owner, name }: Pick<Repository, 'owner' | 'name'>): Promise<Branch[]> => {
      const response = await this.#octokit.request('GET /repos/{owner}/{repo}/branches', {
        owner: owner.name,
        repo: name,
      })

      return response.data.map((branch) => ({ name: branch.name, protected: branch.protected }))
    },

    get: async (repo: Pick<Repository, 'owner' | 'name'>, branchName: string): Promise<Branch> => {
      const { owner, name } = repo
      const response = await this.#octokit.request('GET /repos/{owner}/{repo}/branches/{branch}', {
        owner: owner.name,
        repo: name,
        branch: branchName,
      })

      return {
        name: response.data.name,
        protected: response.data.protected,
      }
    },

    create: async (
      { owner, name }: Pick<Repository, 'owner' | 'name'>,
      baseBranch: string,
      branchName: string,
    ): Promise<Branch> => {
      const response = await this.#octokit.request('POST /repos/{owner}/{repo}/git/refs', {
        owner: owner.name,
        repo: name,
        ref: `refs/heads/${branchName}`,
        sha: baseBranch,
      })

      return {
        name: response.data.ref,
        protected: false,
      }
    },
  }

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

      return Promise.all(
        response.data
          .filter(
            (repo) => repo.name !== '.github' && repo.name !== repo.owner.login && !repo.archived && !repo.is_template,
          )
          .map(async (repo): Promise<Repository> => {
            const owner = {
              name: repo.owner.login,
              type: repo.owner.type as 'User' | 'Organization',
            }

            return {
              id: repo.id,
              name: repo.name,
              fullName: repo.full_name,
              private: repo.private,
              // biome-ignore lint/style/noNonNullAssertion: <explanation>
              defaultBranch: await this.branch.get({ owner, name: repo.name }, repo.default_branch!),
              url: repo.url,
              htmlUrl: repo.html_url,
              // biome-ignore lint/style/noNonNullAssertion: <explanation>
              gitUrl: repo.git_url!,
              contentsUrl: repo.contents_url,
              permissions: repo.permissions ?? {},
              owner,
            }
          }),
      )
    },

    listByOrganization: async (organization: Organization): Promise<Repository[]> => {
      const response = await this.#octokit.request('GET /orgs/{org}/repos', { org: organization.name })
      return Promise.all(
        response.data
          .filter((repo) => repo.name !== '.github' && !repo.archived && !repo.is_template)
          .map(async (repo): Promise<Repository> => {
            const owner = {
              name: repo.owner.login,
              type: repo.owner.type as 'User' | 'Organization',
            }

            return {
              id: repo.id,
              name: repo.name,
              fullName: repo.full_name,
              private: repo.private,
              defaultBranch:
                (repo.size ?? 0) <= 0
                  ? // biome-ignore lint/style/noNonNullAssertion: <explanation>
                    { name: repo.default_branch!, protected: false }
                  : // biome-ignore lint/style/noNonNullAssertion: <explanation>
                    await this.branch.get({ owner, name: repo.name }, repo.default_branch!),
              url: repo.url,
              htmlUrl: repo.html_url,
              // biome-ignore lint/style/noNonNullAssertion: <explanation>
              gitUrl: repo.git_url!,
              contentsUrl: repo.contents_url,
              permissions: repo.permissions ?? {},
              owner,
            }
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
