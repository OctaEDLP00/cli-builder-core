import type { Color, ShowWelcomeOptions, UITheme } from '../types/index.d.js'
// Avoid depending on picocolors named exports here to keep examples runnable.
const bold = (s: string) => s
import { hex } from '../utils/themes.js'

/**
 * Manages user interface elements including colors, themes, and console output.
 * Provides methods for displaying various types of messages with consistent styling.
 *
 * @example
 * ```typescript
 * const ui = new UIManager(customTheme);
 * ui.showWelcome('My CLI');
 * ui.showSuccess('Operation completed!');
 * ui.showError('Something went wrong');
 * ```
 */
export class UIManager {
  private theme: UITheme

  /**
   * Creates a new UIManager instance with the specified theme.
   *
   * @param theme - Optional custom theme. Uses default theme if not provided.
   */
  constructor(theme?: UITheme) {
    this.theme =
      theme ||
      ({
        primary: '#3b82f6',
        secondary: '#6b7280',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#06b6d4',
        muted: '#9ca3af',
      } as Record<keyof UITheme, Color>)
  }

  /**
   * Displays a welcome message with the application name.
   * Clears the console and shows a styled logo.
   *
   * @param appName - The name of the application to display
   */
  showWelcome(appName: string, options?: ShowWelcomeOptions): void {
    this.clearConsole()
    const name = appName.toUpperCase().padEnd(16)
    const logo =
      options?.message ??
      `
  ╭─────────────────────────────────────╮
  │                                     │
  │            ${name}         │
  │                                     │
  │   Create amazing projects with      │
  │   modern tools and best practices   │
  │                                     │
  ╰─────────────────────────────────────╯
  `

    console.log(bold(hex(this.theme.primary, logo)))
  }

  /**
   * Displays a success message with green styling.
   *
   * @param message - The success message to display
   */
  showSuccess(message: string): void {
    console.log(bold(hex(this.theme.success, `✅ ${message}`)))
  }

  /**
   * Displays an error message with red styling.
   *
   * @param message - The error message to display
   */
  showError(message: string): void {
    console.log(bold(hex(this.theme.error, `❌ ${message}`)))
  }

  /**
   * Displays a warning message with yellow/orange styling.
   *
   * @param message - The warning message to display
   */
  showWarning(message: string): void {
    console.log(bold(hex(this.theme.warning, `⚠️  ${message}`)))
  }

  /**
   * Displays an informational message with blue styling.
   *
   * @param message - The info message to display
   */
  showInfo(message: string): void {
    console.log(bold(hex(this.theme.info, `ℹ️ ${message}`)))
  }

  /**
   * Displays a progress bar with the current progress.
   *
   * @param message - The message to display with the progress bar
   * @param current - Current progress value
   * @param total - Total progress value
   */
  showProgress(message: string, current: number, total: number): void {
    const percentage = Math.round((current / total) * 100)
    const progressBar = '█'.repeat(Math.floor(percentage / 5))
    const emptyBar = '░'.repeat(20 - Math.floor(percentage / 5))

    console.log(hex(this.theme.info, `${message} [${progressBar}${emptyBar}] ${percentage}%`))
  }

  /**
   * Clears the console screen.
   *
   * @private
   */
  private clearConsole(): void {
    process.stdout.write('\x1Bc')
  }
}
