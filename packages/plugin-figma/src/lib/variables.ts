import type { Variable, VariableCollection } from "../types"

type NonNull<T> = T extends null | undefined ? never : T

export interface VariableSet {
  collection: VariableCollection
  variables: Variable[]
}

/**
 * Use only on the main side
 */
export function loadLocalVariables(): VariableSet[] {
  const collections = figma.variables.getLocalVariableCollections()
  return collections
    .filter((c): c is NonNull<typeof c> => !!c)
    .map((collection) => {
      const variableIds = collection.variableIds
      const variables = variableIds
        .map((variableId) => figma.variables.getVariableById(variableId))
        .filter((c): c is NonNull<typeof c> => !!c)

      // collection, variables getter を含むオブジェクトのため, JSON object に変換する
      return {
        collection: {
          id: collection.id,
          name: collection.name,
          hiddenFromPublishing: collection.hiddenFromPublishing,
          remote: collection.remote,
          defaultModeId: collection.defaultModeId,
          modes: collection.modes,
          variableIds: collection.variableIds,
          key: collection.key,
        },
        variables: variables.map((variable) => ({
          id: variable.id,
          name: variable.name,
          description: variable.description,
          resolvedType: variable.resolvedType,
          valuesByMode: variable.valuesByMode,
          key: variable.key,
          remote: variable.remote,
          scopes: variable.scopes,
          codeSyntax: variable.codeSyntax,
          variableCollectionId: variable.variableCollectionId,
          hiddenFromPublishing: variable.hiddenFromPublishing,
        })),
      }
    })
}
