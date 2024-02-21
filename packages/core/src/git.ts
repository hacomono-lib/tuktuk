export interface GitApi {
  authorize(token?: string): Promise<void>
  readonly user: UserApi
  readonly org: OrganizationApi
  readonly branch: BranchApi
  readonly file: FileApi
  readonly repos: ReposApi
  readonly pullRequest: PullRequestApi
}

export interface ReposApi {
  listByOrganization(organizationOrUser: Organization | User): Promise<Repository[]>
  listByUser(user: User): Promise<Repository[]>
}

export interface Repository {
  id: string | number
  name: string
  fullName: string
  private: boolean
  defaultBranch: Branch

  /**
   * @example "https://api.github.com/repos/octocat/Hello-World"
   */
  url: string

  /**
   * @example "https://github.com/octocat/Hello-World"
   */
  htmlUrl: string

  /**
   * @example "git:github.com/octocat/Hello-World.git"
   */
  gitUrl: string

  /**
   * @example "https://api.github.com/repos/octocat/Hello-World/contents/{+path}"
   */
  contentsUrl: string

  permissions: {
    admin?: boolean
    maintain?: boolean
    push?: boolean
    pull?: boolean
    triage?: boolean
  }

  owner: {
    name: string
    type: 'User' | 'Organization'
  }
}

export interface BranchApi {
  list(repo: Pick<Repository, 'owner' | 'name'>): Promise<Branch[]>
  get(repo: Pick<Repository, 'owner' | 'name'>, branchName: string): Promise<Branch>
  create(repo: Pick<Repository, 'owner' | 'name'>, baseBranch: string, branchName: string): Promise<Branch>
}

export interface Branch {
  name: string
  protected?: boolean
}

export interface FileApi {
  listTokenFiles(repo: Repository, branch: string, dir: string): Promise<GitDesignTokenFile[]>
  getTokenFile(repo: Repository, branch: string, filepath: string): Promise<GitDesignTokenFile | null>

  upsert(repo: Repository, branch: string, filename: string, content: string): Promise<void>
  delete(repo: Repository, branch: string, filename: string): Promise<void>
}

export interface GitDesignTokenFile {
  filename: string
  name: string
  contents?: string
}

export interface PullRequestApi {
  create(title: string, description: string): Promise<PullRequest>
}

export interface PullRequest {
  id: string
}

export interface Organization {
  id: number | string
  name: string
  avatarUrl?: string
}

export interface OrganizationApi {
  list(): Promise<Organization[]>
}

export interface User {
  id: number | string
  name: string
  avatarUrl?: string
}

export interface UserApi {
  getCurrent(): Promise<User>
}
