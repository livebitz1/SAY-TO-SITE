import { extractCss, processHtml } from "@/utils/css-extractor"
import type { DesignStyle, ColorScheme } from "@/utils/theme-generator"

interface ProcessedCode {
  html: string
  css: string
  javascript: string
  fullCode: string
}

export function processGeneratedHtml(
  html: string,
  style: DesignStyle = "modern",
  colorScheme: ColorScheme = "vibrant",
): ProcessedCode {
  // Extract CSS
  const { html: htmlWithoutCss, css: extractedCss } = extractCss(html)

  // Extract JavaScript
  let javascript = ""
  let htmlWithoutJs = htmlWithoutCss

  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi
  let scriptMatch

  while ((scriptMatch = scriptRegex.exec(htmlWithoutCss)) !== null) {
    // Only extract scripts without src attribute
    if (!scriptMatch[0].includes("src=")) {
      javascript += scriptMatch[1] + "\n"
      // Remove the script tag from HTML
      htmlWithoutJs = htmlWithoutJs.replace(scriptMatch[0], "")
    }
  }

  // Process HTML with theme
  const { html: cleanHtml, css: combinedCss, fullHtml } = processHtml(htmlWithoutJs, style, colorScheme)

  // Create full code with JavaScript
  const fullCode = fullHtml.replace("</body>", `<script>${javascript}</script></body>`)

  return {
    html: cleanHtml,
    css: combinedCss,
    javascript,
    fullCode,
  }
}
