"use client"

import { useState, useRef, useEffect } from "react"
import { Loader2 } from "lucide-react"

interface IframePreviewProps {
  code: string
  height?: string | number
  width?: string | number
}

export function IframePreview({ code, height = "100%", width = "100%" }: IframePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    const timer = setTimeout(() => {
      try {
        const iframe = iframeRef.current
        if (!iframe) return

        // Create the full HTML document
        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Preview</title>
              <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
              <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
              <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                body { margin: 0; font-family: sans-serif; }
                .error { color: red; padding: 20px; }
              </style>
            </head>
            <body>
              <div id="root"></div>
              <script type="text/babel">
                try {
                  ${code}
                  // Render the component
                  const rootElement = document.getElementById('root');
                  const root = ReactDOM.createRoot(rootElement);
                  root.render(<App />);
                } catch (error) {
                  console.error('Error rendering component:', error);
                  document.getElementById('root').innerHTML = '<div class="error">Error rendering component: ' + error.message + '</div>';
                }
              </script>
            </body>
          </html>
        `

        // Set the content to the iframe
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
        if (iframeDoc) {
          iframeDoc.open()
          iframeDoc.write(htmlContent)
          iframeDoc.close()
        }

        iframe.onload = () => {
          setLoading(false)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        setLoading(false)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [code])

  return (
    <div style={{ position: "relative", height, width }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-10">
          <div className="bg-red-900/50 p-4 rounded-md text-white max-w-md">
            <h3 className="font-bold mb-2">Preview Error</h3>
            <p>{error}</p>
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        style={{ height: "100%", width: "100%", border: "none", borderRadius: "0.375rem" }}
        title="Live Preview"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  )
}
