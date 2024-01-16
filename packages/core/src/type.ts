export interface Config {
  plugins?: Array<string | Plugin>
  pipelines: Pipeline[]
}

export interface Pipeline {
  fetch: FetchConfig | Fetcher
  transform: TransformConfig | Transformer
}

export type ConfigBase = object & {}

// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
export interface FetchConfig {}

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

export interface PipelineContext<Fc extends ConfigBase = ConfigBase, Tc extends ConfigBase = ConfigBase> {
  fetch: Fetcher<Fc>
  fetchConfig: Fc
  transform: Transformer<Tc>
  transformConfig: Tc
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

export type Fetcher<C extends ConfigBase = ConfigBase> = (config: C) => FetchResult | Promise<FetchResult>

export function defineFetcher<F extends Fetcher>(fetcher: F): F {
  return fetcher
}

export type Transformer<C extends ConfigBase = ConfigBase> = (
  fetchResult: FetchResult,
  config: C,
) => ResultSet | Promise<ResultSet[]>

export function defineTransformer<T extends Transformer>(transformer: T): T {
  return transformer
}

export type Plugin = FetcherPlugin | TransformerPlugin

export interface FetcherPlugin<C extends ConfigBase = ConfigBase> {
  name: string
  type: 'fetch'
  fetch: Fetcher<C>
  transform?: never
}

export interface TransformerPlugin<C extends ConfigBase = ConfigBase> {
  name: string
  type: 'transform'
  fetch?: never
  transform: Transformer<C>
}

export function definePlugin<C extends ConfigBase, P extends FetcherPlugin<C> = FetcherPlugin<C>>(plugin: P): P

export function definePlugin<C extends ConfigBase, P extends TransformerPlugin<C> = TransformerPlugin<C>>(plugin: P): P

export function definePlugin(plugin: Plugin): Plugin {
  return plugin
}
