/**
 * Removes leading slash from paths to ensure consistency across platforms
 */
export function fixPath(path: string): string {
  if (path.startsWith('/')) {
    return path.slice(1)
  }
  return path
}
