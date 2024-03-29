import type { Color as TokenColor, DesignToken, Value as TokenValue } from '@tuktuk/core'
import { unfold } from 'json-origami'
import type { VariableSet } from '../lib-main'
import {
  type Color,
  type DesignTokenFile,
  type Mode,
  type ResolvedType,
  type Value,
  type Variable,
  isColor,
  isValiableAlias,
} from '../types'

type NonNull<T> = T extends null | undefined ? never : T

export function toTokenFiles(variables: VariableSet[]): DesignTokenFile[] {
  const allVariables = variables.flatMap(({ variables }) => variables)

  return variables.flatMap(({ collection }): DesignTokenFile[] => {
    const modes = collection.modes

    if (modes.length === 1) {
      return [
        {
          name: collection.name,
          filename: `${collection.name}.json`,
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          contents: JSON.stringify(toToken({ collection, variables: allVariables, mode: modes[0]! }), null, 2),
        },
      ]
    }

    return modes.map((mode) => ({
      name: `${collection.name}.${mode.name}`,
      filename: `${collection.name}.${mode.name}.json`,
      tokens: toToken({ collection, variables: allVariables, mode }),
    }))
  })
}

function toToken({ collection, variables, mode }: VariableSet & { mode: Mode }): DesignToken {
  const kv = collection.variableIds
    .map((id) => variables.find((v) => v.id === id))
    .filter((c): c is NonNull<typeof c> => !!c)
    .map(({ name, valuesByMode, resolvedType, description, id }): [string, TokenValue] | null => {
      const value = valuesByMode[mode.modeId]
      if (!value) {
        return null
      }

      const token = valueToToken(value, resolvedType, variables)
      if (!token) {
        return null
      }

      if (description) {
        token.$description = description
      }

      token.$extensions = {
        'figma.variableId': id,
        'figma.variableName': name,
        'figma.resolvedType': resolvedType,
      }

      return [name.replaceAll('/', '.'), token]
    })
    .filter((c): c is NonNull<typeof c> => !!c)
    .reduce(
      (acc, [key, value]): Record<string, TokenValue> => {
        acc[key] = value
        return acc
      },
      {} as Record<string, TokenValue>,
    )

  const tokens = unfold(kv) as DesignToken
  tokens.$extensions = {
    'figma.collectionId': collection.id,
    'figma.collectionName': collection.name,
    'figma.modeId': mode.modeId,
    'figma.modeName': mode.name,
  }
  return tokens
}

function valueToToken(value: Value, resolvedType: ResolvedType, variables: Variable[]): TokenValue | null {
  if (value === undefined || ['boolean', 'string'].includes(resolvedType.toLowerCase())) {
    return null
  }
  const $type = resolvedType.toLowerCase() === 'color' ? 'color' : 'number'

  if (isValiableAlias(value)) {
    const targetVariable = variables.find((v) => v.id === value.id)
    if (!targetVariable) {
      return null
    }
    const path = `{${targetVariable.name.replaceAll('/', '.')}}` as const
    return {
      $type,
      $value: path,
    }
  }

  if ($type === 'color') {
    if (!isColor(value)) {
      return null
    }
    return {
      $type,
      $value: rgbToHex(value),
    }
  }

  if (typeof value !== 'number') {
    if (typeof value !== 'number') {
      return null
    }

    return {
      $type,
      $value: value,
    }
  }

  return null
}

function rgbToHex({ r, g, b, a }: Color): TokenColor {
  const toHex = (value: number): string => {
    const hex = Math.round(value * 255).toString(16)
    return hex.length === 1 ? `0${hex}` : hex
  }

  const hex = [toHex(r), toHex(g), toHex(b), a !== undefined && a < 1 ? toHex(a) : ''].join('')
  return `#${hex}`
}
