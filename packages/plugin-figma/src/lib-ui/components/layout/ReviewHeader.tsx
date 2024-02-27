import { Bold, Dropdown, Text, Textbox } from '@create-figma-plugin/ui'
import type { Branch, Repository } from '@tuktuk/core'
// biome-ignore lint/nursery/noUnusedImports: <explanation>
// biome-ignore lint/correctness/noUnusedVariables: <explanation>
import { Fragment, type JSX, h } from 'preact'
import { useContext, useEffect, useMemo, useState } from 'preact/hooks'
import { GitContext } from '../../contexts'

interface Props {
  repo: Repository

  baseDir: string
  onBaseDirChange: (baseDir: string) => void

  branch: Branch
  onBranchChange: (branch: Branch) => void
}

export function ReviewHeader({ baseDir, onBaseDirChange, branch, onBranchChange, repo }: Props) {
  const gitApi = useContext(GitContext)

  const [branches, setBranches] = useState<Branch[]>([branch])

  useEffect(() => {
    gitApi.branch.list(repo).then(setBranches)
  }, [])

  const options = useMemo(() => {
    return branches.map((branch) => ({ value: branch.name }))
  }, [branches])

  const handleOnBaseDirChange = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    onBaseDirChange(event.currentTarget.value)
  }

  const handleOnBranchChange = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    const foundBranch = branches.find((b) => b.name === event.currentTarget.value)
    if (!foundBranch) {
      return
    }
    onBranchChange(foundBranch)
  }

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
        <Dropdown value={branch.name} options={options} style="width: 9rem;" onChange={handleOnBranchChange} />
      </p>
    </Fragment>
  )
}
