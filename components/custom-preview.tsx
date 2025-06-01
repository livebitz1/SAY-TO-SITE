"use client"

import { useState, useRef, useEffect } from "react"
import { Loader2, RefreshCw, Maximize, Minimize, Copy, Check, Smartphone, Tablet, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface CustomPreviewProps {
  files: Record<string, string>
  height: string
  showNavigator?: boolean
  showDeviceControls?: boolean
}

export function CustomPreview({ files, height, showNavigator = true, showDeviceControls = true }: CustomPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [activeTab, setActiveTab] = useState("preview")
  const [copied, setCopied] = useState(false)
  const [deviceWidth, setDeviceWidth] = useState("100%")
  const [refreshKey, setRefreshKey] = useState(0)

  // Extract main files
  const mainJsContent = files["/App.js"] || ""
  const cssContent = files["/styles.css"] || ""

  // Process the JavaScript content
  const processJsContent = (code: string) => {
    // Remove export statements
    let processed = code.replace(/export\s+default\s+\w+;?/g, "")

    // Remove any standalone ReactDOM calls
    processed = processed.replace(/ReactDOM\.createRoot.*?\);/gs, "")
    processed = processed.replace(/ReactDOM\.render.*?\);/gs, "")

    return processed
  }

  const processedJs = processJsContent(mainJsContent)

  // Create HTML content with separate script for rendering
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    ${cssContent}
  </style>
</head>
<body>
  <div id="root"></div>
  
  <!-- Component Definition -->
  <script type="text/babel">
    // React hooks
    const { useState, useEffect, useRef } = React;
    
    // Component code
    ${processedJs}
  </script>
  
  <!-- Separate script for rendering -->
  <script type="text/babel">
    // Render the App component
    try {
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(App));
    } catch (error) {
      console.error("Error rendering React component:", error);
      document.getElementById('root').innerHTML = \`
        <div style="color: red; padding: 20px; font-family: system-ui;">
          <h2>Error Rendering Component</h2>
          <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto;">\${error.message}</pre>
        </div>
      \`;
    }
  </script>
</body>
</html>
`

  // Handle iframe load events
  const handleIframeLoad = () => {
    setLoading(false)

    // Check for errors in the iframe
    try {
      const iframe = iframeRef.current
      if (iframe && iframe.contentWindow) {
        // Add console error listener
        iframe.contentWindow.addEventListener("error", (event) => {
          setError(`JavaScript error: ${event.message}`)
        })
      }
    } catch (err) {
      console.error("Error accessing iframe:", err)
    }
  }

  // Handle iframe error events
  const handleIframeError = () => {
    setError("Failed to load preview")
    setLoading(false)
  }

  // Reset iframe on files change
  useEffect(() => {
    setLoading(true)
    setError(null)
  }, [files, refreshKey])

  // Copy code to clipboard
  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  // Handle device width changes
  const handleDeviceChange = (width: string) => {
    setDeviceWidth(width)
  }

  // Handle refresh
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div
      className={`bg-gray-950 border border-gray-800 rounded-lg overflow-hidden ${
        fullscreen ? "fixed inset-0 z-50" : "relative"
      }`}
      style={{ height: fullscreen ? "100vh" : height }}
    >
      {/* Preview header */}
      <div className="flex items-center justify-between bg-gray-900 border-b border-gray-800 p-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-800/50 h-8">
            <TabsTrigger
              value="preview"
              className="text-xs h-7 px-3 data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37]"
            >
              Preview
            </TabsTrigger>
            <TabsTrigger
              value="html"
              className="text-xs h-7 px-3 data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37]"
            >
              HTML
            </TabsTrigger>
            <TabsTrigger
              value="css"
              className="text-xs h-7 px-3 data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37]"
            >
              CSS
            </TabsTrigger>
            <TabsTrigger
              value="js"
              className="text-xs h-7 px-3 data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37]"
            >
              JavaScript
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center space-x-1 ml-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-400 hover:text-white"
            onClick={handleRefresh}
            title="Refresh preview"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-400 hover:text-white"
            onClick={() =>
              copyToClipboard(activeTab === "html" ? htmlContent : activeTab === "css" ? cssContent : mainJsContent)
            }
            title="Copy code"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-400 hover:text-white"
            onClick={() => setFullscreen(!fullscreen)}
            title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {fullscreen ? <Minimize className="h-3.5 w-3.5" /> : <Maximize className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      {/* Device controls */}
      {showDeviceControls && activeTab === "preview" && (
        <div className="flex items-center justify-center bg-gray-900/50 border-b border-gray-800 py-1 px-2">
          <div className="flex space-x-1">
            <Button
              variant={deviceWidth === "320px" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => handleDeviceChange("320px")}
            >
              <Smartphone className="h-3 w-3 mr-1" />
              Mobile
            </Button>
            <Button
              variant={deviceWidth === "768px" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => handleDeviceChange("768px")}
            >
              <Tablet className="h-3 w-3 mr-1" />
              Tablet
            </Button>
            <Button
              variant={deviceWidth === "100%" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => handleDeviceChange("100%")}
            >
              <Monitor className="h-3 w-3 mr-1" />
              Desktop
            </Button>
          </div>
        </div>
      )}

      {/* Content area */}
      <div className="relative overflow-auto" style={{ height: "calc(100% - 40px)" }}>
        <TabsContent value="preview" className="m-0 h-full">
          <div className="flex justify-center h-full bg-gray-950 overflow-auto">
            <div
              className="h-full bg-white"
              style={{
                width: deviceWidth,
                maxWidth: "100%",
                transition: "width 0.3s ease",
              }}
            >
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-950/80 z-10">
                  <Loader2 className="h-6 w-6 text-[#d4af37] animate-spin" />
                </div>
              )}
              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-950/80 z-10">
                  <div className="text-red-400 text-center p-4">
                    <p className="font-medium">{error}</p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={handleRefresh}>
                      <RefreshCw className="h-3.5 w-3.5 mr-1" />
                      Try Again
                    </Button>
                  </div>
                </div>
              )}
              <iframe
                key={refreshKey}
                ref={iframeRef}
                srcDoc={htmlContent}
                className="w-full h-full border-0"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                sandbox="allow-scripts allow-popups allow-forms"
                title="Preview"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="html" className="m-0 h-full">
          <div className="bg-gray-950 p-4 h-full overflow-auto">
            <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap">{htmlContent}</pre>
          </div>
        </TabsContent>

        <TabsContent value="css" className="m-0 h-full">
          <div className="bg-gray-950 p-4 h-full overflow-auto">
            <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap">
              {cssContent || "/* No CSS content */"}
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="js" className="m-0 h-full">
          <div className="bg-gray-950 p-4 h-full overflow-auto">
            <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap">{mainJsContent}</pre>
          </div>
        </TabsContent>
      </div>

      {/* Error badge */}
      {error && (
        <div className="absolute bottom-2 right-2">
          <Badge variant="destructive" className="text-xs">
            Preview Error
          </Badge>
        </div>
      )}
    </div>
  )
}
