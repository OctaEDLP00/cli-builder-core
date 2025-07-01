// Main API exports
export { CLIBuilder } from './core/cli-builder.js'
export { ProjectGenerator } from './core/project-generator.js'
export { ReadlineManager } from './core/readline-manager.js'
export { UIManager } from './core/ui-manager.js'
export { ValidationManager } from './core/validation-manager.js'

// Plugin System
export { PluginManager } from './plugins/plugin-manager.js'

// Error System
export {
  CLIError,
  ConfigurationError,
  DependencyError,
  ErrorFactory,
  FileSystemError,
  NetworkError,
  PluginError,
  ProcessError,
  ReadlineError,
  TemplateError,
  ValidationError,
} from './errors/index.js'

// Types
export type {
  CLIConfig,
  CLIErrorContext,
  GeneratorConfig,
  PluginAdapter,
  PluginConfig,
  PluginHooks,
  PromptConfig,
  PromptResult,
  PromptType,
  ReadlineMode,
  TemplateConfig,
  UITheme,
  ValidationRule,
} from './types/index.d.js'

// Utilities
export { createCLI, definePlugin, definePrompt, defineTemplate } from './utils/factory.js'
export { themes } from './utils/themes.js'
export { validators } from './utils/validators.js'
export { ensureDir, writeFile, writeJson } from './utils/fs.js'
