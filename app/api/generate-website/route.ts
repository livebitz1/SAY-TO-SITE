import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { UltraEnhancedPromptGenerator, type EnhancedPromptConfig } from "@/lib/prompt-enhancer/ultra-enhanced-generator"
import { generateCompleteTheme } from "@/utils/theme-generator"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const {
      prompt,
      template,
      features,
      style,
      colorScheme,
      animations,
      accessibility,
      performance,
      seo,
      interactivity,
    } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Generate enhanced prompt
    const config: EnhancedPromptConfig = {
      basePrompt: prompt,
      template,
      features,
      style: style || "modern",
      colorScheme: colorScheme || "vibrant",
      animations: animations !== false,
      accessibility: accessibility !== false,
      performance: performance !== false,
      seo: seo !== false,
      responsive: true,
      interactivity: interactivity || "high",
    }

    const enhancedPrompt = UltraEnhancedPromptGenerator.generateEnhancedPrompt(config)

    // Add specific instructions for CSS
    const cssInstructions = `
IMPORTANT: Generate a complete, working HTML page with embedded CSS. The CSS MUST be included in a <style> tag within the <head> section.
Ensure all CSS is properly formatted and includes:
- Modern, responsive design
- Proper color scheme based on: ${config.colorScheme}
- Design style: ${config.style}
- All necessary styling for buttons, forms, navigation, etc.
- Proper spacing, typography, and layout
    `

    const fullPrompt = enhancedPrompt + "\n\n" + cssInstructions

    // Generate code with Claude
    const completion = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 8000,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: fullPrompt,
        },
      ],
    })

    let generatedCode = completion.content[0].type === "text" ? completion.content[0].text : ""

    // Extract HTML from the response
    const htmlMatch =
      generatedCode.match(/<!DOCTYPE html>[\s\S]*<\/html>/i) || generatedCode.match(/<html[\s\S]*<\/html>/i)

    if (!htmlMatch) {
      // If no complete HTML found, wrap the content
      generatedCode = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website</title>
    <style>
        ${generateCompleteTheme(style || "modern", colorScheme || "vibrant")}
    </style>
</head>
<body>
    ${generatedCode}
</body>
</html>
      `
    } else {
      generatedCode = htmlMatch[0]

      // Ensure theme CSS is included
      const themeCSS = generateCompleteTheme(style || "modern", colorScheme || "vibrant")

      // Check if there's already a style tag
      if (generatedCode.includes("<style>")) {
        // Add theme CSS to existing style tag
        generatedCode = generatedCode.replace("<style>", `<style>\n${themeCSS}\n`)
      } else if (generatedCode.includes("</head>")) {
        // Add style tag before closing head
        generatedCode = generatedCode.replace("</head>", `<style>\n${themeCSS}\n</style>\n</head>`)
      }
    }

    // Extract CSS for separate display
    let css = ""
    const styleMatches = generatedCode.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)
    for (const match of styleMatches) {
      css += match[1] + "\n"
    }

    // Extract JavaScript for separate display
    let javascript = ""
    const scriptMatches = generatedCode.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)
    for (const match of scriptMatches) {
      if (!match[0].includes("src=")) {
        javascript += match[1] + "\n"
      }
    }

    // Extract clean HTML (without style and script tags for display)
    let cleanHtml = generatedCode
    cleanHtml = cleanHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    cleanHtml = cleanHtml.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")

    // Extract just the body content
    const bodyMatch = cleanHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    if (bodyMatch) {
      cleanHtml = bodyMatch[1]
    }

    // Validate the generated code
    const validationResult = UltraEnhancedPromptGenerator.validateGeneratedCode(generatedCode)

    return NextResponse.json({
      success: true,
      html: cleanHtml.trim(),
      css: css.trim(),
      javascript: javascript.trim(),
      fullCode: generatedCode,
      validation: validationResult,
      metadata: {
        style: config.style,
        colorScheme: config.colorScheme,
        features: config.features,
        score: validationResult?.score || 0,
      },
    })
  } catch (error) {
    console.error("Error generating website:", error)
    return NextResponse.json(
      { error: "Failed to generate website", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
