import { Bold, Button, Container, Link, Text, Textbox, VerticalSpace } from '@create-figma-plugin/ui'
import { emit, on } from '@create-figma-plugin/utilities'
// biome-ignore lint/nursery/noUnusedImports: <explanation>
// biome-ignore lint/correctness/noUnusedVariables: <explanation>
import { h } from 'preact'
import { useContext, useState } from 'preact/hooks'
import {
  type CacheGitTokenHandler,
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
  emit<ResizeWindowHandler>(EventName.ResizeWindow, { height: PAGE_HEIGHT, width: PAGE_WIDTH })

  const gitApi = useContext(GitContext)

  const [pat, setPat] = useState('')

  on<CachedGitTokenHandler>(EventName.CachedGitToken, (token) => {
    if (token === undefined) {
      return
    }

    setPat(token.accessToken)
  })

  emit<RequestCachedGitTokenHandler>(EventName.RequestCachedGitToken, 'github')

  const handleSetPat = (event: Event) => {
    setPat((event.target as HTMLInputElement).value)
  }

  const authorizeGitHubByPat = async () => {
    await gitApi.authorize(pat)
    emit<CacheGitTokenHandler>(EventName.CacheGitToken, { provider: 'github', accessToken: pat })
    onAuthorized()
  }

  // FIXME: We need to find a way to authenticate as a GitHub oauth app
  // const authorizeGitHub = async () => {
  //   await gitApi.authorize()
  //   onAuthorized()
  // }

  return (
    <Container space="medium">
      <VerticalSpace space="extraLarge" />
      <Text align="center">
        <Bold>Login</Bold>
      </Text>
      <VerticalSpace space="extraLarge" />
      {/**
       * Currently, Figma plugin cannot authenticate as a GitHub oauth app
       *
       * Reason:
       * - Google authentication requires window.origin
       * - The iframe of the Figma Plugin has a null window.origin (because the iframe src contains the source code in base64)
       * - When authenticating with a GitHub App, you need to set up a server such as a BFF, but currently we don't have the resources to do that.
       *
       * FIXME: We need to find a way to authenticate as a GitHub oauth app
       * <Button fullWidth={true} onClick={authorizeGitHub}>
       * Login with GitHub
       * </Button>
       * <VerticalSpace space="extraLarge" />
       * <Divider />
       */}
      <VerticalSpace space="extraLarge" />
      <form onSubmit={authorizeGitHubByPat}>
        <Text align="left">GitHub Personal Access Token</Text>
        <VerticalSpace space="medium" />
        <Textbox
          name="pat"
          password={true}
          placeholder="Enter your Personal Access Token"
          variant="border"
          value={pat}
          onChange={handleSetPat}
        />
        <VerticalSpace space="small" />
        <Text align="right">
          <Link href="https://github.com/settings/tokens?type=beta" target="blank" rel="noopener noreferrer">
            Create a new token in GitHub
            {/** TODO: add Icon here */}
          </Link>
        </Text>
        <VerticalSpace space="medium" />
        <Button fullWidth={true} disabled={pat.length <= 0} type="submit">
          Login with Personal Access Token
        </Button>
      </form>
    </Container>
  )
}
