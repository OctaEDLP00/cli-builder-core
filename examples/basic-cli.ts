#!/usr/bin/env node

import { createCLI, defineTemplate, definePrompt, validators, themes } from '../src/index.js';

// Define templates
const reactTemplate = defineTemplate({
  name: 'react',
  description: 'React + Vite + TypeScript',
  files: [
    {
      path: 'index.html',
      content: (answers) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${answers.projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
    },
    {
      path: 'src/main.tsx',
      content: (answers) => `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`
    },
    {
      path: 'src/App.tsx',
      content: (answers) => `import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <h1>Welcome to ${answers.projectName}</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </div>
  )
}

export default App`
    },
    {
      path: 'src/App.css',
      content: `.App {
  text-align: center;
  padding: 2rem;
}

.card {
  padding: 2em;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  color: white;
  cursor: pointer;
  transition: border-color 0.25s;
}

button:hover {
  border-color: #646cff;
}`
    },
    {
      path: 'src/index.css',
      content: `body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
}

#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}`
    },
    {
      path: 'vite.config.ts',
      content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`
    },
    {
      path: 'tsconfig.json',
      content: JSON.stringify({
        compilerOptions: {
          target: 'ES2020',
          useDefineForClassFields: true,
          lib: ['ES2020', 'DOM', 'DOM.Iterable'],
          module: 'ESNext',
          skipLibCheck: true,
          moduleResolution: 'bundler',
          allowImportingTsExtensions: true,
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: true,
          jsx: 'react-jsx',
          strict: true,
          noUnusedLocals: true,
          noUnusedParameters: true,
          noFallthroughCasesInSwitch: true
        },
        include: ['src'],
        references: [{ path: './tsconfig.node.json' }]
      }, null, 2)
    }
  ],
  dependencies: {
    production: {
      'react': '^18.2.0',
      'react-dom': '^18.2.0'
    },
    development: {
      '@types/react': '^18.2.0',
      '@types/react-dom': '^18.2.0',
      '@vitejs/plugin-react': '^4.2.1',
      'typescript': '^5.0.0',
      'vite': '^5.0.0'
    }
  },
  scripts: {
    'dev': 'vite',
    'build': 'vite build',
    'preview': 'vite preview'
  }
});

const expressTemplate = defineTemplate({
  name: 'express',
  description: 'Express.js API with TypeScript',
  files: [
    {
      path: 'src/index.ts',
      content: (answers) => `import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ${answers.projectName} API!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
});`
    },
    {
      path: 'tsconfig.json',
      content: JSON.stringify({
        compilerOptions: {
          target: 'ES2022',
          module: 'ESNext',
          moduleResolution: 'Node',
          outDir: './dist',
          rootDir: './src',
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true
        },
        include: ['src/**/*'],
        exclude: ['node_modules', 'dist']
      }, null, 2)
    }
  ],
  dependencies: {
    production: {
      'express': '^4.18.0',
      'cors': '^2.8.5'
    },
    development: {
      '@types/express': '^4.17.0',
      '@types/cors': '^2.8.0',
      '@types/node': '^20.0.0',
      'typescript': '^5.0.0',
      'tsx': '^4.0.0'
    }
  },
  scripts: {
    'dev': 'tsx src/index.ts',
    'build': 'tsc',
    'start': 'node dist/index.js'
  }
});

// Define prompts
const prompts = [
  definePrompt({
    name: 'projectName',
    type: 'input',
    message: '📁 Project name',
    validate: validators.projectName
  }),
  definePrompt({
    name: 'template',
    type: 'select',
    message: '🎨 Choose a template',
    choices: [
      { name: 'React + Vite + TypeScript', value: 'react', description: 'Modern React setup' },
      { name: 'Express.js API', value: 'express', description: 'REST API with TypeScript' }
    ]
  }),
  definePrompt({
    name: 'installDeps',
    type: 'confirm',
    message: '📦 Install dependencies?',
    default: true
  })
];

// Create CLI
const cli = createCLI({
  name: 'my-framework-cli',
  version: '1.0.0',
  description: 'Create awesome projects with my framework',
  prompts,
  templates: [reactTemplate, expressTemplate],
  theme: themes.vibrant,
  allowModeSelection: true,
  readlineMode: 'async'
});

// Run CLI
cli.parse();