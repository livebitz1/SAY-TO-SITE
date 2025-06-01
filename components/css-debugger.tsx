"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"

export function CSSDebugger() {
  const [htmlInput, setHtmlInput] = useState("")
  const [debugResults, setDebugResults] = useState<any>(null)

  const debugCSS = () => {
    const results = {
      hasDoctype: htmlInput.includes("<!DOCTYPE html>"),
      hasHtmlTag: /<html[^>]*>/i.test(htmlInput),
      hasHeadTag: /<head[^>]*>/i.test(htmlInput),
      hasStyleTag: /<style[^>]*>/i.test(htmlInput),
      styleTagCount: (htmlInput.match(/<style[^>]*>/gi) || []).length,
      hasInlineStyles: /style="[^"]*"/i.test(htmlInput),
      hasExternalCSS: /<link[^>]*rel="stylesheet"[^>]*>/i.test(htmlInput),
      cssContent: "",
      issues: [] as string[],
    }

    // Extract CSS content
    const styleMatches = htmlInput.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)
    for (const match of styleMatches) {
      results.cssContent += match[1] + "\n"
    }

    // Check for issues
    if (!results.hasDoctype) {
      results.issues.push("Missing <!DOCTYPE html> declaration")
    }
    if (!results.hasHtmlTag) {
      results.issues.push("Missing <html> tag")
    }
    if (!results.hasHeadTag) {
      results.issues.push("Missing <head> tag")
    }
    if (!results.hasStyleTag && !results.hasExternalCSS && !results.hasInlineStyles) {
      results.issues.push("No CSS found (no <style> tags, external CSS, or inline styles)")
    }
    if (results.styleTagCount > 1) {
      results.issues.push(`Multiple style tags found (${results.styleTagCount}). Consider consolidating.`)
    }

    setDebugResults(results)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>CSS Debugger</CardTitle>
        <CardDescription>Paste your HTML to check if CSS is properly included</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste your HTML here..."
          value={htmlInput}
          onChange={(e) => setHtmlInput(e.target.value)}
          className="min-h-[200px] font-mono text-sm"
        />

        <Button onClick={debugCSS} disabled={!htmlInput.trim()}>
          Debug CSS
        </Button>

        {debugResults && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Alert className={debugResults.hasDoctype ? "border-green-500" : "border-red-500"}>
                <AlertDescription className="flex items-center gap-2">
                  {debugResults.hasDoctype ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  DOCTYPE Declaration
                </AlertDescription>
              </Alert>

              <Alert
                className={
                  debugResults.hasStyleTag || debugResults.hasExternalCSS ? "border-green-500" : "border-red-500"
                }
              >
                <AlertDescription className="flex items-center gap-2">
                  {debugResults.hasStyleTag || debugResults.hasExternalCSS ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  CSS Included
                </AlertDescription>
              </Alert>
            </div>

            {debugResults.issues.length > 0 && (
              <Alert className="border-yellow-500">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <AlertDescription>
                  <p className="font-semibold mb-2">Issues Found:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {debugResults.issues.map((issue: string, index: number) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {debugResults.cssContent && (
              <div>
                <h3 className="font-semibold mb-2">Extracted CSS:</h3>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto max-h-[300px] text-sm">
                  <code>{debugResults.cssContent}</code>
                </pre>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
