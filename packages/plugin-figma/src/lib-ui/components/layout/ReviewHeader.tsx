import { Bold, Dropdown, Text, Textbox } from '@create-figma-plugin/ui'
// biome-ignore lint/nursery/noUnusedImports: <explanation>
// biome-ignore lint/correctness/noUnusedVariables: <explanation>
import { Fragment, type JSX, h } from 'preact'

interface Props {
  baseDir: string
  onBaseDirChange: (baseDir: string) => void

  branch: string
  onBranchChange: (branch: string) => void
}

export function ReviewHeader({ baseDir, onBaseDirChange, branch, onBranchChange }: Props) {
  const handleOnBaseDirChange = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    onBaseDirChange(event.currentTarget.value)
  }

  const handleOnBranchChange = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    onBranchChange(event.currentTarget.value)
  }
  const options = [{ value: 'main' }]

  return (
    <Fragment>
      <p class="flex flex-row items-center gap-1">
        <Text>
          <Bold> BaseDir </Bold>
        </Text>
        <Textbox value={baseDir} variant="border" style="width: 12rem;" onChange={handleOnBaseDirChange} />
      </p>
      <p class="flex flex-row items-center gap-1">
        <Text>
          <Bold> Branch </Bold>
        </Text>
        <Dropdown value={branch} options={options} style="width: 9rem;" onChange={handleOnBranchChange} />
      </p>
    </Fragment>
  )
}
