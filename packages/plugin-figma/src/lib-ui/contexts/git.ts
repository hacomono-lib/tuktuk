import type { GitApi } from '@tuktuk/types'
import { createContext } from 'preact'

// Initialize the context on ui root component.
export const GitContext = createContext<GitApi>(null as any)
