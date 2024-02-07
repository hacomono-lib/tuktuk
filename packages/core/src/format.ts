

export interface Format<T> {
  format: (input: TokenContext) => Result<T>
}

export interface TokenContext {
  __type: any
}

export interface Result<T> {
  __type: T
}
