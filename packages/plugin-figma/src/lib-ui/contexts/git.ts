import type { GitApi } from '@tuktuk/core'
import { createContext } from 'preact'

// Initialize the context on ui root component.
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const GitContext = createContext<GitApi>(null as any)
