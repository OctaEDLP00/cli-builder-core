import type { ValidationRule } from '../types/index.d.js'

/**
 * Collection of built-in validation rules for common use cases.
 * These validators can be used directly in prompt configurations.
 *
 * @example
 * ```typescript
 * definePrompt({
 *   name: 'projectName',
 *   type: 'input',
 *   message: 'Project name',
 *   validate: validators.projectName
 * });
 * ```
 */
export const validators = {
  /**
   * Validates that a field is not empty.
   * Checks for undefined, null, or empty string values.
   */
  required: {
    validate: (value: any) => {
      return value !== undefined && value !== null && value.toString().trim().length > 0
    },
    message: 'This field is required',
  } as ValidationRule,

  /**
   * Validates project names according to common naming conventions.
   * Ensures the name contains only letters, numbers, hyphens, and underscores,
   * and doesn't start or end with hyphens.
   */
  projectName: {
    validate: (value: string) => {
      if (!value || value.trim().length === 0) {
        return 'Project name cannot be empty'
      }
      if (!/^[a-zA-Z0-9-_]+$/.test(value)) {
        return 'Project name can only contain letters, numbers, hyphens, and underscores'
      }
      if (value.startsWith('-') || value.endsWith('-')) {
        return 'Project name cannot start or end with a hyphen'
      }
      return true
    },
  } as ValidationRule,

  /**
   * Validates email addresses using a basic regex pattern.
   * Checks for the presence of @ symbol and basic email structure.
   */
  email: {
    validate: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value) || 'Please enter a valid email address'
    },
  } as ValidationRule,

  /**
   * Creates a validator that checks for minimum string length.
   *
   * @param min - The minimum required length
   * @returns A validation rule that enforces the minimum length
   *
   * @example
   * ```typescript
   * validate: validators.minLength(5)
   * ```
   */
  minLength: (min: number) =>
    ({
      validate: (value: string) => {
        return value.length >= min || `Minimum length is ${min} characters`
      },
    }) as ValidationRule,

  /**
   * Creates a validator that checks for maximum string length.
   *
   * @param max - The maximum allowed length
   * @returns A validation rule that enforces the maximum length
   *
   * @example
   * ```typescript
   * validate: validators.maxLength(50)
   * ```
   */
  maxLength: (max: number) =>
    ({
      validate: (value: string) => {
        return value.length <= max || `Maximum length is ${max} characters`
      },
    }) as ValidationRule,
}
