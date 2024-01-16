import { createContext } from './context'
import type { Config, ResultSet } from './type'

export async function run(config: Config): Promise<ResultSet[]> {
  const context = await createContext(config)

  const results = (await Promise.all(context.pipelines.map(async ({ fetch, fetchConfig, transform, transformConfig }) => {
    const result = await fetch(fetchConfig)

    return transform(result, transformConfig)
  }))).flat()

  await Promise.all(results.map(write))

  return results
}

async function write(results: ResultSet): Promise<void> {
  console.log(results)
}
