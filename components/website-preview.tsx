"use client"

import { useState, useRef, useEffect } from "react"
import { Loader2, RefreshCw, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WebsitePreviewProps {
  code: string
  height?: string | number
  width?: string | number
  onError?: (error: string) => void
}

export function WebsitePreview({ code, height = "100%", width = "100%", onError }: WebsitePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    setLoading(true)
    setError(null)

    const timer = setTimeout(() => {
      try {
        const iframe = iframeRef.current
        if (!iframe) return

        // Ensure the code has proper HTML structure
        let htmlContent = code

        // Check if it's a complete HTML document
        if (!htmlContent.includes("<!DOCTYPE html>")) {
          // If not, wrap it in a proper HTML structure
          htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Preview</title>
              </head>
              <body>
                ${code}
              </body>
            </html>
          `
        }

        // Write the content to the iframe
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
        if (iframeDoc) {
          iframeDoc.open()
          iframeDoc.write(htmlContent)
          iframeDoc.close()
        }

        // Set up load handler
        iframe.onload = () => {
          setLoading(false)
        }

        // Set up error handler for iframe
        iframe.onerror = (e) => {
          console.error("Iframe error:", e)
          setError("Failed to load preview")
          setLoading(false)
          onError?.("Failed to load preview")
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "An error occurred"
        console.error("Preview setup error:", err)
        setError(errorMsg)
        setLoading(false)
        onError?.(errorMsg)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [code, refreshKey, onError])

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const containerStyle = isFullscreen
    ? {
        position: "fixed" as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: "white",
        height: "100vh",
        width: "100vw",
      }
    : {
        position: "relative" as const,
        height: height || "600px",
        width: width || "100%",
      }

  return (
    <div ref={containerRef} style={containerStyle} className="overflow-hidden">
      {/* Toolbar */}
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={handleRefresh}
          className="bg-white/90 backdrop-blur-sm shadow-md"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={toggleFullscreen}
          className="bg-white/90 backdrop-blur-sm shadow-md"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10 backdrop-blur-sm z-20">
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600 mb-2" />
            <p className="text-sm text-gray-600">Loading preview...</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10 backdrop-blur-sm z-20">
          <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-6 max-w-md">
            <h3 className="font-semibold text-red-800 mb-2">Preview Error</h3>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <Button onClick={handleRefresh} size="sm" variant="outline" className="border-red-300 text-red-700">
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Iframe */}
      <iframe
        ref={iframeRef}
        key={refreshKey}
        style={{
          height: "100%",
          width: "100%",
          border: "none",
          borderRadius: isFullscreen ? "0" : "0.5rem",
          backgroundColor: "white",
        }}
        title="Website Preview"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  )
}
