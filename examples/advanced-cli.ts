#!/usr/bin/env node

import { createCLI, defineTemplate, definePrompt, validators } from '../src/index.js';

// Advanced example with conditional prompts and custom validators
const advancedPrompts = [
  definePrompt({
    name: 'projectName',
    type: 'input',
    message: '📁 What is your project name?',
    validate: validators.projectName
  }),
  definePrompt({
    name: 'projectType',
    type: 'select',
    message: '🎯 What type of project?',
    choices: [
      { name: 'Web Application', value: 'web' },
      { name: 'API Server', value: 'api' },
      { name: 'Full Stack', value: 'fullstack' }
    ]
  }),
  definePrompt({
    name: 'framework',
    type: 'select',
    message: '⚡ Choose your frontend framework',
    when: (answers) => answers.projectType === 'web' || answers.projectType === 'fullstack',
    choices: [
      { name: 'React', value: 'react' },
      { name: 'Vue', value: 'vue' },
      { name: 'Svelte', value: 'svelte' }
    ]
  }),
  definePrompt({
    name: 'features',
    type: 'multiselect',
    message: '🔧 Select additional features',
    choices: [
      { name: 'TypeScript', value: 'typescript' },
      { name: 'ESLint', value: 'eslint' },
      { name: 'Prettier', value: 'prettier' },
      { name: 'Testing (Jest)', value: 'testing' },
      { name: 'Docker', value: 'docker' }
    ]
  }),
  definePrompt({
    name: 'author',
    type: 'input',
    message: '👤 Author name',
    default: 'Anonymous'
  }),
  definePrompt({
    name: 'license',
    type: 'select',
    message: '📄 Choose a license',
    choices: [
      { name: 'MIT', value: 'MIT' },
      { name: 'Apache 2.0', value: 'Apache-2.0' },
      { name: 'GPL v3', value: 'GPL-3.0' },
      { name: 'None', value: 'UNLICENSED' }
    ],
    default: 'MIT'
  })
];

const fullStackTemplate = defineTemplate({
  name: 'fullstack',
  description: 'Full Stack Application',
  files: [
    {
      path: 'README.md',
      content: (answers) => `# ${answers.projectName}

Created by ${answers.author}

## Features
${answers.features.map((f: string) => `- ${f}`).join('\n')}

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## License
${answers.license}
`
    },
    {
      path: 'package.json',
      content: (answers) => JSON.stringify({
        name: answers.projectName,
        version: '1.0.0',
        description: `${answers.projectName} - A full stack application`,
        author: answers.author,
        license: answers.license,
        scripts: {
          dev: 'echo "Development server starting..."',
          build: 'echo "Building project..."',
          test: answers.features.includes('testing') ? 'jest' : 'echo "No tests configured"'
        }
      }, null, 2)
    },
    {
      path: '.gitignore',
      content: `node_modules/
dist/
.env
.env.local
*.log`
    },
    {
      path: 'docker-compose.yml',
      condition: (answers) => answers.features.includes('docker'),
      content: (answers) => `version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules`
    },
    {
      path: 'Dockerfile',
      condition: (answers) => answers.features.includes('docker'),
      content: `FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]`
    }
  ],
  postInstall: async (projectPath, answers) => {
    console.log(`\n🎉 ${answers.projectName} has been created!`);
    console.log(`📁 Project type: ${answers.projectType}`);
    if (answers.framework) {
      console.log(`⚡ Framework: ${answers.framework}`);
    }
    console.log(`🔧 Features: ${answers.features.join(', ')}`);
  }
});

const cli = createCLI({
  name: 'advanced-cli',
  version: '2.0.0',
  description: 'Advanced CLI with conditional prompts and custom features',
  prompts: advancedPrompts,
  templates: [fullStackTemplate],
  allowModeSelection: true,
  customValidators: {
    customProjectName: {
      validate: (value: string) => {
        if (value.includes('test')) {
          return 'Project name cannot contain "test"';
        }
        return true;
      }
    }
  }
});

cli.parse();