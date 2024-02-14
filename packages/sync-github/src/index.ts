import type { BranchApi, FileApi, PullRequestApi, Repo, ReposApi } from '@tuktuk/types'
// import { fetchVerificationUrl } from './api'

export function createApi(): GitApi {
  return new GitApiImpl() as any
}

class GitApiImpl implements GitApi {
  #token: string | undefined

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
    this.#token = token
  }

  signout() {
    this.#token = undefined
  }

  get token() {
    return this.#token
  }

  get branch() {
    return new BranchApiImpl(this.#token)
  }

  get file() {
    return new FileApiImpl(this.#token)
  }

  get repos() {
    return new ReposApiImpl(this.#token)
  }

  get pullRequest() {
    return new PullRequestApiImpl(this.#token)
  }
}

class ReposApiImpl implements ReposApi {
  async search(): Promise<Repo[]> {
    return []
  }

  async getById(id: string): Promise<Repo> {
    return { id }
  }
}

class BranchApiImpl implements BranchApi {
  async list(): Promise<Branch[]> {
    return []
  }

  async create(branchName: string): Promise<Branch> {
    return branchName
  }
}

class FileApiImpl implements FileApi {
  async getAllByDirectory(directoryPath: string): Promise<File[]> {
    return []
  }

  async get(filePath: string): Promise<File> {
    return { path: filePath, content: '' }
  }

  async update(filePath: string, content: string): Promise<void> {
    return
  }

  async delete(filePath: string): Promise<void> {
    return
  }
}

class PullRequestApiImpl implements PullRequestApi {
  async create(title: string, description: string): Promise<PullRequest> {
    return { id: '' }
  }
}
