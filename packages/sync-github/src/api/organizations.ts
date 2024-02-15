import type { Organization } from '@tuktuk/core'
import { $fetch } from './api'

interface GitHubOrganization {
  login: string
  id: number
  avatarUrl: string
}

export async function listOrganizations(): Promise<Organization[]> {
  return (await $fetch<GitHubOrganization[]>('/user/orgs')).map(({ login, id, avatarUrl }) => ({ id, name: login, avatarUrl }))
}
