import { mkdir, writeFile as fsWriteFile } from 'node:fs/promises'
import { dirname } from 'node:path'

/**
 * Utility functions to replace fs-extra functionality using only Node.js built-in modules.
 * These functions provide the same API as fs-extra but without external dependencies.
 */

/**
 * Ensures that a directory exists. If the directory structure does not exist, it is created.
 * Like mkdir -p, but in Node.js.
 *
 * @param dirPath - The directory path to ensure exists
 */
export async function ensureDir(dirPath: string): Promise<void> {
  try {
    await mkdir(dirPath, { recursive: true })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code !== 'EEXIST') {
      throw error
    }
  }
}

/**
 * Writes data to a file, replacing the file if it already exists.
 * The directory structure is created if it doesn't exist.
 *
 * @param filePath - The file path to write to
 * @param data - The data to write
 */
export async function writeFile(filePath: string, data: string): Promise<void> {
  const dir = dirname(filePath)
  await ensureDir(dir)
  await fsWriteFile(filePath, data, 'utf8')
}

/**
 * Writes an object to a JSON file, with optional formatting.
 * The directory structure is created if it doesn't exist.
 *
 * @param filePath - The file path to write to
 * @param obj - The object to write as JSON
 * @param options - Optional formatting options
 */
export async function writeJson(
  filePath: string,
  obj: unknown,
  options: { spaces?: number } = { spaces: 2 },
): Promise<void> {
  const { spaces } = options
  const jsonString = JSON.stringify(obj, null, spaces)
  await writeFile(filePath, jsonString)
}
