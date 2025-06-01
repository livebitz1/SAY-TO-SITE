"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, Smartphone, Tablet, Monitor, Maximize, Minimize } from "lucide-react"

interface HtmlPreviewProps {
  files: { name: string; content: string }[]
  height: string
  showDeviceControls?: boolean
  showNavigator?: boolean
  minimalUI?: boolean
  streamingContent?: string
  isStreaming?: boolean
}

export function HtmlPreview({
  files,
  height,
  showDeviceControls = true,
  showNavigator = true,
  minimalUI = false,
  streamingContent = "",
  isStreaming = false,
}: HtmlPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deviceWidth, setDeviceWidth] = useState("100%")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [renderedContent, setRenderedContent] = useState("")

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Handle streaming content updates
  useEffect(() => {
    if (isStreaming && streamingContent) {
      try {
        // Fix common issues to ensure valid HTML
        let fixedContent = streamingContent

        // Ensure it has basic HTML structure
        if (!fixedContent.includes("<!DOCTYPE html>")) {
          fixedContent = "<!DOCTYPE html>\n" + fixedContent
        }

        if (!fixedContent.includes("<html")) {
          fixedContent = fixedContent.replace("<!DOCTYPE html>", '<!DOCTYPE html>\n<html lang="en">')
          fixedContent += "\n</html>"
        }

        if (!fixedContent.includes("<head")) {
          fixedContent = fixedContent.replace(
            "<html",
            '<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Generated Website</title>\n</head>',
          )
        }

        if (!fixedContent.includes("<body")) {
          fixedContent = fixedContent.replace("</head>", "</head>\n<body>")
          fixedContent += "\n</body>"
        }

        setRenderedContent(fixedContent)

        // Update the iframe with the streaming content
        if (iframeRef.current) {
          const iframe = iframeRef.current
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

          if (iframeDoc) {
            iframeDoc.open()
            iframeDoc.write(fixedContent)
            iframeDoc.close()
            setLoading(false)
          }
        }
      } catch (err) {
        console.error("Error rendering streaming content:", err)
      }
    }
  }, [isStreaming, streamingContent])

  // Handle completed files
  useEffect(() => {
    if (!isStreaming && files.length > 0) {
      if (!htmlFile) {
        setError("No HTML file found")
        setLoading(false)
        return
      }

      try {
        // Create a complete HTML document
        let htmlContent = htmlFile.content

        // Check if it's a complete HTML document or just a fragment
        if (!htmlContent.includes("<!DOCTYPE html>") && !htmlContent.includes("<html")) {
          htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Preview</title>
              ${cssFile ? `<style>${cssFile.content}</style>` : ""}
            </head>
            <body>
              ${htmlContent}
              ${jsFile ? `<script>${jsFile.content}</script>` : ""}
            </body>
            </html>
          `
        } else {
          // If it's a complete HTML document, inject CSS and JS if they're not already there
          if (cssFile && !htmlContent.includes("<style>") && !htmlContent.includes('<link rel="stylesheet"')) {
            htmlContent = htmlContent.replace("</head>", `<style>${cssFile.content}</style></head>`)
          }

          if (jsFile && !htmlContent.includes("<script>") && !htmlContent.includes("<script src=")) {
            htmlContent = htmlContent.replace("</body>", `<script>${jsFile.content}</script></body>`)
          }
        }

        setRenderedContent(htmlContent)

        // Set the iframe content
        if (iframeRef.current) {
          const iframe = iframeRef.current
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

          if (iframeDoc) {
            iframeDoc.open()
            iframeDoc.write(htmlContent)
            iframeDoc.close()

            // Add load event listener to the iframe
            iframe.onload = () => {
              setLoading(false)
            }
          }
        }
      } catch (err) {
        console.error("Error rendering HTML preview:", err)
        setError(`Error rendering preview: ${err instanceof Error ? err.message : String(err)}`)
        setLoading(false)
      }
    }
  }, [files, isStreaming])

  // Find HTML, CSS, and JS files
  const htmlFile = files.find((file) => file.name.endsWith(".html"))
  const cssFile = files.find((file) => file.name.endsWith(".css"))
  const jsFile = files.find((file) => file.name.endsWith(".js"))

  const handleRefresh = () => {
    setLoading(true)
    setError(null)

    // Re-render the iframe
    if (iframeRef.current) {
      iframeRef.current.src = "about:blank"
      setTimeout(() => {
        // This will trigger the useEffect again
        if (iframeRef.current) {
          iframeRef.current.src = ""
        }
      }, 100)
    }
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <div
      ref={containerRef}
      className={`w-full h-full flex flex-col ${isFullscreen ? "fixed inset-0 z-50 bg-black" : ""}`}
    >
      {/* Controls */}
      {!minimalUI && (
        <div className="flex items-center justify-between p-2 bg-gray-900 border-b border-gray-800">
          {showDeviceControls ? (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeviceWidth("375px")}
                className={`h-8 px-2 ${deviceWidth === "375px" ? "bg-gray-800" : ""}`}
                title="Mobile view"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeviceWidth("768px")}
                className={`h-8 px-2 ${deviceWidth === "768px" ? "bg-gray-800" : ""}`}
                title="Tablet view"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeviceWidth("100%")}
                className={`h-8 px-2 ${deviceWidth === "100%" ? "bg-gray-800" : ""}`}
                title="Desktop view"
              >
                <Monitor className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div></div>
          )}

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleRefresh} className="h-8 px-2" title="Refresh preview">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="h-8 px-2"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}

      {/* Preview area */}
      <div className="flex-1 relative overflow-hidden bg-white">
        {loading && !isStreaming && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}

        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 p-4">
            <div className="max-w-md text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center overflow-auto"
            style={{ backgroundColor: "#f0f0f0" }}
          >
            <div
              style={{
                width: deviceWidth,
                height: "100%",
                transition: "width 0.3s ease",
                margin: "0 auto",
              }}
            >
              <iframe
                ref={iframeRef}
                className="w-full h-full border-0"
                title="Website Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
