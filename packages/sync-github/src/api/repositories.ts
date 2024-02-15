import type { Organization, Repository, User } from '@tuktuk/core'
import { $fetch } from './api'

interface GitHubRepository {
  id: number
  name: string
  fullName: string
  private: boolean
  defaultBranch: string
  url: string
  htmlUrl: string
  gitUrl: string
  contentsUrl: string
  permissions: {
    admin: boolean
    push: boolean
    pull: boolean
  }
}

export async function listReposByOrganization(organization: Organization): Promise<Repository[]> {
  return await $fetch<GitHubRepository[]>(`/orgs/${organization.name}/repos`)
}

export async function listReposByUser(user: User): Promise<Repository[]> {
  return await $fetch<GitHubRepository[]>(`/users/${user.name}/repos`)
}
