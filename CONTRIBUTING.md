# Contributing to CLI Builder

Thank you for your interest in contributing to CLI Builder! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Contributing Guidelines](#contributing-guidelines)
- [Plugin Development](#plugin-development)
- [Testing](#testing)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)

## Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow. Please be respectful and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, bun
- TypeScript knowledge
- Git

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/cli-builder.git
   cd cli-builder
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build the Project**
   ```bash
   npm run build
   ```

4. **Run Examples**
   ```bash
   npm run example:basic
   npm run example:advanced
   ```

## Project Structure

```
src/
├── core/                # Core CLI functionality
│   ├── cli-builder.ts   # Main CLI builder class
│   ├── readline-manager.ts
│   ├── project-generator.ts
│   ├── ui-manager.ts
│   └── validation-manager.ts
├── plugins/             # Plugin system
│   └── plugin-manager.ts
├── errors/              # Error handling system
│   └── index.ts
├── types/               # TypeScript type definitions
│   └── index.d.ts
├── utils/               # Utility functions
│   ├── factory.ts
│   ├── validators.ts
│   ├── themes.ts
│   └── helpers.ts
└── index.ts            # Main exports

examples/               # Example implementations
├── basic-cli.ts
├── advanced-cli.ts
└── plugin-example.ts

dist/                   # Compiled JavaScript output
```

## Contributing Guidelines

### Code Style

- **TypeScript**: All code must be written in TypeScript
- **ESLint**: Follow the project's ESLint configuration
- **Formatting**: Use consistent formatting (we recommend Prettier)
- **JSDoc**: All public APIs must have comprehensive JSDoc comments

### Naming Conventions

- **Files**: Use kebab-case for file names (`my-component.ts`)
- **Classes**: Use PascalCase (`MyClass`)
- **Functions**: Use camelCase (`myFunction`)
- **Constants**: Use UPPER_SNAKE_CASE (`MY_CONSTANT`)
- **Interfaces**: Use PascalCase with descriptive names (`UserConfig`)

### Commit Messages

Follow conventional commit format:

> type(scope): description
>
> optional body
>
> optional footer

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test additions or modifications
- `chore`: Maintenance tasks

Examples:
```
feat(plugins): add plugin validation system
```
```
fix(readline): handle EOF correctly in sync mode
```
```
docs(readme): update plugin examples
```

## Plugin Development

### Creating a Plugin

1. **Define Plugin Structure**
    ```typescript
    import { definePlugin } from '@cli-builder/core';

    export const myPlugin = definePlugin({
      name: 'my-plugin',
      version: '1.0.0',
      description: 'My awesome plugin',
      hooks: {
        // Lifecycle hooks
      },
      templates: [
        // Custom templates
      ],
      validators: {
        // Custom validators
      },
      themes: {
        // Custom themes
      }
    });
    ```

2. **Implement Hooks**
    ```typescript
    hooks: {
      beforeGenerate: async (config) => {
        // Pre-generation logic
      },
      afterGenerate: async (config, projectPath) => {
        // Post-generation logic
      },
      onError: async (error, context) => {
        // Error handling
      }
    }
    ```

3. **Add Templates**
    ```typescript
    templates: [
      defineTemplate({
        name: 'my-template',
        description: 'Custom template',
        files: [
          {
            path: 'src/component.tsx',
            content: (answers) => `// Generated content`
          }
        ]
      })
    ]
    ```

### Plugin Guidelines

- **Semantic Versioning**: Use semantic versioning for plugin versions
- **Error Handling**: Always handle errors gracefully
- **Documentation**: Document all plugin features and APIs
- **Testing**: Include tests for plugin functionality
- **Dependencies**: Minimize external dependencies

## Testing

### Running Tests

```bash
npm test
```

### Test Structure

- **Unit Tests**: Test individual functions and classes
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete CLI workflows

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest';
import { MyClass } from '../src/my-class';

describe('MyClass', () => {
  it('should do something', () => {
    const instance = new MyClass();
    expect(instance.method()).toBe('expected');
  });
});
```

## Documentation

### JSDoc Requirements

All public APIs must have comprehensive JSDoc comments:

```typescript
/**
 * Creates a new CLI instance with the provided configuration.
 *
 * @param config - The CLI configuration object
 * @returns A new CLIBuilder instance
 *
 * @example
 * ```typescript
 * const cli = createCLI({
 *   name: 'my-cli',
 *   version: '1.0.0',
 *   prompts: [...]
 * });
 * ```
 */
export function createCLI(config: CLIConfig): CLIBuilder {
  // Implementation
}
```

### Documentation Guidelines

- **Clear Descriptions**: Write clear, concise descriptions
- **Examples**: Include practical examples
- **Parameters**: Document all parameters with types
- **Return Values**: Document return types and meanings
- **Throws**: Document possible exceptions

## Pull Request Process

### Before Submitting

1. **Fork the Repository**
2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/my-new-feature
   ```

3. **Make Changes**
   - Write code following project conventions
   - Add tests for new functionality
   - Update documentation as needed

4. **Test Your Changes**
   ```bash
   npm run build
   npm test
   npm run example:basic
   ```

5. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

### Submitting the PR

1. **Push to Your Fork**
   ```bash
   git push origin feature/my-new-feature
   ```

2. **Create Pull Request**
   - Use a descriptive title
   - Provide detailed description
   - Reference related issues
   - Include screenshots if applicable

3. **PR Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Tests pass
   - [ ] New tests added
   - [ ] Manual testing completed

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   ```

### Review Process

1. **Automated Checks**: CI/CD pipeline runs tests
2. **Code Review**: Maintainers review code
3. **Feedback**: Address review comments
4. **Approval**: Get approval from maintainers
5. **Merge**: Maintainer merges the PR

## Release Process

### Version Bumping

We use semantic versioning:
- **Patch** (1.0.1): Bug fixes
- **Minor** (1.1.0): New features (backward compatible)
- **Major** (2.0.0): Breaking changes

### Release Steps

1. **Update Version**
   ```bash
   npm version patch|minor|major
   ```

2. **Update Changelog**
   - Document all changes
   - Follow Keep a Changelog format

3. **Create Release**
   - Tag the release
   - Create GitHub release
   - Publish to npm

## Getting Help

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Discord**: Real-time chat (link in README)

### Issue Templates

When creating issues, use the appropriate template:

- **Bug Report**: For reporting bugs
- **Feature Request**: For suggesting new features
- **Plugin Request**: For requesting new plugins
- **Documentation**: For documentation improvements

### Questions

Before asking questions:

1. Check existing documentation
2. Search existing issues
3. Review examples in the repository

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

Thank you for contributing to CLI Builder! 🚀
