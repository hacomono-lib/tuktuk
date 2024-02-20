type EncodingType = 'base64' | 'raw' | string

export function encode(content: string, encoding: EncodingType): string {
  if (encoding === 'base64') {
    return btoa(content)
  }

  if (encoding === 'raw') {
    return content
  }

  throw new Error(`Unsupported encoding: ${encoding}`)
}

export function decode(buffer: string, encoding: EncodingType): string {
  if (encoding === 'base64') {
    return atob(buffer)
  }

  if (encoding === 'raw') {
    return buffer
  }

  throw new Error(`Unsupported encoding: ${encoding}`)
}
