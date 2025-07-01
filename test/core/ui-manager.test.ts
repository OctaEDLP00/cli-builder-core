import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { UIManager } from '../../src/core/ui-manager.js'
import type { UITheme } from '../../src/types/index.js'

describe('UIManager', () => {
  let uiManager: UIManager
  let consoleSpy: any

  beforeEach(() => {
    uiManager = new UIManager()
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('should create UIManager with default theme', () => {
    expect(uiManager).toBeInstanceOf(UIManager)
  })

  it('should create UIManager with custom theme', () => {
    const customTheme: UITheme = {
      primary: '#ff0000',
      secondary: '#00ff00',
      success: '#0000ff',
      error: '#ffff00',
      warning: '#ff00ff',
      info: '#00ffff',
      muted: '#888888'
    }

    const customUIManager = new UIManager(customTheme)
    expect(customUIManager).toBeInstanceOf(UIManager)
  })

  it('should show welcome message', () => {
    uiManager.showWelcome('Test App')
    expect(consoleSpy).toHaveBeenCalled()
  })

  it('should show success message', () => {
    uiManager.showSuccess('Operation successful')
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('✅'))
  })

  it('should show error message', () => {
    uiManager.showError('Something went wrong')
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('❌'))
  })

  it('should show warning message', () => {
    uiManager.showWarning('This is a warning')
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('⚠️'))
  })

  it('should show info message', () => {
    uiManager.showInfo('This is information')
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('ℹ️'))
  })

  it('should show progress bar', () => {
    uiManager.showProgress('Loading', 50, 100)
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('50%'))
  })
})
