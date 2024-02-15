import type { User } from '@tuktuk/core'
import { $fetch } from './api'

interface GitHubUser {
  name: string
  id: number
  avatarUrl: string
}

export async function getCurrentUser(): Promise<User> {
  const { name, id, avatarUrl } = await $fetch<GitHubUser>('/user')
  return { id, name, avatarUrl }
}
