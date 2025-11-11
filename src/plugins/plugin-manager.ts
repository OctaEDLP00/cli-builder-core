import { ErrorFactory } from '../errors/index.js'
import type { PluginAdapter, PluginConfig, PluginHooks } from '../types/index.d.js'

/**
 * Manages CLI plugins including installation, uninstallation, and hook execution.
 * Provides a complete plugin system for extending CLI functionality.
 *
 * @example
 * ```typescript
 * const manager = new PluginManager();
 * await manager.install(myPlugin);
 * await manager.executeHook('beforeGenerate', config);
 * ```
 */
export class PluginManager implements PluginAdapter {
  public readonly name = 'PluginManager'
  public readonly version = '1.0.0'
  private plugins: Map<string, PluginConfig> = new Map()

  /**
   * Installs a plugin and validates its configuration.
   *
   * @param config - The plugin configuration to install
   * @throws {PluginError} When plugin is already installed or configuration is invalid
   */
  async install(config: PluginConfig): Promise<void> {
    try {
      if (this.plugins.has(config.name)) {
        throw ErrorFactory.plugin(`Plugin '${config.name}' is already installed`, {
          operation: 'install',
          additionalInfo: { pluginName: config.name },
        })
      }

      this.validatePluginConfig(config)

      this.plugins.set(config.name, config)

      console.log(`✅ Plugin '${config.name}' v${config.version} installed successfully`)
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorFactory.plugin(`Failed to install plugin '${config.name}': ${error.message}`, {
          operation: 'install',
          additionalInfo: { pluginName: config.name },
        })
      }
      throw error
    }
  }

  /**
   * Uninstalls a plugin by name.
   *
   * @param name - The name of the plugin to uninstall
   * @throws {typeof import('../error/index.js').PluginError} When plugin is not found
   */
  async uninstall(name: string): Promise<void> {
    try {
      if (!this.plugins.has(name)) {
        throw ErrorFactory.plugin(`Plugin '${name}' is not installed`, {
          operation: 'uninstall',
          additionalInfo: { pluginName: name },
        })
      }

      this.plugins.delete(name)
      console.log(`✅ Plugin '${name}' uninstalled successfully`)
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorFactory.plugin(`Failed to uninstall plugin '${name}': ${error.message}`, {
          operation: 'uninstall',
          additionalInfo: { pluginName: name },
        })
      }
      throw error
    }
  }

  /**
   * Retrieves a plugin configuration by name.
   *
   * @param name - The name of the plugin to retrieve
   * @returns The plugin configuration if found, undefined otherwise
   */
  getPlugin(name: string): PluginConfig | undefined {
    return this.plugins.get(name)
  }

  /**
   * Lists all installed plugins.
   *
   * @returns Array of all installed plugin configurations
   */
  listPlugins(): PluginConfig[] {
    return Array.from(this.plugins.values())
  }

  /**
   * Executes a specific hook across all installed plugins.
   * Handles errors gracefully and continues execution even if some plugins fail.
   *
   * @param hookName - The name of the hook to execute
   * @param args - Arguments to pass to the hook functions
   */
  async executeHook(hookName: keyof PluginHooks, ...args: unknown[]): Promise<void> {
    const promises: Array<Promise<void>> = []

    // No default payload; callers should provide context explicitly.

    for (const plugin of this.plugins.values()) {
      if (plugin.hooks && plugin.hooks[hookName]) {
        const hook = plugin.hooks?.[hookName]
        if (hook) {
          try {
            const result = (hook as (...args: Array<unknown>) => any)(...args)

            if (result instanceof Promise) {
              // Attach handlers to catch rejections and forward to onError if provided
              const p = result.catch(async (err) => {
                console.warn(`Warning: Plugin '${plugin.name}' hook '${hookName}' failed:`, err)
                if (plugin.hooks && plugin.hooks.onError) {
                  try {
                    return plugin.hooks.onError(err as Error, `hook:${hookName}`)
                  } catch (onErr) {
                    console.error(`Plugin '${plugin.name}' onError hook also failed:`, onErr)
                  }
                }
              })
              promises.push(p)
            }
          } catch (error) {
            console.warn(`Warning: Plugin '${plugin.name}' hook '${hookName}' failed:`, error)

            if (plugin.hooks && plugin.hooks.onError) {
              try {
                const errorResult = plugin.hooks.onError(error as Error, `hook:${hookName}`)
                if (errorResult instanceof Promise) {
                  promises.push(errorResult)
                }
              } catch (onErrorError) {
                console.error(`Plugin '${plugin.name}' onError hook also failed:`, onErrorError)
              }
            }
          }
        }
      }
    }

    if (promises.length > 0) {
      await Promise.allSettled(promises)
    }
  }

  /**
   * Validates a plugin configuration for required fields and format.
   *
   * @param config - The plugin configuration to validate
   * @throws {PluginError} When configuration is invalid
   * @private
   */
  private validatePluginConfig(config: PluginConfig): void {
    if (!config.name || typeof config.name !== 'string') {
      throw ErrorFactory.plugin('Plugin name is required and must be a string')
    }

    if (!config.version || typeof config.version !== 'string') {
      throw ErrorFactory.plugin('Plugin version is required and must be a string')
    }

    // Validate semantic versioning format
    const semverRegex =
      /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/
    if (!semverRegex.test(config.version)) {
      throw ErrorFactory.plugin(
        `Plugin version '${config.version}' is not a valid semantic version`,
      )
    }
  }

  // Helper methods for plugin developers
  /**
   * Retrieves all templates from installed plugins.
   *
   * @returns Array of all templates from all plugins
   */
  getAllTemplates(): any[] {
    const templates: any[] = []
    for (const plugin of this.plugins.values()) {
      if (plugin.templates) {
        templates.push(...plugin.templates)
      }
    }
    return templates
  }

  /**
   * Retrieves all validators from installed plugins.
   *
   * @returns Combined object of all validators from all plugins
   */
  getAllValidators(): Record<string, any> {
    const validators: Record<string, any> = {}
    for (const plugin of this.plugins.values()) {
      if (plugin.validators) {
        Object.assign(validators, plugin.validators)
      }
    }
    return validators
  }

  /**
   * Retrieves all themes from installed plugins.
   *
   * @returns Combined object of all themes from all plugins
   */
  getAllThemes(): Record<string, any> {
    const themes: Record<string, any> = {}
    for (const plugin of this.plugins.values()) {
      if (plugin.themes) {
        Object.assign(themes, plugin.themes)
      }
    }
    return themes
  }
}
