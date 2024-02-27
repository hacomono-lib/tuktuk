import { Bold, Button, Container, Divider, Text, Textbox, VerticalSpace } from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import type { PullRequest } from '@tuktuk/core'
// biome-ignore lint/nursery/noUnusedImports: <explanation>
// biome-ignore lint/correctness/noUnusedVariables: <explanation>
import { h } from 'preact'
import { EventName, type ResizeWindowHandler } from '../../types'

const PAGE_HEIGHT = 600
const PAGE_WIDTH = 400

interface Props {
  pullRequest: PullRequest
  onBack: () => void
  onSignOut: () => void
}

export function Completed({ pullRequest, onBack }: Props) {
  emit<ResizeWindowHandler>(EventName.ResizeWindow, { height: PAGE_HEIGHT, width: PAGE_WIDTH })

  return (
    <Container space="medium">
      <VerticalSpace space="extraLarge" />
      <Text align="center">
        <Bold>Review completed</Bold>
      </Text>
      <VerticalSpace space="extraLarge" />
      <Text>Your design has been successfully delivered to the developers!</Text>
      <Text>Share the URL of this Pull Request with the developers and ask them to review it.</Text>
      <VerticalSpace space="extraLarge" />
      <Textbox class="w-full" value={pullRequest.url} variant="border" />
      <VerticalSpace space="extraLarge" />
      <Divider />
      <VerticalSpace space="extraLarge" />
      <Button onClick={onBack}>Back to review</Button>
    </Container>
  )
}
