import type {
  Config,
  ConfigBase,
  Context,
  FetchConfig,
  Fetcher,
  FetcherPlugin,
  PipelineContext,
  Plugin,
  Transformer,
  TransformerPlugin
} from './type'

export async function createContext(config: Config): Promise<Context> {
  const { fetchers, transformers } = await loadPlugins(config)

  const pipelines = config.pipelines.map(({ fetch, transform }) => {
    const { fetcher, fetchConfig } = findFetcher(fetch, fetchers)
    const { transformer, transformConfig } = findTransformer(transform, transformers)

    return {
      fetch: fetcher,
      fetchConfig: fetchConfig as ConfigBase,
      transform: transformer,
      transformConfig: transformConfig as ConfigBase,
    } satisfies PipelineContext
  })

  return freeze({
    config,
    pipelines,
  })
}

function findFetcher(
  config: FetchConfig | Fetcher,
  fetchers: Map<string, Fetcher>,
): { fetcher: Fetcher; fetchConfig: FetchConfig } {
  if (typeof config === 'function') {
    return { fetcher: config as Fetcher, fetchConfig: {} }
  }

  const keys = Array.from(fetchers.keys())
  for (const key of keys) {
    if (key in config) {
      const fetch = fetchers.get(key)

      if (!fetch) {
        continue
      }

      return {
        fetcher: fetch,
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        fetchConfig: (config as any)[key],
      }
    }
  }

  throw new Error('Fetcher not found')
}

function findTransformer(
  config: FetchConfig,
  transformers: Map<string, Transformer>,
): { transformer: Transformer; transformConfig: FetchConfig } {
  if (typeof config === 'function') {
    return { transformer: config as Transformer, transformConfig: {} }
  }

  const keys = Array.from(transformers.keys())
  for (const key of keys) {
    if (key in config) {
      const transform = transformers.get(key)

      if (!transform) {
        continue
      }

      return {
        transformer: transform,
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        transformConfig: (config as any)[key],
      }
    }
  }

  throw new Error('Transformer not found')
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

    if (isFetcherPlugin(p)) {
      fetchers.set(p.name, p.fetch)
    }

    if (isTransformerPlugin(p)) {
      transformers.set(p.name, p.transform)
    }
  }

  return { fetchers, transformers }
}

async function loadPlugin(name: string): Promise<Plugin> {
  const { default: maybePlugin } = await import(name)

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

function isFetcherPlugin(target: Plugin): target is FetcherPlugin {
  return target.type === 'fetch' && 'fetch' in target
}

function isTransformerPlugin(target: Plugin): target is TransformerPlugin {
  return target.type === 'transform' && 'transform' in target
}
