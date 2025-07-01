export type ReadlineMode = 'async' | 'sync'
export type PromptType = 'input' | 'select' | 'confirm' | 'multiselect'

export interface ShowWelcomeOptions {
  message: string
}

export interface PromptConfig {
  name: string
  type: PromptType
  message: string
  default?: unknown
  choices?: Array<{ name: string; value: unknown; description?: string }>
  validate?: ValidationRule
  when?: (answers: Record<string, unknown>) => boolean
  transform?: (value: unknown) => unknown
}

export interface Files {
  path: string
  content: string | ((answers: Record<string, unknown>) => string)
  condition?: (answers: Record<string, unknown>) => boolean
}

export type Version =
  | `${number}.${number}.${number}`
  | `^${number}.${number}.${number}`
  | `~${number}.${number}.${number}`

export interface Dependencies {
  dependencies?: Record<string, Version>
  devDepencies?: Record<string, Version>
  peerDependencies?: Record<string, Version>
}

export interface TemplateConfig {
  name: string
  description: string
  files: Array<Files>
  dependencies?: Dependencies
  scripts?: Record<string, string>
  postInstall?: (projectPath: string, answers: Record<string, unknown>) => Promise<void>
}

export interface CLIConfig {
  name: string
  version: string
  description: string
  prompts: Array<PromptConfig>
  templates: Array<TemplateConfig>
  theme?: UITheme
  readlineMode?: ReadlineMode
  allowModeSelection?: boolean
  skipInstall?: boolean
  customValidators?: Record<string, ValidationRule>
  plugins?: Array<PluginConfig>
}

export interface ValidationRule {
  validate: (value: unknown, answers?: Record<string, unknown>) => boolean | string
  message?: string
}

type Color = `#${string}`

export interface UITheme {
  primary: Color
  secondary: Color
  success: Color
  error: Color
  warning: Color
  info: Color
  muted: Color
}

export interface GeneratorConfig {
  projectName: string
  template: string
  answers: Record<string, unknown>
  outputPath: string
}

export interface PromptResult {
  [key: string]: unknown
}

// Plugin System Types
export interface PluginConfig {
  name: string
  version: string
  description?: string
  hooks?: PluginHooks
  templates?: Array<TemplateConfig>
  validators?: Record<string, ValidationRule>
  themes?: Record<string, UITheme>
}

export interface PluginHooks {
  beforeGenerate?: (config: GeneratorConfig) => Promise<void> | void
  afterGenerate?: (config: GeneratorConfig, projectPath: string) => Promise<void> | void
  beforeInstall?: (projectPath: string) => Promise<void> | void
  afterInstall?: (projectPath: string) => Promise<void> | void
  onError?: (error: Error, context: string) => Promise<void> | void
}

export interface PluginAdapter {
  name: string
  version: string
  install(config: PluginConfig): Promise<void>
  uninstall(name: string): Promise<void>
  getPlugin(name: string): PluginConfig | undefined
  listPlugins(): Array<PluginConfig>
  executeHook(hookName: keyof PluginHooks, ...args: Array<any>): Promise<void>
}

// Custom Error Types
export interface CLIErrorContext {
  operation?: string
  projectName?: string
  template?: string
  filePath?: string
  additionalInfo?: Record<string, any>
}

interface Json {
  name: string
  message: string
  code: string
  context: CLIErrorContext
  timestamp: Date
  stack?: string
}
