import type { Config, Context, FetchConfig, Fetcher, Plugin, Transformer } from './type'

export async function createContext(config: Config): Promise<Context> {
  const { fetchers, transformers } = await loadPlugins(config)

  const pipelines = config.pipelines.map(({ fetch, transform }) => {
    const fixedFetch = typeof fetch === 'function' ? fetch as Fetcher : findFetcher(fetch, fetchers)

    if (!fixedFetch) {
      throw new Error('Fetcher not found')
    }

    const fixedTransform = typeof transform === 'function' ? transform as Transformer : findTransformer(transform, transformers)

    if (!fixedTransform) {
      throw new Error('Transformer not found')
    }

    return {
      fetch: fixedFetch,
      transform: fixedTransform,
    }
  })

  return freeze({
    config,
    pipelines,
  })
}

function findFetcher(config: FetchConfig, fetchers: Map<string, Fetcher>): Fetcher | undefined {
  const keys = Array.from(fetchers.keys())
  for (const key of keys) {
    if (key in config) {
      return fetchers.get(key)
    }
  }
  return undefined
}

function findTransformer(config: FetchConfig, transformers: Map<string, Transformer>): Transformer | undefined {
  const keys = Array.from(transformers.keys())
  for (const key of keys) {
    if (key in config) {
      return transformers.get(key)
    }
  }
  return undefined
}

function freeze<T>(target: T): T {
  Object.freeze(target)
  return target
}

interface LoadPluginsResult {
  fetchers: Map<string, Fetcher>
  transformers: Map<string, Transformer>
}

async function loadPlugins({ plugins = [] }: Config): Promise<LoadPluginsResult> {
  const fetchers = new Map<string, Fetcher>()
  const transformers = new Map<string, Transformer>()

  for (const pluginName of plugins) {
    const p = await (() => {
      if (typeof pluginName === 'string') {
        return loadPlugin(pluginName)
      }

      return pluginName
    })()

    if (p.type === 'fetch' && p.fetch) {
      fetchers.set(p.name, p.fetch)
    }

    if (p.type === 'transform' && p.transform) {
      transformers.set(p.name, p.transform)
    }
  }

  return { fetchers, transformers }
}

async function loadPlugin(name: string): Promise<Plugin> {
  const { default: maybePlugin }= await import(name)

  if (!isPlugin(maybePlugin)) {
    throw new Error(`Plugin ${name} is not valid`)
  }
  return maybePlugin
}

function isPlugin(target: unknown): target is Plugin {
  return (
    typeof target === 'object' &&
    target !== null &&
    'name' in target &&
    'type' in target &&
    ((target.type === 'fetch' && 'fetch' in target) || (target.type === 'transform' && 'transform' in target))
  )
}
