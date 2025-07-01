import { stdin as input, stdout as output } from 'node:process'
import { createInterface } from 'node:readline'

/**
 *
 */
export class SyncReadlineInterface {
  private rl

  /**
   *
   */
  constructor() {
    this.rl = createInterface({ input, output })
  }

  /**
   * @param query A statement or query to write to `output`, prepended to the prompt.
   * @param signal Optional.
   * @return a text string representing the user's response.
   * @example
   * ```js
   * const ac = new AbortController();
   * const signal = ac.signal;
   *
   * SyncReadlineInterface.question('What is your favorite food? ', signal);
   *
   * signal.addEventListener('abort', () => {
   *   console.log('The food question timed out');
   * }, { once: true });
   * ```
   */
  question(query: string, signal?: AbortSignal): string {
    return new Promise<string>(resolve => {
      this.rl.question(query, { signal }, resolve)
    }) as any
  }

  /**
   *
   */
  close(): void {
    this.rl.close()
  }
}
