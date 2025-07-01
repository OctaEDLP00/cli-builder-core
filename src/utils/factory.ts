import { CLIBuilder } from '../core/cli-builder.js'
import { PluginManager } from '../plugins/plugin-manager.js'
import type { CLIConfig, PluginConfig, PromptConfig, TemplateConfig } from '../types/index.d.js'

/**
 * Creates a new CLI instance with the provided configuration.
 * Automatically initializes the plugin system if plugins are provided.
 *
 * @param config - The CLI configuration object
 * @returns A new CLIBuilder instance
 *
 * @example
 * ```typescript
 * const cli = createCLI({
 *   name: 'my-cli',
 *   version: '1.0.0',
 *   description: 'My awesome CLI',
 *   prompts: [...],
 *   templates: [...],
 *   plugins: [myPlugin]
 * });
 *
 * cli.parse();
 * ```
 */
export function createCLI(config: CLIConfig): CLIBuilder {
  const cli = new CLIBuilder(config)

  // Initialize plugin system if plugins are provided
  if (config.plugins && config.plugins.length > 0) {
    const pluginManager = new PluginManager()

    // Install all plugins
    config.plugins.forEach(async plugin => {
      try {
        await pluginManager.install(plugin)
      } catch (error) {
        console.warn(`Failed to install plugin '${plugin.name}':`, error)
      }
    })
  }

  return cli
}

/**
 * Defines a template configuration with type safety.
 * This is a helper function that provides better TypeScript support.
 *
 * @param config - The template configuration
 * @returns The same template configuration (for type safety)
 *
 * @example
 * ```typescript
 * const reactTemplate = defineTemplate({
 *   name: 'react',
 *   description: 'React + Vite + TypeScript',
 *   files: [...],
 *   dependencies: {...}
 * });
 * ```
 */
export function defineTemplate(config: TemplateConfig): TemplateConfig {
  return config
}

/**
 * Defines a prompt configuration with type safety.
 * This is a helper function that provides better TypeScript support.
 *
 * @param config - The prompt configuration
 * @returns The same prompt configuration (for type safety)
 *
 * @example
 * ```typescript
 * const namePrompt = definePrompt({
 *   name: 'projectName',
 *   type: 'input',
 *   message: 'Project name',
 *   validate: validators.projectName
 * });
 * ```
 */
export function definePrompt(config: PromptConfig): PromptConfig {
  return config
}

/**
 * Defines a plugin configuration with type safety.
 * This is a helper function that provides better TypeScript support.
 *
 * @param config - The plugin configuration
 * @returns The same plugin configuration (for type safety)
 *
 * @example
 * ```typescript
 * const myPlugin = definePlugin({
 *   name: 'my-plugin',
 *   version: '1.0.0',
 *   hooks: {
 *     beforeGenerate: async (config) => { ... }
 *   },
 *   templates: [...],
 *   validators: {...}
 * });
 * ```
 */
export function definePlugin(config: PluginConfig): PluginConfig {
  return config
}
