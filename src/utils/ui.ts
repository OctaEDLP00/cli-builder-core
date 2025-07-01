import { cyan, bold, blue } from 'picocolors'

/**
 *
 */
export function showWelcome() {
  const logo = `
  ╭─────────────────────────────────────╮
  │                                 │
  │     🚀 MODERN APP CREATOR       │
  │                                 │
  │  Create amazing projects        │
  │  with modern tools              │
  │  and best practices             │
  │                                 │
  ╰─────────────────────────────────────╯
  `

  console.log(cyan(bold(logo)))
}

/**
 *
 * @param message
 * @param current
 * @param total
 */
export function showProgress(message: string, current: number, total: number) {
  const percentage = Math.round((current / total) * 100)
  const progressBar = '█'.repeat(Math.floor(percentage / 5))
  const emptyBar = '░'.repeat(20 - Math.floor(percentage / 5))

  console.log(blue(`${message} [${progressBar}${emptyBar}] ${percentage}%`))
}
