import { describe, it, expect } from 'vitest'
import {
  CLIError,
  ValidationError,
  TemplateError,
  FileSystemError,
  DependencyError,
  PluginError,
  ReadlineError,
  ConfigurationError,
  NetworkError,
  ProcessError,
  ErrorFactory
} from '../../src/errors/index.js'
import { CLIErrorContext } from '~/index.js'

describe('Error System', () => {
  describe('ValidationError', () => {
    it('should create ValidationError with message', () => {
      const error = new ValidationError('Invalid input')

      expect(error).toBeInstanceOf(ValidationError)
      expect(error).toBeInstanceOf(CLIError)
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe('Invalid input')
      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.name).toBe('ValidationError')
    })

    it('should create ValidationError with context', () => {
      const context = {
        projectName: 'invalid'
      } as CLIErrorContext

      const error = new ValidationError('Invalid project name', context)

      expect(error.context).toEqual(context)
      expect(error.timestamp).toBeInstanceOf(Date)
    })
  })

  describe('ErrorFactory', () => {
    it('should create validation error', () => {
      const error = ErrorFactory.validation('Test validation error')

      expect(error).toBeInstanceOf(ValidationError)
      expect(error.message).toBe('Test validation error')
      expect(error.code).toBe('VALIDATION_ERROR')
    })

    it('should create template error', () => {
      const error = ErrorFactory.template('Test template error')

      expect(error).toBeInstanceOf(TemplateError)
      expect(error.message).toBe('Test template error')
      expect(error.code).toBe('TEMPLATE_ERROR')
    })

    it('should create filesystem error', () => {
      const error = ErrorFactory.filesystem('Test filesystem error')

      expect(error).toBeInstanceOf(FileSystemError)
      expect(error.message).toBe('Test filesystem error')
      expect(error.code).toBe('FILESYSTEM_ERROR')
    })

    it('should create dependency error', () => {
      const error = ErrorFactory.dependency('Test dependency error')

      expect(error).toBeInstanceOf(DependencyError)
      expect(error.message).toBe('Test dependency error')
      expect(error.code).toBe('DEPENDENCY_ERROR')
    })

    it('should create plugin error', () => {
      const error = ErrorFactory.plugin('Test plugin error')

      expect(error).toBeInstanceOf(PluginError)
      expect(error.message).toBe('Test plugin error')
      expect(error.code).toBe('PLUGIN_ERROR')
    })

    it('should create readline error', () => {
      const error = ErrorFactory.readline('Test readline error')

      expect(error).toBeInstanceOf(ReadlineError)
      expect(error.message).toBe('Test readline error')
      expect(error.code).toBe('READLINE_ERROR')
    })

    it('should create configuration error', () => {
      const error = ErrorFactory.configuration('Test configuration error')

      expect(error).toBeInstanceOf(ConfigurationError)
      expect(error.message).toBe('Test configuration error')
      expect(error.code).toBe('CONFIGURATION_ERROR')
    })

    it('should create network error', () => {
      const error = ErrorFactory.network('Test network error')

      expect(error).toBeInstanceOf(NetworkError)
      expect(error.message).toBe('Test network error')
      expect(error.code).toBe('NETWORK_ERROR')
    })

    it('should create process error', () => {
      const error = ErrorFactory.process('Test process error')

      expect(error).toBeInstanceOf(ProcessError)
      expect(error.message).toBe('Test process error')
      expect(error.code).toBe('PROCESS_ERROR')
    })
  })

  describe('Error serialization', () => {
    it('should serialize error to JSON', () => {
      const context = { operation: 'test', projectName: 'my-app' }
      const error = new ValidationError('Test error', context)
      const json = error.toJSON();

      expect(json.name).toBe('ValidationError')
      expect(json.message).toBe('Test error')
      expect(json.code).toBe('VALIDATION_ERROR')
      expect(json.context).toEqual(context)
      expect(json.timestamp).toBeInstanceOf(Date)
      expect(json.stack).toBeDefined()
    })
  })
})
