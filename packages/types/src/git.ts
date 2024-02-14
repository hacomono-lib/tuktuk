export interface GitApi {
  authorize(token?: string): Promise<void>
  readonly token: string | undefined
  readonly branch: BranchApi
  readonly file: FileApi
  readonly repos: ReposApi
  readonly pullRequest: PullRequestApi
}

export interface ReposApi {
  search(): Promise<Repo[]>
  getById(id: string): Promise<Repo>
}

export interface Repo {
  id: string
}

export interface BranchApi {
  list(): Promise<Branch[]>
  create(branchName: string): Promise<Branch>
}

export type Branch = string

export interface FileApi {
  getAllByDirectory(directoryPath: string): Promise<File[]>
  get(filePath: string): Promise<File>
  update(filePath: string, content: string): Promise<void>
  delete(filePath: string): Promise<void>
}

export interface File {
  path: string
  content: string
}

export interface PullRequestApi {
  create(title: string, description: string): Promise<PullRequest>
}

export interface PullRequest {
  id: string
}
