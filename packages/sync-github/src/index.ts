import type { GitApi } from '@tuktuk/core'
import { $fetch, getCurrentUser, listOrganizations, listReposByOrganization, listReposByUser } from './api'

export function createApi(): GitApi {
  return new GitApiImpl()
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
    console.log('set token', token)
    this.#token = token
    $fetch.headers = {
      // biome-ignore lint/style/useNamingConvention: <explanation>
      Authorization: `token ${token}`
    }

    console.log('header', $fetch.headers)
  }

  signout() {
    this.#token = undefined
    $fetch.headers = undefined
  }

  get token() {
    return this.#token
  }

  readonly branch = {

  } as any

  readonly file = {

  } as any


  readonly pullRequest = {

  } as any

  readonly repos = {
    listByUser: listReposByUser,
    listByOrganization: listReposByOrganization
  }

  readonly user = {
    getCurrent: getCurrentUser
  }

  readonly org = {
    list: listOrganizations
  }
}
