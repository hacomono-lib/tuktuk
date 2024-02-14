import { Button, Dropdown, MiddleAlign, SearchTextbox, Text, VerticalSpace } from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
// biome-ignore lint/nursery/noUnusedImports: <explanation>
// biome-ignore lint/correctness/noUnusedVariables: <explanation>
import { type JSX, h } from 'preact'
import { useMemo, useState } from 'preact/hooks'
import { EventName, type ResizeWindowHandler } from '../../types'

const PAGE_HEIGHT = 600
const PAGE_WIDTH = 300

interface Props {
  onSelectedRepo: (repo: string) => void
  onSignOut: () => void
}

export function SelectRepo({ onSelectedRepo }: Props) {
  // const gitApi = useContext(GitContext)

  emit<ResizeWindowHandler>(EventName.ResizeWindow, { height: PAGE_HEIGHT, width: PAGE_WIDTH })

  const [options, setOptions] = useState<string[]>([])

  const [loading, setLoading] = useState(false)

  const [searchText, setSearchText] = useState('')

  const [selected, setSelectedRepo] = useState<string | null>(null)

  const findRepos = async (searchWord?: string) => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setOptions(['org/repo1', 'org/repo2', 'org/repo3'])
    setLoading(false)
  }

  const handleInputSearch = (event: Event) => {
    setSearchText((event.target as HTMLInputElement).value)
    findRepos(searchText)
  }

  const handleChange = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    setSelectedRepo(event.currentTarget.value)
  }

  const submit = () => {
    if (selected === null) {
      return
    }
    onSelectedRepo(selected)
  }

  const canSubmit = useMemo(() => !loading && selected !== null, [loading, selected])

  findRepos()

  return (
    <MiddleAlign>
      <Text align="center" size={128}>
        Select Repos
      </Text>
      <VerticalSpace space="extraLarge" />
      <SearchTextbox value={searchText} onInput={handleInputSearch} />
      <VerticalSpace space="medium" />
      {loading ? (
        <Text align="center">Loading...</Text>
      ) : (
        <Dropdown
          options={options.map((value) => ({ value }))}
          onChange={handleChange}
          value={selected}
          variant="underline"
        />
      )}
      <VerticalSpace space="extraLarge" />
      <Button fullWidth={true} onClick={submit} disabled={canSubmit}>
        Select Repo
      </Button>
    </MiddleAlign>
  )
}
