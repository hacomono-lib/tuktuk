import { Button, Divider, MiddleAlign, Text, Textbox, VerticalSpace } from '@create-figma-plugin/ui'
import { emit, on } from '@create-figma-plugin/utilities'
// biome-ignore lint/nursery/noUnusedImports: <explanation>
// biome-ignore lint/correctness/noUnusedVariables: <explanation>
import { h } from 'preact'
import { useContext, useState } from 'preact/hooks'
import {
  type CachedGitTokenHandler,
  EventName,
  type RequestCachedGitTokenHandler,
  type ResizeWindowHandler,
} from '../../types'
import { GitContext } from '../contexts'

const PAGE_HEIGHT = 600
const PAGE_WIDTH = 300

interface Props {
  onAuthorized: () => void
}

export function Unauthorized({ onAuthorized }: Props) {
  const gitApi = useContext(GitContext)

  emit<ResizeWindowHandler>(EventName.ResizeWindow, { height: PAGE_HEIGHT, width: PAGE_WIDTH })

  emit<RequestCachedGitTokenHandler>(EventName.RequestCachedGitToken, 'github')

  const [pat, setPat] = useState('')

  on<CachedGitTokenHandler>(EventName.CachedGitToken, (token) => {
    if (token === undefined) {
      return
    }

    setPat(token.accessToken)
  })

  const handleSetPat = (event: Event) => {
    setPat((event.target as HTMLInputElement).value)
  }

  const authorizeGitHubByPat = async () => {
    await gitApi.authorize(pat)
    onAuthorized()
  }

  const authorizeGitHub = async () => {
    await gitApi.authorize()
    onAuthorized()
  }

  return (
    <MiddleAlign>
      <Text align="center" size={128}>
        Tuktuk
      </Text>
      <VerticalSpace space="extraLarge" />
      <Button fullWidth={true} onClick={authorizeGitHub} disabled={true}>
        Login with GitHub (comming soon)
      </Button>
      <VerticalSpace space="extraLarge" />
      <Divider />
      <VerticalSpace space="extraLarge" />
      <Text align="left">GitHub Personal Access Token</Text>
      <VerticalSpace space="medium" />
      <Textbox placeholder="Enter your PAT" value={pat} onChange={handleSetPat} />
      <VerticalSpace space="medium" />
      <Button fullWidth={true} onClick={authorizeGitHubByPat} disabled={pat.length <= 0}>
        Login with Personal Access Token
      </Button>
    </MiddleAlign>
  )
}
