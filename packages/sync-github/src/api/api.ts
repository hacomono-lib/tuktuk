import { $fetch } from 'ofetch'

const BASE_URL = 'https://api.github.com'

const GITHUB_CLIENT_ID = 'Iv1.99ee193a752ad1c4'

const SCOPE = 'repo'

export interface VerificationUrl {
  device_code: string
  user_code: string
  verification_uri: string
  expires_in: number
  interval: number
}

export async function fetchVerificationUrl(): Promise<VerificationUrl> {
  const url = `${BASE_URL}/login/device/code?${new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    scope: SCOPE,
  })}`

  const response = await $fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  })

  return response
}
