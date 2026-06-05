import { defineConfig } from 'tsup'
import { copyFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export default defineConfig({
  dts: true,
  bundle: true,
  clean: true,
  splitting: false,
  entry: ['./src/**/*'],
  target: ['node22', 'deno2'],
  format: 'esm',
  tsconfig: './tsconfig.json',
  onSuccess: async () => {
    const filesToCopy = ['README.md', 'LICENSE', 'package.json']
    await Promise.all(
      filesToCopy.map(async file => {
        try {
          const srcPath = resolve(process.cwd(), file)
          const destPath = resolve(process.cwd(), 'dist', file)
          await copyFile(srcPath, destPath)
          console.log(`Copied ${file} to dist/`)
        } catch (error) {
          console.warn(`Warning: Could not copy ${file}`, error)
        }
      }),
    )
  },
})
