type EncodingType = 'base64' | 'raw' | string

export function encode(content: string, encoding: EncodingType): string {
  if (encoding === 'base64') {
    // FIXME: unescape function is deprecated
    return btoa(unescape(encodeURIComponent(content)))
  }

  if (encoding === 'raw') {
    return content
  }

  throw new Error(`Unsupported encoding: ${encoding}`)
}

export function decode(buffer: string, encoding: EncodingType): string {
  if (encoding === 'base64') {
    // FIXME: escape function is deprecated
    return decodeURIComponent(escape(atob(buffer)))
  }

  if (encoding === 'raw') {
    return buffer
  }

  throw new Error(`Unsupported encoding: ${encoding}`)
}
