/**
 * Processes React/Next.js code to make it compatible with browser-based React
 */
export function processCodeForPreview(code: string): string {
  let processedCode = code

  // Remove 'use client' directive
  processedCode = processedCode.replace(/'use client'/, "")

  // Remove TypeScript interfaces and types
  processedCode = processedCode
    .replace(/interface\s+\w+\s*\{[\s\S]*?\}/g, "// TypeScript interface removed")
    .replace(/type\s+\w+\s*=[\s\S]*?;/g, "// TypeScript type removed")
    .replace(/:\s*\w+(\[\])?(,|\)|\s|=)/g, "$2") // Remove type annotations
    .replace(/<\w+>/g, "") // Remove generic type parameters
    .replace(/export\s+interface\s+\w+\s*\{[\s\S]*?\}/g, "// TypeScript interface removed")
    .replace(/export\s+type\s+\w+\s*=[\s\S]*?;/g, "// TypeScript type removed")
    .replace(/\s+as\s+\w+/g, "") // Remove type assertions

  // Remove Next.js imports
  processedCode = processedCode
    .replace(/import\s+.*?from\s+['"]next\/link['"]/g, "// Next.js Link import removed")
    .replace(/import\s+.*?from\s+['"]next\/image['"]/g, "// Next.js Image import removed")
    .replace(/import\s+.*?from\s+['"]@\/components\/ui\/.*?['"]/g, "// shadcn import removed")

  // Add React import if not present
  if (!processedCode.includes("import React")) {
    processedCode = "import React, { useState, useEffect, useRef } from 'react';\n\n" + processedCode
  }

  // Replace export default function Name with function App
  if (processedCode.includes("export default function")) {
    processedCode = processedCode.replace(/export default function\s+\w+/, "function App")
    // Add export at the end
    processedCode += "\n\nexport default App;"
  } else if (!processedCode.includes("export default")) {
    // If there's no export default, add it
    processedCode += "\n\nexport default App;"
  }

  return processedCode
}

// Prepare files for Sandpack
export function prepareFilesForSandpack(files: { name: string; content: string }[]): Record<string, string> {
  const sandpackFiles: Record<string, string> = {}

  // Find the main component file
  const mainFile =
    files.find(
      (file) => file.name.includes("page.tsx") || file.name.includes("Page.tsx") || file.name.includes("index.tsx"),
    ) || files[0]

  // Process the main file
  const processedMainContent = processCodeForPreview(mainFile.content)
  sandpackFiles["/App.js"] = processedMainContent

  // Add any additional component files
  files.forEach((file, index) => {
    if (index === 0) return // Skip the main file as we've already processed it

    if (file.name.includes(".css")) {
      // Add CSS file
      sandpackFiles["/styles.css"] = file.content
    } else if (file.name.includes(".jsx") || file.name.includes(".tsx")) {
      // Process component files
      let componentContent = file.content

      // Remove TypeScript and Next.js specific code
      componentContent = componentContent
        .replace(/'use client'/, "")
        .replace(/interface\s+\w+\s*\{[\s\S]*?\}/g, "// TypeScript interface removed")
        .replace(/type\s+\w+\s*=[\s\S]*?;/g, "// TypeScript type removed")
        .replace(/:\s*\w+(\[\])?(,|\)|\s|=)/g, "$2")
        .replace(/<\w+>/g, "")
        .replace(/export\s+interface\s+\w+\s*\{[\s\S]*?\}/g, "// TypeScript interface removed")
        .replace(/export\s+type\s+\w+\s*=[\s\S]*?;/g, "// TypeScript type removed")
        .replace(/\s+as\s+\w+/g, "")
        .replace(/import\s+.*?from\s+['"]next\/link['"]/g, "// Next.js Link import removed")
        .replace(/import\s+.*?from\s+['"]next\/image['"]/g, "// Next.js Image import removed")
        .replace(/import\s+.*?from\s+['"]@\/components\/ui\/.*?['"]/g, "// shadcn import removed")

      // Add React import if not present
      if (!componentContent.includes("import React")) {
        componentContent = "import React from 'react';\n\n" + componentContent
      }

      // Extract component name from file name
      const fileName = file.name.split("/").pop() || "Component"
      const componentName = fileName.split(".")[0].replace(/[^a-zA-Z0-9]/g, "")

      // Add to files
      sandpackFiles[`/components/${componentName}.js`] = componentContent
    }
  })

  return sandpackFiles
}

// Convert parsed files to Vite template format
export function prepareFilesForVite(files: { name: string; content: string }[], projectName: string) {
  const viteFiles: { name: string; content: string }[] = []

  // Add the Vite template files
  viteFiles.push({
    name: "index.html",
    content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`,
  })

  viteFiles.push({
    name: "vite.config.js",
    content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      overlay: false,
    },
  },
})`,
  })

  viteFiles.push({
    name: "package.json",
    content: `{
  "name": "${projectName.toLowerCase().replace(/\s+/g, "-")}",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.14",
    "eslint": "^8.45.0",
    "eslint-plugin-react": "^7.32.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "postcss": "^8.4.27",
    "tailwindcss": "^3.3.3",
    "vite": "^4.4.5"
  }
}`,
  })

  viteFiles.push({
    name: "tailwind.config.js",
    content: `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`,
  })

  viteFiles.push({
    name: "postcss.config.js",
    content: `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,
  })

  viteFiles.push({
    name: "src/index.css",
    content: `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}`,
  })

  viteFiles.push({
    name: "src/main.jsx",
    content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
  })

  // Find the main component file
  const mainFile =
    files.find(
      (file) => file.name.includes("page.tsx") || file.name.includes("Page.tsx") || file.name.includes("index.tsx"),
    ) || files[0]

  // Process the content to make it compatible with Vite + React
  let processedContent = mainFile.content

  // Remove 'use client' directive
  processedContent = processedContent.replace(/'use client'/, "")

  // Remove TypeScript interfaces and types
  processedContent = processedContent
    .replace(/interface\s+\w+\s*\{[\s\S]*?\}/g, "// TypeScript interface removed")
    .replace(/type\s+\w+\s*=[\s\S]*?;/g, "// TypeScript type removed")
    .replace(/:\s*\w+(\[\])?(,|\)|\s|=)/g, "$2") // Remove type annotations
    .replace(/<\w+>/g, "") // Remove generic type parameters
    .replace(/export\s+interface\s+\w+\s*\{[\s\S]*?\}/g, "// TypeScript interface removed")
    .replace(/export\s+type\s+\w+\s*=[\s\S]*?;/g, "// TypeScript type removed")
    .replace(/\s+as\s+\w+/g, "") // Remove type assertions

  // Remove Next.js imports
  processedContent = processedContent
    .replace(/import\s+.*?from\s+['"]next\/link['"]/g, "// Next.js Link import removed")
    .replace(/import\s+.*?from\s+['"]next\/image['"]/g, "// Next.js Image import removed")
    .replace(/import\s+.*?from\s+['"]@\/components\/ui\/.*?['"]/g, "// shadcn import removed")
    .replace(/import\s+.*?from\s+['"]\.\/.+?['"]/g, "// Local import removed")
    .replace(/import\s+.*?from\s+['"]\.\.\/.*?['"]/g, "// Local import removed")

  // Add React import if not present
  if (!processedContent.includes("import React")) {
    processedContent = "import React, { useState, useEffect, useRef } from 'react';\n\n" + processedContent
  }

  // Replace export default function Name with function App
  if (processedContent.includes("export default function")) {
    processedContent = processedContent.replace(/export default function\s+\w+/, "function App")
    // Add export at the end
    processedContent += "\n\nexport default App;"
  } else if (!processedContent.includes("export default")) {
    // If there's no export default, add it
    processedContent += "\n\nexport default App;"
  }

  // Add the App.jsx file
  viteFiles.push({
    name: "src/App.jsx",
    content: processedContent,
  })

  // Add any additional components or CSS files
  files.forEach((file, index) => {
    if (index === 0) return // Skip the main file as we've already processed it

    if (file.name.includes(".css")) {
      // Add CSS file to src directory
      viteFiles.push({
        name: "src/styles.css",
        content: file.content,
      })

      // Update main.jsx to import the CSS
      const mainJsxFile = viteFiles.find((f) => f.name === "src/main.jsx")
      if (mainJsxFile && !mainJsxFile.content.includes("import './styles.css'")) {
        mainJsxFile.content = mainJsxFile.content.replace(
          "import './index.css'",
          "import './index.css'\nimport './styles.css'",
        )
      }
    } else if (file.name.includes(".jsx") || file.name.includes(".tsx")) {
      // Process component files
      let componentContent = file.content

      // Remove TypeScript and Next.js specific code
      componentContent = componentContent
        .replace(/'use client'/, "")
        .replace(/interface\s+\w+\s*\{[\s\S]*?\}/g, "// TypeScript interface removed")
        .replace(/type\s+\w+\s*=[\s\S]*?;/g, "// TypeScript type removed")
        .replace(/:\s*\w+(\[\])?(,|\)|\s|=)/g, "$2")
        .replace(/<\w+>/g, "")
        .replace(/export\s+interface\s+\w+\s*\{[\s\S]*?\}/g, "// TypeScript interface removed")
        .replace(/export\s+type\s+\w+\s*=[\s\S]*?;/g, "// TypeScript type removed")
        .replace(/\s+as\s+\w+/g, "")
        .replace(/import\s+.*?from\s+['"]next\/link['"]/g, "// Next.js Link import removed")
        .replace(/import\s+.*?from\s+['"]next\/image['"]/g, "// Next.js Image import removed")
        .replace(/import\s+.*?from\s+['"]@\/components\/ui\/.*?['"]/g, "// shadcn import removed")

      // Add React import if not present
      if (!componentContent.includes("import React")) {
        componentContent = "import React from 'react';\n\n" + componentContent
      }

      // Extract component name from file name
      const fileName = file.name.split("/").pop() || "Component"
      const componentName = fileName.split(".")[0].replace(/[^a-zA-Z0-9]/g, "")

      // Add to files
      viteFiles.push({
        name: `src/components/${componentName}.jsx`,
        content: componentContent,
      })
    }
  })

  return viteFiles
}
