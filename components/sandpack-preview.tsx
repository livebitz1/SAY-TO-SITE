"use client"

import { useState } from "react"
import { SandpackProvider, SandpackPreview, SandpackCodeEditor } from "@codesandbox/sandpack-react"
import { atomDark } from "@codesandbox/sandpack-themes"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, Smartphone, Tablet, Monitor, Moon, Sun } from "lucide-react"

interface SandpackPreviewProps {
  files: Record<string, string>
  height?: string | number
  showCode?: boolean
  showTabs?: boolean
  showNavigator?: boolean
  showDeviceControls?: boolean
}

export function SandpackWebsitePreview({
  files,
  height = "600px",
  showCode = false,
  showTabs = true,
  showNavigator = true,
  showDeviceControls = true,
}: SandpackPreviewProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "code">(showCode ? "code" : "preview")
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Prepare the files for Sandpack
  const sandpackFiles: Record<string, { code: string }> = {}

  // Add default files if not provided
  if (!files["/App.js"] && !files["/src/App.js"]) {
    sandpackFiles["/App.js"] = {
      code: `export default function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">Hello from Sandpack!</h1>
        <p className="mt-2 text-gray-600">Edit the code to see changes in real-time.</p>
      </div>
    </div>
  );
}`,
    }
  }

  // Add the provided files
  Object.entries(files).forEach(([path, code]) => {
    sandpackFiles[path] = { code }
  })

  // Add index.js if not provided
  if (!files["/index.js"] && !files["/src/index.js"]) {
    sandpackFiles["/index.js"] = {
      code: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
    }
  }

  // Add styles.css if not provided
  if (!files["/styles.css"] && !files["/src/styles.css"]) {
    sandpackFiles["/styles.css"] = {
      code: `@import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

.dark-mode {
  filter: invert(1) hue-rotate(180deg);
}`,
    }
  }

  // Get viewport width based on device mode
  const getViewportWidth = () => {
    switch (viewMode) {
      case "mobile":
        return 375
      case "tablet":
        return 768
      case "desktop":
      default:
        return "100%"
    }
  }

  return (
    <div className="rounded-lg overflow-hidden border border-gray-700" style={{ height }}>
      <SandpackProvider
        theme={atomDark}
        template="react"
        files={sandpackFiles}
        customSetup={{
          dependencies: {
            react: "^18.2.0",
            "react-dom": "^18.2.0",
          },
        }}
        options={{
          classes: {
            "sp-wrapper": "!bg-transparent",
            "sp-layout": "!bg-transparent !border-none",
            "sp-stack": "!bg-transparent",
          },
        }}
      >
        {showNavigator && (
          <div className="flex items-center justify-between bg-gray-900 px-4 py-2 border-b border-gray-800">
            {showTabs && (
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as "preview" | "code")}
                className="w-auto"
              >
                <TabsList className="bg-gray-800/50 backdrop-blur-sm">
                  <TabsTrigger
                    value="preview"
                    className="data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-white"
                  >
                    Preview
                  </TabsTrigger>
                  <TabsTrigger
                    value="code"
                    className="data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-white"
                  >
                    Code
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}

            {showDeviceControls && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setViewMode("mobile")}
                  className={`h-8 w-8 p-0 ${viewMode === "mobile" ? "bg-[#d4af37]/20 text-[#d4af37]" : "text-gray-400"}`}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setViewMode("tablet")}
                  className={`h-8 w-8 p-0 ${viewMode === "tablet" ? "bg-[#d4af37]/20 text-[#d4af37]" : "text-gray-400"}`}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setViewMode("desktop")}
                  className={`h-8 w-8 p-0 ${viewMode === "desktop" ? "bg-[#d4af37]/20 text-[#d4af37]" : "text-gray-400"}`}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-gray-700 mx-1" />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`h-8 w-8 p-0 ${isDarkMode ? "bg-[#d4af37]/20 text-[#d4af37]" : "text-gray-400"}`}
                >
                  {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsLoading(true)
                    setTimeout(() => setIsLoading(false), 500)
                  }}
                  className="h-8 w-8 p-0 text-gray-400"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#d4af37]" />
              <p className="mt-2 text-sm text-gray-300">Loading preview...</p>
            </div>
          </div>
        )}

        {activeTab === "preview" ? (
          <div
            className={`w-full h-full ${isDarkMode ? "dark-mode" : ""}`}
            style={{
              maxWidth: getViewportWidth(),
              margin: viewMode !== "desktop" ? "0 auto" : undefined,
              transition: "max-width 0.3s ease",
            }}
          >
            <SandpackPreview
              showOpenInCodeSandbox={false}
              showRefreshButton={false}
              showNavigator={false}
              style={{ height: "100%", width: "100%" }}
              onLoad={() => setIsLoading(false)}
            />
          </div>
        ) : (
          <SandpackCodeEditor showLineNumbers showTabs style={{ height: "100%" }} />
        )}
      </SandpackProvider>
    </div>
  )
}
