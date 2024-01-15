export interface Config {
  plugins?: Array<string | Plugin>
  pipelines: Pipeline[]
}

export interface Pipeline {
  fetch: FetchConfig | Fetcher
  transform: TransformConfig | Transformer
}

// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
export  interface FetchConfig { }

export interface TransformConfig {
  /**
   * @default 'dist'
   */
  dist?: string
}

export function defineConfig<C extends Config>(config: C): C {
  return config
}

export interface Context {
  config: Config
  pipelines: PipelineContext[]
}

interface PipelineContext {
  fetch: Fetcher,
  transform: Transformer,
}

type Primitive = string | number

export interface Value {
  type: string
  name: string
  value: Primitive
}

export interface FetchResult {
  values: Value[]
}

export interface Result {
  filename: string
  data: unknown
}

export type ResultSet = Result | Result[]

export type Fetcher = (config: Config) => FetchResult | Promise<FetchResult>

export function defineFetcher<F extends Fetcher>(fetcher: F): F {
  return fetcher
}

export type Transformer = (fetchResult: FetchResult, config: Config) => ResultSet | Promise<ResultSet[]>

export function defineTransformer<T extends Transformer>(transformer: T): T {
  return transformer
}

export interface Plugin {
  name: string
  type: 'fetch' | 'transform'
  fetch?: Fetcher
  transform?: Transformer
}

export function definePlugin<P extends Plugin>(plugin: P): P {
  return plugin
}
