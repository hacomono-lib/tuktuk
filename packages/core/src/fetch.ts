import defu from 'defu'
import { type $Fetch, $fetch, type FetchOptions } from 'ofetch'
import { camelCase } from 'scule'

function toCamelCase(obj: object | string | number | boolean | null): object | string | number | boolean | null {
  if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      return obj.map(toCamelCase)
    }

    const newObj = {} as Record<string, unknown>

    for (const key in obj) {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      newObj[camelCase(key)] = toCamelCase((obj as any)[key])
    }

    return newObj
  }

  return obj
}

export interface OverridedFetch extends $Fetch {
  headers: Record<string, string> | undefined
}

export function createFetch(options: FetchOptions = {}): OverridedFetch {
  const fetch = $fetch.create(
    defu(options, {
      parseResponse: (responseText: string) => {
        return toCamelCase(JSON.parse(responseText))
      },
      responseType: 'json',
      onRequest(context) {
        console.log('onRequest', context)
      },
      onResponse(context) {
        console.log('onResponse', context)
      },
      onResponseError(context) {
        console.log('onResponseError', context)
      },
    } satisfies FetchOptions),
  )

  class WrappedFetch extends Function {
    headers: Record<string, string> | undefined

    constructor() {
      super()
      // biome-ignore lint/correctness/noConstructorReturn: <explanation>
      return new Proxy(this, {
        apply(target, _thisArg, argumentsList) {
          return target.#fetch(...(argumentsList as [string, FetchOptions]))
        },
      })
    }

    #fetch(request: string, options?: FetchOptions) {
      const defaultOptions: FetchOptions = {
        headers: this.headers,
      }
      return fetch(request, defu(options ?? {}, defaultOptions))
    }

    get raw() {
      return fetch.raw
    }

    get native() {
      return fetch.native
    }

    get create() {
      return fetch.create
    }
  }

  return new WrappedFetch() as unknown as OverridedFetch
}
