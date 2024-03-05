import { describe, expect, it } from 'vitest'
// biome-ignore lint/nursery/useImportRestrictions: <explanation>
import { decode, encode } from '../src/encode'

const content = 'Hello, World!'
const encoded = btoa(unescape(encodeURIComponent(content)))

describe('encode', () => {
  it('should encode content to base64', () => {
    expect(encode(content, 'base64')).toBe(encoded)
  })

  it('should encode content to raw', () => {
    expect(encode(content, 'raw')).toBe(content)
  })

  it('should throw error for unsupported encoding', () => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    expect(() => encode(content, 'unsupported' as any)).toThrow('Unsupported encoding: unsupported')
  })
})

describe('decode', () => {
  it('should decode base64 to content', () => {
    expect(decode(encoded, 'base64')).toBe(content)
  })

  it('should decode raw to content', () => {
    expect(decode(content, 'raw')).toBe(content)
  })

  it('should throw error for unsupported encoding', () => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    expect(() => decode(content, 'unsupported' as any)).toThrow('Unsupported encoding: unsupported')
  })
})
