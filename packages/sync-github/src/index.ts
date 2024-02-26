import { createOAuthDeviceAuth } from '@octokit/auth-oauth-device'
import type {
  Branch,
  CreatePrOptions,
  GitApi,
  GitDesignTokenFile,
  Organization,
  PullRequest,
  Repository,
  User,
} from '@tuktuk/core'
import { Octokit, RequestError } from 'octokit'
import { GITHUB_APP_CLIENT_ID } from './constants'
import { decode, encode } from './encode'
import { fixPath } from './path'

export function createApi(): GitApi {
  return new GitApiImpl()
}

class GitApiImpl implements GitApi {
  #octokit = new Octokit()

  async authorize(token?: string): Promise<void> {
    if (token) {
      this.#setToken(token)
      return
    }

    console.log(location)

    const auth = createOAuthDeviceAuth({
      clientType: 'oauth-app',
      clientId: GITHUB_APP_CLIENT_ID,
      onVerification: (verification) => {
        console.log(verification)
      },
      // request: request.defaults({
      //   headers: {
      //     'user-agent': `octokit-auth-oauth-device.js/${version} ${getUserAgent()}`,
      //     origin: location.origin === 'null' ? location.ancestorOrigins[0] : location.origin,
      //   },
      // }),
      // scopes: ['repo'],
    })

    const result = await auth({
      type: 'oauth',
    })

    this.#setToken(result.token)
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

      return response.data.map((branch) => ({ name: branch.name, protected: branch.protected, sha: branch.commit.sha }))
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
        sha: response.data.commit.sha,
      }
    },

    create: async (
      { owner, name }: Pick<Repository, 'owner' | 'name'>,
      baseBranch: Branch,
      newBranchName: string,
    ): Promise<Branch> => {
      if (!baseBranch.sha) {
        throw new Error('Base branch does not have a SHA')
      }

      const response = await this.#octokit.request('POST /repos/{owner}/{repo}/git/refs', {
        owner: owner.name,
        repo: name,
        ref: `refs/heads/${newBranchName}`,
        sha: baseBranch.sha,
      })

      return {
        name: response.data.ref,
        protected: false,
        sha: response.data.object.sha,
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

        const files = Array.isArray(response.data) ? response.data : [response.data]

        return files
          .filter((f): f is typeof f & { type: 'file'; encoding?: string } => f.type === 'file')
          .filter((f) => f.name.endsWith('.json'))
          .map(
            (file): GitDesignTokenFile => ({
              filename: file.path,
              name: file.name,
              sha: file.sha,
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

        return {
          filename: file.path,
          name: file.name,
          sha: file.sha,
          contents: !!file.content && !!file.encoding ? decode(file.content, file.encoding) : undefined,
        }
      } catch (e) {
        if (e instanceof RequestError && e.status === 404) {
          return null
        }
        throw e
      }
    },

    create: async (repo: Repository, branch: Branch, filepath: string, content: string): Promise<void> => {
      await this.#octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner: repo.owner.name,
        repo: repo.name,
        path: fixPath(filepath),
        message: `Create ${filepath}`,
        content: encode(content, 'base64'),
        branch: branch.name,
      })
    },

    update: async (repo: Repository, branch: Branch, file: GitDesignTokenFile, content: string): Promise<void> => {
      await this.#octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner: repo.owner.name,
        repo: repo.name,
        path: fixPath(file.filename),
        message: `Update ${file.filename}`,
        content: encode(content, 'base64'),
        sha: file.sha,
        branch: branch.name,
      })
    },

    delete: async (repo: Repository, branch: Branch, file: GitDesignTokenFile): Promise<void> => {
      if (!file.sha) {
        throw new Error('File does not have a SHA')
      }

      await this.#octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
        owner: repo.owner.name,
        repo: repo.name,
        path: fixPath(file.filename),
        message: `Delete ${file.filename}`,
        branch: branch.name,
        sha: file.sha,
      })
    },
  }

  readonly pullRequest = {
    create: async (
      repo: Repository,
      headBranch: Branch,
      baseBranch: Branch,
      opt: CreatePrOptions,
    ): Promise<PullRequest> => {
      const response = await this.#octokit.request('POST /repos/{owner}/{repo}/pulls', {
        owner: repo.owner.name,
        repo: repo.name,
        title: opt.title,
        body: opt.description,
        head: headBranch.name,
        base: baseBranch.name,
      })

      return {
        title: response.data.title,
        url: response.data.html_url,
      }
    },
  }

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
                    { name: repo.default_branch!, protected: false, sha: undefined }
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
