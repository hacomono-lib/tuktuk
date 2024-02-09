type NonNull<T> = T extends null | undefined ? never : T

// biome-ignore lint/complexity/noBannedTypes: <explanation>
type FunctionNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T]

type OmitFunctions<T> = Omit<T, FunctionNames<T>>

export type VariableCollection = OmitFunctions<NonNull<ReturnType<typeof figma.variables.getVariableCollectionById>>>

export type Variable = OmitFunctions<NonNull<ReturnType<typeof figma.variables.getVariableById>>>

export type Mode = VariableCollection['modes'][number]

export type Value = Variable['valuesByMode'][string]

export type ResolvedType = Variable['resolvedType']

// biome-ignore lint/style/useNamingConvention: <explanation>
type  RGB = Value & { r: number; g: number; b: number }

// biome-ignore lint/style/useNamingConvention: <explanation>
type  RGBA = Value & { r: number; g: number; b: number; a: number }

export type Color = (RGB | RGBA) & { a?: number }

export function isColor(value: Value): value is Color {
  return (
    typeof value === 'object' && value !== null && !Array.isArray(value) && 'r' in value && 'g' in value && 'b' in value
  )
}

export type VliableAlias = Value & { type: 'VARIABLE_ALIAS'; id: string }

export function isValiableAlias(value: Value): value is VliableAlias {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && value.type === 'VARIABLE_ALIAS'
}
