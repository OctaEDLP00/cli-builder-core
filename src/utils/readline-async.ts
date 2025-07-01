import { stdin as input, stdout as output } from 'node:process'
import { createInterface } from 'node:readline/promises'

/**
 *
 */
export class AsyncReadlineInterface {
  private rl

  /**
   *
   */
  constructor() {
    this.rl = createInterface({ input, output })
  }

  /**
   *
   * @param query
   * @returns
   */
  async question(query: string): Promise<string> {
    return await this.rl.question(query)
  }

  /**
   *
   */
  close(): void {
    this.rl.close()
  }
}
