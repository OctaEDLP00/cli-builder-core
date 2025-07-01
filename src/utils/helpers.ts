import { join } from 'node:path'

/**
 *
 * @param name
 * @returns
 */
export function validateProjectName(name: string): { valid: boolean; message?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, message: 'Project name cannot be empty' }
  }

  if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
    return {
      valid: false,
      message: 'Project name can only contain letters, numbers, hyphens, and underscores',
    }
  }

  if (name.startsWith('-') || name.endsWith('-')) {
    return { valid: false, message: 'Project name cannot start or end with a hyphen' }
  }

  return { valid: true }
}

/**
 *
 */
export function clearConsole() {
  process.stdout.write('\x1Bc')
}

/**
 *
 * @param name
 * @param basePath
 * @returns
 */
export function getProjectPath(name: string, basePath: string = process.cwd()): string {
  return join(basePath, name)
}
