/**
 * Custom Error Classes for CLI Builder
 *
 * This module provides a comprehensive error handling system with specific error types
 * for different failure scenarios in CLI applications. All errors extend the base CLIError
 * class and include contextual information for better debugging.
 *
 * @example
 * ```typescript
 * // Direct usage
 * throw new ValidationError('Invalid input', { projectName: 'test' });
 *
 * // Using factory
 * throw ErrorFactory.filesystem('File not found', {
 *   operation: 'generate',
 *   filePath: '/path/to/file'
 * });
 * ```
 */

import type { CLIErrorContext, Json } from '../types/index.d.js'

/**
 * Base abstract class for all CLI-related errors.
 * Provides common functionality including error codes, context, and timestamps.
 */
export abstract class CLIError extends Error {
  public readonly code: string
  public readonly context: CLIErrorContext
  public readonly timestamp: Date

  /**
   * Creates a new CLIError instance.
   *
   * @param message - The error message
   * @param code - A unique error code for this error type
   * @param context - Additional context information about the error
   */
  constructor(message: string, code: string, context: CLIErrorContext = {}) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.context = context
    this.timestamp = new Date()

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  /**
   * Converts the error to a JSON representation for logging or serialization.
   *
   * @returns JSON representation of the error
   */
  toJSON(): Json {
    const { name, message, code, context, timestamp, stack } = this
    return Object.assign(
      {},
      {
        name,
        message,
        code,
        context,
        timestamp,
        stack,
      },
    )
  }
}

/**
 * Error thrown when validation fails.
 * Used for input validation, configuration validation, etc.
 */
export class ValidationError extends CLIError {
  constructor(message: string, context: CLIErrorContext = {}) {
    super(message, 'VALIDATION_ERROR', context)
  }
}

/**
 * Error thrown when template operations fail.
 * Used for template loading, parsing, or processing errors.
 */
export class TemplateError extends CLIError {
  constructor(message: string, context: CLIErrorContext = {}) {
    super(message, 'TEMPLATE_ERROR', context)
  }
}

/**
 * Error thrown when file system operations fail.
 * Used for file/directory creation, reading, writing, or deletion errors.
 */
export class FileSystemError extends CLIError {
  constructor(message: string, context: CLIErrorContext = {}) {
    super(message, 'FILESYSTEM_ERROR', context)
  }
}

/**
 * Error thrown when dependency management fails.
 * Used for npm install, package resolution, or dependency conflicts.
 */
export class DependencyError extends CLIError {
  constructor(message: string, context: CLIErrorContext = {}) {
    super(message, 'DEPENDENCY_ERROR', context)
  }
}

/**
 * Error thrown when plugin operations fail.
 * Used for plugin loading, installation, or execution errors.
 */
export class PluginError extends CLIError {
  constructor(message: string, context: CLIErrorContext = {}) {
    super(message, 'PLUGIN_ERROR', context)
  }
}

/**
 * Error thrown when readline operations fail.
 * Used for user input handling or interface creation errors.
 */
export class ReadlineError extends CLIError {
  constructor(message: string, context: CLIErrorContext = {}) {
    super(message, 'READLINE_ERROR', context)
  }
}

/**
 * Error thrown when configuration is invalid or missing.
 * Used for CLI configuration, plugin configuration, or template configuration errors.
 */
export class ConfigurationError extends CLIError {
  constructor(message: string, context: CLIErrorContext = {}) {
    super(message, 'CONFIGURATION_ERROR', context)
  }
}

/**
 * Error thrown when network operations fail.
 * Used for download failures, API calls, or connectivity issues.
 */
export class NetworkError extends CLIError {
  constructor(message: string, context: CLIErrorContext = {}) {
    super(message, 'NETWORK_ERROR', context)
  }
}

/**
 * Error thrown when external process execution fails.
 * Used for shell command execution, npm commands, or other process spawning.
 */
export class ProcessError extends CLIError {
  constructor(message: string, context: CLIErrorContext = {}) {
    super(message, 'PROCESS_ERROR', context)
  }
}

/**
 * Factory class for creating specific error types with consistent patterns.
 * Provides a convenient way to create errors without importing individual classes.
 */
export class ErrorFactory {
  /**
   * Creates a validation error.
   *
   * @param message - The error message
   * @param context - Optional context information
   * @returns A new ValidationError instance
   */
  static validation(message: string, context?: CLIErrorContext): ValidationError {
    return new ValidationError(message, context)
  }

  /**
   * Creates a template error.
   *
   * @param message - The error message
   * @param context - Optional context information
   * @returns A new TemplateError instance
   */
  static template(message: string, context?: CLIErrorContext): TemplateError {
    return new TemplateError(message, context)
  }

  /**
   * Creates a filesystem error.
   *
   * @param message - The error message
   * @param context - Optional context information
   * @returns A new FileSystemError instance
   */
  static filesystem(message: string, context?: CLIErrorContext): FileSystemError {
    return new FileSystemError(message, context)
  }

  /**
   * Creates a dependency error.
   *
   * @param message - The error message
   * @param context - Optional context information
   * @returns A new DependencyError instance
   */
  static dependency(message: string, context?: CLIErrorContext): DependencyError {
    return new DependencyError(message, context)
  }

  /**
   * Creates a plugin error.
   *
   * @param message - The error message
   * @param context - Optional context information
   * @returns A new PluginError instance
   */
  static plugin(message: string, context?: CLIErrorContext): PluginError {
    return new PluginError(message, context)
  }

  /**
   * Creates a readline error.
   *
   * @param message - The error message
   * @param context - Optional context information
   * @returns A new ReadlineError instance
   */
  static readline(message: string, context?: CLIErrorContext): ReadlineError {
    return new ReadlineError(message, context)
  }

  /**
   * Creates a configuration error.
   *
   * @param message - The error message
   * @param context - Optional context information
   * @returns A new ConfigurationError instance
   */
  static configuration(message: string, context?: CLIErrorContext): ConfigurationError {
    return new ConfigurationError(message, context)
  }

  /**
   * Creates a network error.
   *
   * @param message - The error message
   * @param context - Optional context information
   * @returns A new NetworkError instance
   */
  static network(message: string, context?: CLIErrorContext): NetworkError {
    return new NetworkError(message, context)
  }

  /**
   * Creates a process error.
   *
   * @param message - The error message
   * @param context - Optional context information
   * @returns A new ProcessError instance
   */
  static process(message: string, context?: CLIErrorContext): ProcessError {
    return new ProcessError(message, context)
  }
}

type PlError = typeof PluginError
type PrsError = typeof ProcessError
type ConfigError = typeof ConfigurationError
type DpndcyError = typeof DependencyError
type FileSysError = typeof FileSystemError
type NetError = typeof NetworkError
type RLError = typeof ReadlineError
type ValError = typeof ValidationError
type TemplError = typeof TemplateError

export type {
  PlError,
  PrsError,
  ConfigError,
  DpndcyError,
  FileSysError,
  NetError,
  RLError,
  ValError,
  TemplError,
}
