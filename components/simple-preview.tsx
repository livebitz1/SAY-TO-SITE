"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

interface SimplePreviewProps {
  code: string
  height?: string | number
}

export function SimplePreview({ code, height = "600px" }: SimplePreviewProps) {
  const [html, setHtml] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    try {
      // Extract JSX from the code
      const jsxMatch = code.match(/return\s*$$\s*([\s\S]*?)\s*$$;?/m)

      if (jsxMatch && jsxMatch[1]) {
        let jsx = jsxMatch[1]

        // Convert JSX className to class
        jsx = jsx.replace(/className=/g, "class=")

        // Replace React fragments
        jsx = jsx.replace(/<>/g, "<div>").replace(/<\/>/g, "</div>")

        // Add basic styling
        const htmlContent = `
          <div style="font-family: system-ui, sans-serif; color: #333;">
            ${jsx}
          </div>
        `

        setHtml(htmlContent)
      } else {
        setHtml('<div style="padding: 20px; color: #666;">Could not extract JSX from the code.</div>')
      }
    } catch (error) {
      console.error("Error in simple preview:", error)
      setHtml('<div style="padding: 20px; color: #c00;">Error generating preview.</div>')
    }

    setLoading(false)
  }, [code])

  if (loading) {
    return (
      <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div
      style={{ height, overflow: "auto", padding: "1rem", backgroundColor: "white" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
