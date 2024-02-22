import { Bold, Button, Container, Dropdown, Text, VerticalSpace } from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import type { Organization, Repository, User } from '@tuktuk/core'
// biome-ignore lint/nursery/noUnusedImports: <explanation>
// biome-ignore lint/correctness/noUnusedVariables: <explanation>
import { type JSX, h } from 'preact'
import { useContext, useEffect, useMemo, useState } from 'preact/hooks'
import { EventName, type ResizeWindowHandler } from '../../types'
import { SearchTextbox } from '../components'
import { GitContext } from '../contexts'

const PAGE_HEIGHT = 600
const PAGE_WIDTH = 400

type NotNil<T> = T extends null | undefined ? never : T

interface Props {
  onSelectedRepo: (repo: Repository) => void
  onSignOut: () => void
}

export function SelectRepo({ onSelectedRepo }: Props) {
  const gitApi = useContext(GitContext)

  emit<ResizeWindowHandler>(EventName.ResizeWindow, { height: PAGE_HEIGHT, width: PAGE_WIDTH })

  const [user, setUser] = useState<User | undefined>()

  const [orgs, setOrgs] = useState<Organization[]>([])

  const [selectedOrg, setSelectedOrg] = useState<User | Organization | null>(null)

  const orgOptions = useMemo<(User | Organization)[]>(
    () => [user, ...orgs].filter((v): v is NotNil<typeof v> => !!v),
    [user, orgs],
  )

  useEffect(() => {
    ;(async () => {
      const [user, orgs] = await Promise.all([gitApi.user.getCurrent(), gitApi.org.list()])
      setUser(user)
      setSelectedOrg(user)
      setOrgs(orgs)
    })()
  }, [])

  const handleSelectOrg = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    setSelectedOrg(orgOptions.find((org) => org.name === event.currentTarget.value) ?? null)
    setSelectedRepo(null)
    setSearchText('')
  }

  const [repos, setRepos] = useState<Repository[]>([])

  useEffect(() => {
    ;(async () => {
      if (selectedOrg === null) {
        return
      }

      if (user && selectedOrg.name === user.name) {
        const userRepos = await gitApi.repos.listByUser(user)
        setRepos(userRepos)
        return
      }

      const userRepos = await gitApi.repos.listByOrganization(selectedOrg)
      setRepos(userRepos)
    })()
  }, [selectedOrg])

  const [searchText, setSearchText] = useState('')

  const repoOptions = useMemo(
    () =>
      searchText.length > 0
        ? repos.filter((repo) => repo.permissions.push).filter((repo) => repo.name.includes(searchText))
        : repos,
    [repos, searchText],
  )

  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null)

  const handleInputSearch = (event: Event) => {
    setSearchText((event.target as HTMLInputElement).value)
  }

  const handleSelectRepo = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    setSelectedRepo(repoOptions.find((repo) => repo.fullName === event.currentTarget.value) ?? null)
  }

  const submit = () => {
    if (selectedRepo === null) {
      return
    }
    onSelectedRepo(selectedRepo)
  }

  return (
    <Container space="medium">
      <form onSubmit={submit}>
        <VerticalSpace space="extraLarge" />
        <Text align="center">
          <Bold>Select Repository</Bold>
        </Text>
        <VerticalSpace space="extraLarge" />
        <Text align="left">organization</Text>
        <VerticalSpace space="medium" />
        <Dropdown
          options={orgOptions.map((org) => ({ value: org.name }))}
          onChange={handleSelectOrg}
          value={selectedOrg?.name ?? null}
          variant="border"
        />
        <VerticalSpace space="extraLarge" />
        <Text align="left">repository</Text>
        <VerticalSpace space="medium" />
        <SearchTextbox placeholder="Search for a repository" value={searchText} onInput={handleInputSearch} />
        <VerticalSpace space="medium" />
        <Dropdown
          options={repoOptions.map((repo) => ({ value: repo.fullName }))}
          onChange={handleSelectRepo}
          value={selectedRepo?.fullName ?? null}
          variant="border"
        />
        <VerticalSpace space="extraLarge" />
        <Button fullWidth={true} type="submit" disabled={selectedRepo === null}>
          OK
        </Button>
      </form>
    </Container>
  )
}
