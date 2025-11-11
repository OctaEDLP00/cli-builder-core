import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { PluginManager } from '../../src/plugins/plugin-manager.js'
import type { PluginConfig } from '../../src/types/index.js'

describe('PluginManager', () => {
  let pluginManager: PluginManager
  let consoleSpy: any

  beforeEach(() => {
    pluginManager = new PluginManager()
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  const mockPlugin: PluginConfig = {
    name: 'test-plugin',
    version: '1.0.0',
    description: 'Test plugin',
    hooks: {
      beforeGenerate: vi.fn(),
      afterGenerate: vi.fn(),
    },
  }

  it('should create PluginManager instance', () => {
    expect(pluginManager).toBeInstanceOf(PluginManager)
    expect(pluginManager.name).toBe('PluginManager')
    expect(pluginManager.version).toBe('1.0.0')
  })

  it('should install plugin successfully', async () => {
    await pluginManager.install(mockPlugin)

    const installed = pluginManager.getPlugin('test-plugin')
    expect(installed).toEqual(mockPlugin)
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Plugin 'test-plugin' v1.0.0 installed successfully"),
    )
  })

  it('should throw error when installing duplicate plugin', async () => {
    await pluginManager.install(mockPlugin)

    await expect(pluginManager.install(mockPlugin)).rejects.toThrow(
      "Plugin 'test-plugin' is already installed",
    )
  })

  it('should throw error when installing plugin with invalid name', async () => {
    const invalidPlugin = { ...mockPlugin, name: '' }

    await expect(pluginManager.install(invalidPlugin)).rejects.toThrow(
      'Plugin name is required and must be a string',
    )
  })

  it('should throw error when installing plugin with invalid version', async () => {
    const invalidPlugin = { ...mockPlugin, version: 'invalid-version' }

    await expect(pluginManager.install(invalidPlugin)).rejects.toThrow(
      'is not a valid semantic version',
    )
  })

  it('should uninstall plugin successfully', async () => {
    await pluginManager.install(mockPlugin)
    await pluginManager.uninstall('test-plugin')

    const installed = pluginManager.getPlugin('test-plugin')
    expect(installed).toBeUndefined()
  })

  it('should throw error when uninstalling non-existent plugin', async () => {
    await expect(pluginManager.uninstall('non-existent')).rejects.toThrow(
      "Plugin 'non-existent' is not installed",
    )
  })

  it('should list all plugins', async () => {
    await pluginManager.install(mockPlugin)

    const plugins = pluginManager.listPlugins()
    expect(plugins).toHaveLength(1)
    expect(plugins[0]).toEqual(mockPlugin)
  })

  it('should execute hooks successfully', async () => {
    const mockHook = vi.fn()
    const pluginWithHook: PluginConfig = {
      ...mockPlugin,
      hooks: {
        beforeGenerate: mockHook,
      },
    }

    await pluginManager.install(pluginWithHook)
    await pluginManager.executeHook('beforeGenerate', { test: 'data' })

    expect(mockHook).toHaveBeenCalledWith({ test: 'data' })
  })

  it('should handle hook execution errors gracefully', async () => {
    const errorHook = vi.fn().mockImplementation(() => {
      throw new Error('Hook error')
    })

    const pluginWithErrorHook: PluginConfig = {
      ...mockPlugin,
      hooks: {
        beforeGenerate: errorHook,
      },
    }

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    await pluginManager.install(pluginWithErrorHook)
    await pluginManager.executeHook('beforeGenerate')

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Warning: Plugin 'test-plugin' hook 'beforeGenerate' failed:"),
      expect.any(Error),
    )

    warnSpy.mockRestore()
  })

  it('should get all templates from plugins', async () => {
    const pluginWithTemplates: PluginConfig = {
      ...mockPlugin,
      templates: [
        {
          name: 'test-template',
          description: 'Test template',
          files: [],
        },
      ],
    }

    await pluginManager.install(pluginWithTemplates)
    const templates = pluginManager.getAllTemplates()

    expect(templates).toHaveLength(1)
    expect(templates[0].name).toBe('test-template')
  })

  it('should get all validators from plugins', async () => {
    const pluginWithValidators: PluginConfig = {
      ...mockPlugin,
      validators: {
        testValidator: {
          validate: (value: unknown, answers?: Record<string, unknown>) =>
            (value as string).length > 0,
          message: 'Required',
        },
      },
    }

    await pluginManager.install(pluginWithValidators)
    const validators = pluginManager.getAllValidators()

    expect(validators.testValidator).toBeDefined()
    expect(validators.testValidator.message).toBe('Required')
  })

  it('should get all themes from plugins', async () => {
    const pluginWithThemes: PluginConfig = {
      ...mockPlugin,
      themes: {
        testTheme: {
          primary: '#ff0000',
          secondary: '#00ff00',
          success: '#0000ff',
          error: '#ffff00',
          warning: '#ff00ff',
          info: '#00ffff',
          muted: '#888888',
        },
      },
    }

    await pluginManager.install(pluginWithThemes)
    const themes = pluginManager.getAllThemes()

    expect(themes.testTheme).toBeDefined()
    expect(themes.testTheme.primary).toBe('#ff0000')
  })
})
