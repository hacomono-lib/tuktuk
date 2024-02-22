import { Bold, Button, Container, Modal, Text, Textbox, TextboxMultiline, VerticalSpace } from '@create-figma-plugin/ui'
import type { Branch, PullRequest, Repository } from '@tuktuk/core'
// biome-ignore lint/nursery/noUnusedImports: <explanation>
// biome-ignore lint/correctness/noUnusedVariables: <explanation>
import { type JSX, h } from 'preact'
import { useContext, useMemo, useState } from 'preact/hooks'
import type { DesignTokenDiff } from '../../../types'
import { GitContext } from '../../contexts'

const MODAL_HEIGHT = 600

const MODAL_WIDTH = 800

interface Props {
  open: boolean
  repo: Repository
  diffs: DesignTokenDiff[]
  baseBranch: Branch
  baseDir: string
  onClose: () => void
  onCreatedPullRequest: (pullRequest: PullRequest) => void
}

export function CreatePrModal({ open, repo, baseBranch, baseDir, diffs, onClose, onCreatedPullRequest }: Props) {
  const gitApi = useContext(GitContext)

  const [headBranchName, setHeadBranchName] = useState<string>(
    repo.defaultBranch.name === baseBranch.name ? '' : baseBranch.name,
  )

  const [title, setTitle] = useState<string>('Update: Design Token')

  const [description, setDescription] = useState<string>('')

  const canSubmit = useMemo(() => {
    return title.length > 0 && headBranchName.length > 0 && baseBranch.name !== headBranchName
  }, [title, headBranchName])

  const [submitting, setSubmitting] = useState(false)

  const handleChangedBaseBranch = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    setHeadBranchName(event.currentTarget.value)
  }

  const handleChangeTitle = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    setTitle(event.currentTarget.value)
  }

  const handleChangeDescription = (event: JSX.TargetedEvent<HTMLTextAreaElement>) => {
    setDescription(event.currentTarget.value)
  }

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation> FIXME: 実力不足のため
  const handleSubmit = async (event: JSX.TargetedEvent<HTMLFormElement>) => {
    event.preventDefault()

    setSubmitting(true)

    const currentBranch = await (async () => {
      try {
        const found = await gitApi.branch.get(repo, headBranchName)
        if (found) {
          return found
        }
      } catch (e) {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        if ((e as any).status !== 404) {
          throw e
        }
      }

      return gitApi.branch.create(repo, baseBranch, headBranchName)
    })()

    for (const { figma, git } of diffs) {
      if (figma && !git) {
        await gitApi.file.create(repo, currentBranch, [baseDir, `${figma.name}.json`].join('/'), figma.contents ?? '')
        continue
      }

      if (figma && git) {
        await gitApi.file.update(repo, currentBranch, git, figma.contents ?? '')
        continue
      }

      if (!figma && git) {
        await gitApi.file.delete(repo, currentBranch, git)
      }
    }

    const pullRequest = await gitApi.pullRequest.create(repo, currentBranch, baseBranch, {
      title,
      description,
    })

    setSubmitting(false)
    onCreatedPullRequest(pullRequest)
  }

  return (
    <Modal open={open} title="Create Pull Request">
      <form
        class="flex flex-col justify-between"
        style={{ width: `${MODAL_WIDTH}px`, height: `${MODAL_HEIGHT}px` }}
        onSubmit={handleSubmit}
      >
        <Container space="medium">
          <VerticalSpace space="extraLarge" />
          <p>
            <Text>
              <Bold> Branch Name </Bold>
            </Text>
            <VerticalSpace space="medium" />
            <Textbox value={headBranchName} onChange={handleChangedBaseBranch} variant="border" />
          </p>
          <VerticalSpace space="extraLarge" />
          <p>
            <Text>
              <Bold> Base Branch </Bold>
            </Text>
            <VerticalSpace space="medium" />
            <Text>{baseBranch.name}</Text>
          </p>
          <VerticalSpace space="extraLarge" />
          <p>
            <Text>
              <Bold> Title </Bold>
            </Text>
            <VerticalSpace space="medium" />
            <Textbox value={title} onChange={handleChangeTitle} variant="border" />
          </p>
          <VerticalSpace space="extraLarge" />
          <p>
            <Text>
              <Bold> Description </Bold>
            </Text>
            <VerticalSpace space="medium" />
            <TextboxMultiline value={description} onChange={handleChangeDescription} variant="border" />
          </p>
          <VerticalSpace space="extraLarge" />
        </Container>
        <Container space="medium">
          <p class="flex flex-row justify-between">
            <Button type="button" secondary={true} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting} disabled={!canSubmit}>
              Create Pull Request
            </Button>
          </p>
        </Container>
      </form>
    </Modal>
  )
}
