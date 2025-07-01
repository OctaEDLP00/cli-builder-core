import { describe, it, expect } from 'vitest'
import { ValidationManager } from '../../src/core/validation-manager.js'
import type { ValidationRule } from '../../src/types/index.js'

describe('ValidationManager', () => {
  it('should create ValidationManager without custom validators', () => {
    const validator = new ValidationManager()
    expect(validator).toBeInstanceOf(ValidationManager)
  })

  it('should create ValidationManager with custom validators', () => {
    const customValidators: Record<string, ValidationRule> = {
      testValidator: {
        validate: (value: string) => value.length > 5,
        message: 'Must be longer than 5 characters'
      }
    }

    const validator = new ValidationManager(customValidators)
    expect(validator).toBeInstanceOf(ValidationManager)
  })

  it('should validate answers successfully', () => {
    const validator = new ValidationManager()
    const answers = {
      projectName: 'test-project',
      template: 'react'
    }

    const result = validator.validateAnswers(answers)
    expect(result.valid).toBe(true)
  })

  it('should fail validation when projectName is missing', () => {
    const validator = new ValidationManager()
    const answers = {
      template: 'react'
    }

    const result = validator.validateAnswers(answers);
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Project name is required')
  })

  it('should fail validation when template is missing', () => {
    const validator = new ValidationManager()
    const answers = {
      projectName: 'test-project'
    }

    const result = validator.validateAnswers(answers)
    expect(result.valid).toBe(false)
    expect(result.message).toBe('Template selection is required')
  })

  it('should retrieve custom validator', () => {
    const customValidators: Record<string, ValidationRule> = {
      testValidator: {
        validate: (value: string) => value.length > 5,
        message: 'Must be longer than 5 characters'
      }
    }

    const validator = new ValidationManager(customValidators)
    const retrieved = validator.getValidator('testValidator')

    expect(retrieved).toBeDefined()
    expect(retrieved?.message).toBe('Must be longer than 5 characters')
  })

  it('should return undefined for non-existent validator', () => {
    const validator = new ValidationManager()
    const retrieved = validator.getValidator('nonExistent')

    expect(retrieved).toBeUndefined()
  })
})