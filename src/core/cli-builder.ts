import { white, gray } from 'picocolors'
import { Command } from 'commander'
import type {
  CLIConfig,
  GeneratorConfig,
  PromptConfig,
  PromptResult,
  ReadlineMode,
} from '../types/index.d.js'
import { ProjectGenerator } from './project-generator.js'
import { ReadlineManager } from './readline-manager.js'
import { UIManager } from './ui-manager.js'
import { ValidationManager } from './validation-manager.js'

/**
 * Main CLI Builder class for creating interactive command-line interfaces.
 *
 * @example
 * ```typescript
 * const cli = new CLIBuilder({
 *   name: 'my-cli',
 *   version: '1.0.0',
 *   description: 'My awesome CLI',
 *   prompts: [...],
 *   templates: [...]
 * });
 *
 * cli.parse();
 * ```
 */
export class CLIBuilder {
  private config: CLIConfig
  private readlineManager: ReadlineManager
  private projectGenerator: ProjectGenerator
  private uiManager: UIManager
  private validationManager: ValidationManager
  private program: Command

  /**
   * Creates a new CLIBuilder instance.
   *
   * @param config - The CLI configuration object
   */
  constructor(config: CLIConfig) {
    this.config = config
    this.readlineManager = new ReadlineManager()
    this.projectGenerator = new ProjectGenerator()
    this.uiManager = new UIManager(config.theme)
    this.validationManager = new ValidationManager(config.customValidators)
    this.program = new Command()

    this.setupCommands()
  }

  /**
   * Sets up the commander.js commands and options.
   *
   * @private
   */
  private setupCommands(): void {
    this.program
      .name(this.config.name)
      .description(this.config.description)
      .version(this.config.version)

    this.program
      .argument('[project-name]', 'Project name')
      .option('-t, --template <template>', 'Template to use')
      .option('-y, --yes', 'Skip prompts and use defaults')
      .option('--async', 'Use async readline mode')
      .option('--sync', 'Use sync readline mode')
      .action(async (projectName, options) => {
        await this.run(projectName, options)
      })
  }

  /**
   * Runs the CLI with the provided project name and options.
   *
   * @param projectName - Optional project name
   * @param options - Command line options
   * @throws {Error} When validation fails or project generation fails
   */
  async run(projectName?: string, options: any = {}): Promise<void> {
    try {
      this.uiManager.showWelcome(this.config.name)

      // Determine readline mode
      const mode = this.determineReadlineMode(options)
      this.readlineManager.setMode(mode)

      // Collect answers through prompts
      const answers = await this.collectAnswers(projectName, options)

      // Validate final answers
      const validation = this.validationManager.validateAnswers(answers)
      if (!validation.valid) {
        this.uiManager.showError(validation.message || 'Validation failed')
        process.exit(1)
      }

      // Generate project
      await this.generateProject(answers)

      this.uiManager.showSuccess('Project created successfully!')
      this.showNextSteps(answers)
    } catch (error) {
      this.uiManager.showError(`An error occurred: ${error}`)
      process.exit(1)
    }
  }

  /**
   * Determines the readline mode based on options and configuration.
   *
   * @param options - Command line options
   * @returns The readline mode to use
   * @private
   */
  private determineReadlineMode(options: any): ReadlineMode {
    if (options.async) return 'async'
    if (options.sync) return 'sync'
    if (this.config.readlineMode) return this.config.readlineMode
    return 'async' // default
  }

  /**
   * Collects answers from user prompts or uses provided defaults.
   *
   * @param projectName - Optional project name
   * @param options - Command line options
   * @returns Promise resolving to collected answers
   * @private
   */
  private async collectAnswers(projectName?: string, options: any = {}): Promise<PromptResult> {
    const answers: PromptResult = {}

    // Add project name if provided
    if (projectName) {
      answers.projectName = projectName
    }

    // Add template if provided via option
    if (options.template) {
      answers.template = options.template
    }

    // Skip prompts if --yes flag is used
    if (options.yes) {
      return this.fillDefaults(answers)
    }

    // Allow mode selection if enabled
    if (this.config.allowModeSelection && !options.async && !options.sync) {
      const mode = await this.askForReadlineMode()
      this.readlineManager.setMode(mode)
    }

    // Process each prompt
    for (const prompt of this.config.prompts) {
      // Skip if condition is not met
      if (prompt.when && !prompt.when(answers)) {
        continue
      }

      // Skip if already answered
      if (answers[prompt.name] !== undefined) {
        continue
      }

      const answer = await this.processPrompt(prompt, answers)
      answers[prompt.name] = prompt.transform ? prompt.transform(answer) : answer
    }

    return answers
  }

  /**
   * Asks the user to choose between async and sync readline modes.
   *
   * @returns Promise resolving to the selected readline mode
   * @private
   */
  private async askForReadlineMode(): Promise<ReadlineMode> {
    this.uiManager.showInfo('Choose readline implementation:')
    console.log('1. Async - Recommended')
    console.log('2. Sync\n')

    const choice = await this.readlineManager.question('Select option (1-2): ')
    return choice.trim() === '2' ? 'sync' : 'async'
  }

  /**
   * Processes a single prompt and returns the user's answer.
   *
   * @param prompt - The prompt configuration
   * @param answers - Previously collected answers
   * @returns Promise resolving to the user's answer
   * @throws {Error} When prompt type is unsupported
   * @private
   */
  private async processPrompt(prompt: PromptConfig, answers: PromptResult): Promise<any> {
    switch (prompt.type) {
      case 'input':
        return await this.handleInputPrompt(prompt, answers)
      case 'select':
        return await this.handleSelectPrompt(prompt, answers)
      case 'confirm':
        return await this.handleConfirmPrompt(prompt, answers)
      case 'multiselect':
        return await this.handleMultiSelectPrompt(prompt, answers)
      default:
        throw new Error(`Unsupported prompt type: ${prompt.type}`)
    }
  }

  /**
   * Handles input-type prompts with validation.
   *
   * @param prompt The input prompt configuration
   * @param answers Previously collected answers
   * @returns Promise resolving to the validated input
   * @private
   */
  private async handleInputPrompt(
    prompt: PromptConfig,
    answers: PromptResult,
  ): Promise<string | object> {
    let value: string | object = ''
    let isValid = false

    while (!isValid) {
      const defaultText = prompt.default ? ` (${prompt.default})` : ''
      value = await this.readlineManager.question(`${prompt.message}${defaultText}: `)

      if (!value && prompt.default) {
        value = prompt.default
      }

      if (prompt.validate) {
        const validation = prompt.validate.validate(value, answers)
        if (validation === true) {
          isValid = true
        } else {
          this.uiManager.showError(
            typeof validation === 'string'
              ? validation
              : prompt.validate.message || 'Invalid input',
          )
        }
      } else {
        isValid = true
      }
    }

    return value
  }

  /**
   * Handles select-type prompts with multiple choices.
   *
   * @param prompt - The select prompt configuration
   * @param answers - Previously collected answers
   * @returns Promise resolving to the selected value
   * @throws {Error} When choices are not provided
   * @private
   */
  private async handleSelectPrompt(prompt: PromptConfig, answers: PromptResult): Promise<any> {
    if (!prompt.choices) {
      throw new Error('Select prompt requires choices')
    }

    this.uiManager.showInfo(prompt.message)
    prompt.choices.forEach((choice, index) => {
      const description = choice.description ? ` - ${choice.description}` : ''
      console.log(`${index + 1}. ${choice.name}${description}`)
    })

    let isValid = false
    let selectedValue: any

    while (!isValid) {
      const answer = await this.readlineManager.question('\nSelect option: ')
      const index = parseInt(answer) - 1

      if (index >= 0 && index < prompt.choices.length) {
        selectedValue = prompt.choices[index].value
        isValid = true
      } else {
        this.uiManager.showError('Invalid selection. Please try again.')
      }
    }

    return selectedValue
  }

  /**
   * Handles confirm-type prompts (yes/no questions).
   *
   * @param prompt The confirm prompt configuration
   * @param answers Previously collected answers
   * @returns Promise resolving to boolean answer
   * @private
   */
  private async handleConfirmPrompt(prompt: PromptConfig, answers: PromptResult): Promise<boolean> {
    const defaultText =
      prompt.default !== undefined ? ` (${prompt.default ? 'Y/n' : 'y/N'})` : ' (y/N)'
    const answer = await this.readlineManager.question(`${prompt.message}${defaultText}: `)

    console.log({ answers })
    /**
     * TODO: Revisar ⬇
     */
    if (!answer && prompt.default != null) {
      prompt.default
    }

    return ['y', 'yes', 'true', '1'].includes(answer.toLowerCase())
  }

  /**
   * Handles multiselect-type prompts for selecting multiple options.
   *
   * @param prompt - The multiselect prompt configuration
   * @param answers - Previously collected answers
   * @returns Promise resolving to array of selected values
   * @throws {Error} When choices are not provided
   * @private
   */
  private async handleMultiSelectPrompt(
    prompt: PromptConfig,
    answers: PromptResult,
  ): Promise<Array<any>> {
    if (!prompt.choices) {
      throw new Error('MultiSelect prompt requires choices')
    }

    this.uiManager.showInfo(`${prompt.message} (comma-separated numbers)`)
    prompt.choices.forEach((choice, index) => {
      const description = choice.description ? ` - ${choice.description}` : ''
      console.log(`${index + 1}. ${choice.name}${description}`)
    })

    const answer = await this.readlineManager.question('\nSelect options: ')
    const indices = answer.split(',').map(s => parseInt(s.trim()) - 1)

    return indices
      .filter(index => index >= 0 && index < prompt.choices!.length)
      .map(index => prompt.choices![index].value)
  }

  /**
   * Fills in default values for prompts that weren't answered.
   *
   * @param answers - Partially filled answers object
   * @returns Complete answers object with defaults
   * @private
   */
  private fillDefaults(answers: PromptResult): PromptResult {
    const result = { ...answers }

    for (const prompt of this.config.prompts) {
      if (result[prompt.name] === undefined && prompt.default !== undefined) {
        result[prompt.name] = prompt.default
      }
    }

    return result
  }

  /**
   * Generates the project using the selected template and answers.
   *
   * @param answers - User answers from prompts
   * @throws {Error} When template is not found
   * @private
   */
  private async generateProject(answers: PromptResult): Promise<void> {
    const template = this.config.templates.find(t => t.name === answers.template)
    if (!template) {
      throw new Error(`Template '${answers.template}' not found`)
    }

    const config = {
      projectName: answers.projectName as string,
      template: answers.template as string,
      answers,
      outputPath: process.cwd(),
    } satisfies GeneratorConfig

    await this.projectGenerator.generate(template, config)
  }

  /**
   * Shows next steps to the user after project generation.
   *
   * @param answers - User answers containing project information
   * @private
   */
  private showNextSteps(answers: PromptResult): void {
    this.uiManager.showInfo('\nNext steps:')
    console.log(white(`  cd ${answers.projectName}`))

    if (!this.config.skipInstall) {
      console.log(white('  npm install'))
    }

    console.log(white('  npm run dev'))
    console.log(gray('\nHappy coding! 🚀\n'))
  }

  /**
   * Parses command line arguments and executes the CLI.
   *
   * @param argv - Optional command line arguments array
   */
  parse(argv?: string[]): void {
    this.program.parse(argv)
  }
}
