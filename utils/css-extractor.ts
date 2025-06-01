import { generateCompleteTheme, type DesignStyle, type ColorScheme } from "./theme-generator"

// Function to combine HTML, CSS, and JS with theme
export function combineHtmlCssJs(
  html: string,
  css: string,
  javascript: string,
  style: DesignStyle = "modern",
  colorScheme: ColorScheme = "vibrant",
): string {
  // Generate theme CSS
  const themeCSS = generateCompleteTheme(style, colorScheme)

  // Combine all CSS
  const combinedCSS = `
    ${themeCSS}
    ${css}
  `

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Generated Website</title>
        <style>
          ${combinedCSS}
        </style>
      </head>
      <body>
        ${html}
        <script>
          ${javascript}
        </script>
      </body>
    </html>
  `
}

// Function to extract CSS from HTML
export function extractCss(html: string): { html: string; css: string } {
  let css = ""

  // Extract <style> tags
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi
  let match

  // Create a copy of the HTML to modify
  let newHtml = html

  // Extract all style tags
  while ((match = styleRegex.exec(html)) !== null) {
    css += match[1] + "\n"
    // Remove the style tag from HTML
    newHtml = newHtml.replace(match[0], "")
  }

  return { html: newHtml, css }
}

// Function to process HTML and extract/apply CSS
export function processHtml(
  html: string,
  style: DesignStyle = "modern",
  colorScheme: ColorScheme = "vibrant",
): { html: string; css: string; fullHtml: string } {
  // Extract CSS from HTML
  const { html: cleanHtml, css: extractedCss } = extractCss(html)

  // Generate theme CSS
  const themeCSS = generateCompleteTheme(style, colorScheme)

  // Combine all CSS
  const combinedCSS = `
    ${themeCSS}
    ${extractedCss}
  `

  // Create full HTML with CSS
  const fullHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Generated Website</title>
        <style>
          ${combinedCSS}
        </style>
      </head>
      <body>
        ${cleanHtml}
      </body>
    </html>
  `

  return { html: cleanHtml, css: combinedCSS, fullHtml }
}
