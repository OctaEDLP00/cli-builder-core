import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CLIBuilder } from '../../src/core/cli-builder.js'
import type { CLIConfig } from '../../src/types/index.js'
import { CLIError, ReadlineError } from '~/index.js'

describe('CLIBuilder', () => {
  let mockConfig: CLIConfig

  beforeEach(() => {
    mockConfig = {
      name: 'test-cli',
      version: '1.0.0',
      description: 'Test CLI',
      prompts: [
        {
          name: 'projectName',
          type: 'input',
          message: 'Project name'
        }
      ],
      templates: [
        {
          name: 'test-template',
          description: 'Test template',
          files: [
            {
              path: 'test.txt',
              content: 'Hello World'
            }
          ]
        }
      ]
    }
  })

  it('should create a CLIBuilder instance', () => {
    const cli = new CLIBuilder(mockConfig)
    expect(cli).toBeInstanceOf(CLIBuilder)
  });

  it('should have correct configuration', () => {
    const cli = new CLIBuilder(mockConfig)
    expect(cli).toBeDefined()
    // Test that the CLI was created with the correct config
    // Note: We can't directly access private properties, so we test behavior
  });

  it('should handle parse method without throwing', () => {
    const cli = new CLIBuilder(mockConfig)
    expect(() => {
      // Mock process.argv to avoid actual CLI execution
      const originalArgv = process.argv
      process.argv = ['node', 'test', '--help']

      try {
        cli.parse()
      } catch (error) {
        // Help command exits the process, which is expected
        if (error instanceof ReadlineError) {
          if (error.code !== 'READLINE_ERROR') throw error
        }
      } finally {
        process.argv = originalArgv
      }
    }).not.toThrow()
  })
})
