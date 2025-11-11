// Avoid importing specific colors from picocolors in this module to keep
// examples runnable in different environments. Use plain messages instead.
import { ensureDir, writeFile, writeJson } from '../utils/fs.js'
import { exec } from 'node:child_process'
import { dirname, join } from 'node:path'
import { promisify } from 'node:util'
import ora from 'ora'
import { ErrorFactory } from '../errors/index.js'
import type { GeneratorConfig, TemplateConfig } from '../types/index.d.js'

const execAsync = promisify(exec)

/**
 * Generates projects from templates with file creation and dependency management.
 * Handles the complete project generation lifecycle including file creation,
 * package.json generation, and dependency installation.
 *
 * @example
 * ```typescript
 * const generator = new ProjectGenerator();
 * await generator.generate(template, {
 *   projectName: 'my-app',
 *   template: 'react',
 *   answers: userAnswers,
 *   outputPath: process.cwd()
 * });
 * ```
 */
export class ProjectGenerator {
  /**
   * Generates a complete project from a template configuration.
   *
   * @param template - The template configuration to use
   * @param config - The generator configuration with project details
   * @throws {FileSystemError} When file operations fail
   * @throws {DependencyError} When dependency installation fails
   */
  async generate(template: TemplateConfig, config: GeneratorConfig): Promise<void> {
    const projectPath = join(config.outputPath, config.projectName)

    try {
      // Create project directory
      await ensureDir(projectPath)

      // Generate files
      await this.generateFiles(template, config, projectPath)

      // Generate package.json
      await this.generatePackageJson(template, config, projectPath)

      // Install dependencies only if template has dependencies AND user wants them installed
      if (template.dependencies && config.answers.installDeps !== false) {
        await this.installDependencies(projectPath)
      }

      // Run post-install hook
      if (template.postInstall) {
        await template.postInstall(projectPath, config.answers)
      }
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorFactory.filesystem(`Failed to generate project: ${error.message}`, {
          operation: 'generate',
          projectName: config.projectName,
          template: config.template,
        })
      }
      throw error
    }
  }

  /**
   * Generates all project files from the template configuration.
   *
   * @param template - The template configuration
   * @param config - The generator configuration
   * @param projectPath - The target project directory path
   * @throws {FileSystemError} When file creation fails
   * @private
   */
  private async generateFiles(
    template: TemplateConfig,
    config: GeneratorConfig,
    projectPath: string,
  ): Promise<void> {
    const spinner = ora('Generating project files...').start()

    try {
      for (const file of template.files) {
        // Check condition
        if (file.condition && !file.condition(config.answers)) {
          continue
        }

        const filePath = join(projectPath, file.path)
        const content =
          typeof file.content === 'function' ? file.content(config.answers) : file.content

        // Ensure directory exists
        await ensureDir(dirname(filePath))

        // Write file
        await writeFile(filePath, content)
      }

      spinner.succeed('Project files generated')
    } catch (error) {
      spinner.fail('Failed to generate project files')
      if (error instanceof Error) {
        throw ErrorFactory.filesystem(`Failed to generate files: ${error.message}`, {
          operation: 'generateFiles',
          projectName: config.projectName,
          template: config.template,
        })
      }
      throw error
    }
  }

  /**
   * Generates the package.json file with dependencies and scripts.
   *
   * @param template The template configuration
   * @param config The generator configuration
   * @param projectPath The target project directory path
   * @throws {FileSystemError} When package.json creation fails
   * @private
   */
  private async generatePackageJson(
    template: TemplateConfig,
    config: GeneratorConfig,
    projectPath: string,
  ): Promise<void> {
    try {
      const packageJson = {
        name: config.projectName,
        version: '0.1.0',
        private: true,
        scripts: template.scripts || {},
        dependencies: template.dependencies?.dependencies || {},
        devDependencies: template.dependencies?.devDepencies || {},
        peerDependencies: template.dependencies?.peerDependencies || {},
      }

      await writeJson(join(projectPath, 'package.json'), packageJson, { spaces: 2 })
    } catch (error) {
      if (error instanceof Error) {
        throw ErrorFactory.filesystem(`Failed to generate package.json: ${error.message}`, {
          operation: 'generatePackageJson',
          projectName: config.projectName,
          filePath: join(projectPath, 'package.json'),
        })
      }
      throw error
    }
  }

  /**
   * Installs project dependencies using npm.
   *
   * @param projectPath The project directory path
   * @throws {DependencyError} When dependency installation fails
   * @private
   */
  private async installDependencies(projectPath: string): Promise<void> {
    const spinner = ora('Installing dependencies...').start()

    try {
      await execAsync('npm install', { cwd: projectPath })
      spinner.succeed('Dependencies installed successfully')
    } catch (error) {
      spinner.fail('Failed to install dependencies')

      if (error instanceof Error) {
        throw ErrorFactory.dependency(`Failed to install dependencies: ${error.message}`, {
          operation: 'installDependencies',
          filePath: projectPath,
        })
      }

      console.log('You can install them manually later with: npm install')
    }
  }
}
