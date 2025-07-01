import type { PromptResult, ValidationRule } from '../types/index.d.js'

/**
 * Manages validation rules and validates user answers.
 * Supports both built-in and custom validation rules.
 *
 * @example
 * ```typescript
 * const validator = new ValidationManager({
 *   customRule: {
 *     validate: (value) => value.length > 5,
 *     message: 'Must be longer than 5 characters'
 *   }
 * });
 *
 * const result = validator.validateAnswers(answers);
 * if (!result.valid) {
 *   console.error(result.message);
 * }
 * ```
 */
export class ValidationManager {
  private customValidators: Record<string, ValidationRule>

  /**
   * Creates a new ValidationManager instance.
   *
   * @param customValidators - Optional custom validation rules
   */
  constructor(customValidators?: Record<string, ValidationRule>) {
    this.customValidators = customValidators || {}
  }

  /**
   * Validates a complete set of user answers.
   * Performs basic validation checks and can be extended with custom logic.
   *
   * @param answers - The answers to validate
   * @returns Validation result with success status and optional error message
   */
  validateAnswers(answers: PromptResult): { valid: boolean; message?: string } {
    // Add custom validation logic here
    if (!answers.projectName) {
      return { valid: false, message: 'Project name is required' }
    }

    if (!answers.template) {
      return { valid: false, message: 'Template selection is required' }
    }

    return { valid: true }
  }

  /**
   * Retrieves a custom validator by name.
   *
   * @param name - The name of the validator to retrieve
   * @returns The validation rule if found, undefined otherwise
   */
  getValidator(name: string): ValidationRule | undefined {
    return this.customValidators[name]
  }
}
