import { Bold, Container, SelectableItem, Text, VerticalSpace } from '@create-figma-plugin/ui'
// biome-ignore lint/nursery/noUnusedImports: <explanation>
// biome-ignore lint/correctness/noUnusedVariables: <explanation>
import { Fragment, type JSX, h } from 'preact'
import { useMemo } from 'preact/hooks'
import type { DesignTokenDiff } from '../../../types'

export interface FileListProps {
  files: DesignTokenDiff[]
  selected: DesignTokenDiff
  onSelectFile(file: DesignTokenDiff): void
}

export function FileList({ files, selected, onSelectFile }: FileListProps) {
  console.log(files)
  console.log(selected)
  return (
    <Fragment>
      <VerticalSpace space="medium" />
      <Container space="large">
        <Text>
          <Bold>Variable Collection</Bold>
        </Text>
      </Container>
      <VerticalSpace space="medium" />
      {files.map((file) => (
        <FileSelector
          file={file}
          key={file.name}
          onSelect={() => onSelectFile(file)}
          selected={selected.name === file.name}
        />
      ))}
    </Fragment>
  )
}

interface FileSelectorProps {
  file: DesignTokenDiff
  selected: boolean
  onSelect(): void
}

function FileSelector({ file, selected, onSelect }: FileSelectorProps) {
  const handleChange = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    // event.preventDefault()
    const newValue = event.currentTarget.checked
    if (newValue && !selected) {
      onSelect()
    }
  }

  const shouldBeRemoved = useMemo(() => !file.figma && file.git, [file])

  const shouldBeCreated = useMemo(() => file.figma && !file.git, [file])

  const shouldBeUpdated = useMemo(() => file.figma && file.git && hasDiff(file), [file])

  return (
    <SelectableItem value={selected} onChange={handleChange}>
      {file.name}
    </SelectableItem>
  )
}

function hasDiff(diff: DesignTokenDiff): boolean {
  return true
}
