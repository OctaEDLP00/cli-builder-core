import { stdin as input, stdout as output } from 'node:process'
import { createInterface as createSyncInterface } from 'node:readline'
import { createInterface as createAsyncInterface } from 'node:readline/promises'
import type { ReadlineMode } from '../types/index.d.js'

/**
 * Manages readline interfaces for both Callback(sync) and Promise(async) operations.
 * Provides a unified interface for user input handling.
 *
 * @example
 * ```typescript
 * const manager = new ReadlineManager();
 * manager.setMode('async');
 * const answer = await manager.question('What is your name? ');
 * manager.cleanup();
 * ```
 */
export class ReadlineManager {
  private mode: ReadlineMode = 'async'
  private asyncInterface?: any
  private syncInterface?: any

  /**
   * Sets the readline mode (async or sync) and cleans up existing interfaces.
   *
   * @param mode - The readline mode to use ('async' or 'sync')
   */
  setMode(mode: ReadlineMode): void {
    this.mode = mode
    this.cleanup()
  }

  /**
   * Asks a question and returns the user's response.
   * Uses the currently set mode (async or sync).
   *
   * @param query - The question to ask the user
   * @returns Promise resolving to the user's input
   */
  async question(query: string): Promise<string> {
    if (this.mode === 'async') {
      return await this.questionAsync(query)
    } else {
      return await this.questionSync(query)
    }
  }

  /**
   * Asks a question using the async readline interface.
   *
   * @param query - The question to ask
   * @returns Promise resolving to the user's input
   * @private
   */
  private async questionAsync(query: string): Promise<string> {
    if (!this.asyncInterface) {
      this.asyncInterface = createAsyncInterface({ input, output })
    }
    return await this.asyncInterface.question(query)
  }

  /**
   * Asks a question using the sync readline interface.
   *
   * @param query - The question to ask
   * @returns Promise resolving to the user's input
   * @private
   */
  private async questionSync(query: string): Promise<string> {
    return new Promise<string>(resolve => {
      if (!this.syncInterface) {
        this.syncInterface = createSyncInterface({ input, output })
      }
      this.syncInterface.question(query, resolve)
    })
  }

  /**
   * Cleans up and closes all readline interfaces.
   * Should be called when done with the manager.
   */
  cleanup(): void {
    if (this.asyncInterface) {
      this.asyncInterface.close()
      this.asyncInterface = undefined
    }
    if (this.syncInterface) {
      this.syncInterface.close()
      this.syncInterface = undefined
    }
  }
}
