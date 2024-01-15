import { createContext } from './context'
import type { Config, ResultSet } from './type'

export async function run(config: Config): Promise<ResultSet[]> {
  const context = await createContext(config)

  const results = (await Promise.all(context.pipelines.map(async ({ fetch, transform }) => {
    const result = await fetch(context.config)

    return transform(result, context.config)
  }))).flat()

  await Promise.all(results.map(write))

  return results
}

async function write(results: ResultSet): Promise<void> {
  console.log(results)
}
