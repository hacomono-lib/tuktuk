import { Bold, Button, Container, Divider, Text, Textbox, VerticalSpace } from '@create-figma-plugin/ui'
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
const PAGE_WIDTH = 400

interface Props {
  onAuthorized: () => void
}

export function Unauthorized({ onAuthorized }: Props) {
  const gitApi = useContext(GitContext)

  emit<ResizeWindowHandler>(EventName.ResizeWindow, { height: PAGE_HEIGHT, width: PAGE_WIDTH })

  emit<RequestCachedGitTokenHandler>(EventName.RequestCachedGitToken, 'github')

  // FIXME: remove this PAT
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
    <Container space="medium">
      <VerticalSpace space="extraLarge" />
      <Text align="center">
        <Bold>Login</Bold>
      </Text>
      <VerticalSpace space="extraLarge" />
      <Button fullWidth={true} onClick={authorizeGitHub} disabled={true}>
        Login with GitHub (comming soon)
      </Button>
      <VerticalSpace space="extraLarge" />
      <Divider />
      <VerticalSpace space="extraLarge" />
      <form onSubmit={authorizeGitHubByPat}>
        <Text align="left">GitHub Personal Access Token</Text>
        <VerticalSpace space="medium" />
        <Textbox name="pat" placeholder="Enter your PAT" variant="border" value={pat} onChange={handleSetPat} />
        <VerticalSpace space="medium" />
        <Button fullWidth={true} disabled={pat.length <= 0} type="submit">
          Login with Personal Access Token
        </Button>
      </form>
    </Container>
  )
}
