# CLI Builder API

A powerful TypeScript library for building modern CLI installers and generators, similar to those used by popular frameworks like Next.js, Vite, or Astro.

## Features

- 🚀 **Dual Readline Support**: Both `node:readline` (sync) and `node:readline/promises` (async)
- 🎨 **Rich UI Components**: Colored output, spinners, progress bars
- 📝 **Multiple Prompt Types**: Input, select, confirm, multiselect
- 🎯 **Conditional Logic**: Show/hide prompts based on previous answers
- 🔧 **Template System**: Flexible file generation with conditions
- ✅ **Built-in Validators**: Common validation patterns included
- 🎨 **Theming Support**: Customizable color schemes
- 📦 **Dependency Management**: Automatic package.json generation and npm install

## Installation

```bash
npm install @cli-builder/core
```

## Quick Start

```typescript
import { createCLI, defineTemplate, definePrompt, validators } from '@cli-builder/core';

// Define a template
const reactTemplate = defineTemplate({
  name: 'react',
  description: 'React + Vite + TypeScript',
  files: [
    {
      path: 'src/App.tsx',
      content: (answers) => `
        function App() {
          return <h1>Welcome to ${answers.projectName}!</h1>
        }
        export default App;
      `
    }
  ],
  dependencies: {
    production: { 'react': '^18.2.0' },
    development: { 'vite': '^5.0.0' }
  }
});

// Define prompts
const prompts = [
  definePrompt({
    name: 'projectName',
    type: 'input',
    message: 'Project name',
    validate: validators.projectName
  }),
  definePrompt({
    name: 'template',
    type: 'select',
    message: 'Choose template',
    choices: [
      { name: 'React', value: 'react' }
    ]
  })
];

// Create and run CLI
const cli = createCLI({
  name: 'my-cli',
  version: '1.0.0',
  description: 'My awesome CLI',
  prompts,
  templates: [reactTemplate]
});

cli.parse();
```

## API Reference

### Core Classes

#### `CLIBuilder`
Main class for building CLI applications.

#### `ReadlineManager`
Handles both sync and async readline operations.

#### `ProjectGenerator`
Generates project files and manages dependencies.

#### `UIManager`
Provides colored output and UI components.

### Factory Functions

#### `createCLI(config: CLIConfig)`
Creates a new CLI instance.

#### `defineTemplate(config: TemplateConfig)`
Defines a project template.

#### `definePrompt(config: PromptConfig)`
Defines a user prompt.

### Built-in Validators

- `validators.required` - Ensures field is not empty
- `validators.projectName` - Validates project naming conventions
- `validators.email` - Email format validation
- `validators.minLength(n)` - Minimum length validation
- `validators.maxLength(n)` - Maximum length validation

### Themes

- `themes.default` - Default blue theme
- `themes.dark` - Dark mode theme
- `themes.minimal` - Minimal black/white theme
- `themes.vibrant` - Colorful theme

## Examples

See the `examples/` directory for complete examples:

- `basic-cli.ts` - Simple CLI with React and Express templates
- `advanced-cli.ts` - Advanced CLI with conditional prompts and features

## Usage Patterns

### Conditional Prompts

```typescript
definePrompt({
  name: 'framework',
  type: 'select',
  message: 'Choose framework',
  when: (answers) => answers.projectType === 'frontend',
  choices: [...]
})
```

### File Conditions

```typescript
{
  path: 'docker-compose.yml',
  condition: (answers) => answers.features.includes('docker'),
  content: '...'
}
```

### Custom Validators

```typescript
const cli = createCLI({
  // ...
  customValidators: {
    noTestInName: {
      validate: (value) => !value.includes('test') || 'Cannot contain "test"'
    }
  }
});
```

### Post-Install Hooks

```typescript
const template = defineTemplate({
  // ...
  postInstall: async (projectPath, answers) => {
    // Custom logic after project generation
    console.log('Running custom setup...');
  }
});
```

## License

MIT
