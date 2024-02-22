import { Button } from '@create-figma-plugin/ui'
// biome-ignore lint/nursery/noUnusedImports: <explanation>
// biome-ignore lint/correctness/noUnusedVariables: <explanation>
import { Fragment, h } from 'preact'

interface Props {
  onCancel: () => void
  onCreatePullRequest: () => void
}

export function ReviewFooter({ onCancel, onCreatePullRequest }: Props) {
  return (
    <Fragment>
      <p>
        <Button secondary={true} onClick={onCancel}>
          Cancel
        </Button>
      </p>
      <p>
        <Button onClick={onCreatePullRequest}>Create Pull Request</Button>
      </p>
    </Fragment>
  )
}
