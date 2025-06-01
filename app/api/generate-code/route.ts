export const maxDuration = 60 // Keep within Vercel hobby plan limits

import { type NextRequest, NextResponse } from "next/server"
import type { ReadableStream } from "stream/web"
import { analyzeCodeCompleteness } from "@/lib/prompt-enhancer/code-requirements"

interface ValidationResult {
  isValid: boolean
  errors: string[]
  fixInstructions?: string
  suggestions?: string[]
  validationHistory?: string[]
}

// Function to validate code using GPT directly (without making an HTTP request)
async function validateCode(code: string, fileName: string): Promise<ValidationResult> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OPENAI_API_KEY is not configured, skipping validation")
      return { isValid: true, errors: [] } // Skip validation if no API key
    }

    // First check code completeness
    const analysis = analyzeCodeCompleteness(code)
    if (!analysis.isComplete) {
      return {
        isValid: false,
        errors: [
          `Code is incomplete. Total lines: ${analysis.totalLines} (minimum 1300 required)`,
          `HTML: ${analysis.htmlLines}/300, CSS: ${analysis.cssLines}/500, JS: ${analysis.jsLines}/500`,
          ...analysis.missingFeatures.map((f) => `Missing feature: ${f}`),
        ],
        fixInstructions:
          "Generate a more comprehensive website with all required features and at least 1300 lines of code. Ensure proper HTML structure, comprehensive CSS styling, and complete JavaScript functionality.",
      }
    }

    // Add hero section validation
    const heroValidation = validateHeroSection(code)

    if (!heroValidation.isValid) {
      return {
        isValid: false,
        errors: ["Hero section does not meet requirements", ...heroValidation.issues],
        fixInstructions: `Improve the hero section by addressing these issues: ${heroValidation.issues.join(", ")}. 
        Make sure the hero section is visually rich with images, has multiple content elements including headline and subheading, 
        and includes at least 2 interactive elements like animations, hover effects, or carousels.`,
      }
    }

    const validationPrompt = `You are an expert code validator specializing in HTML, CSS, and JavaScript. Analyze the following code for CRITICAL syntax errors, runtime issues, and common web development problems.

File: ${fileName}
Code:
${code}

Check for these CRITICAL issues that would prevent the code from running properly:
1. Syntax errors (missing brackets, semicolons, quotes)
2. HTML errors (unclosed tags, improper nesting, invalid attributes)
3. CSS errors (missing brackets, invalid selectors, invalid properties)
4. JavaScript errors (undefined variables, syntax errors, runtime errors)
5. Missing required elements (html, head, body, meta tags)
6. Improper script or style tag usage
7. Cross-browser compatibility issues
8. Accessibility issues (missing ARIA attributes, improper focus management)
9. Performance issues (inefficient code, blocking scripts)
10. Security issues (XSS vulnerabilities, unsanitized inputs)

IMPORTANT: Only report issues that would cause the code to crash, fail to render properly, or create serious usability problems.
DO NOT report style issues, minor optimizations, or best practices unless they would cause serious problems.

CRITICAL: Be extremely thorough in your validation. Look for:
1. Unclosed HTML tags and improper nesting
2. Missing quotes in attributes or improper attribute syntax
3. Improper JavaScript function syntax or scope issues
4. Missing closing brackets, parentheses, or quotes
5. Invalid CSS properties or values
6. Improper event handling or event listener issues
7. Accessibility issues that would prevent users from using the site
8. Performance issues that would cause the site to be unusable

Respond in JSON format:
{
  "isValid": boolean,
  "errors": ["error1", "error2"],
  "fixInstructions": "Specific instructions to fix all errors",
  "suggestions": ["optional improvement suggestions"]
}`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content:
              "You are an expert code validator that responds only in valid JSON format. Never include markdown formatting or code blocks in your response. Be extremely thorough in finding syntax errors that would prevent code from running.",
          },
          {
            role: "user",
            content: validationPrompt,
          },
        ],
        temperature: 0.1, // Low temperature for consistent validation
        max_tokens: 1000,
        response_format: { type: "json_object" },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("OpenAI API error:", errorText)
      throw new Error(`OpenAI API request failed: ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Unexpected response structure from OpenAI API")
    }

    let validationResult: ValidationResult
    try {
      validationResult = JSON.parse(data.choices[0].message.content)
    } catch (parseError) {
      console.error("Failed to parse validation result:", data.choices[0].message.content)
      // If parsing fails, assume the code is valid to avoid blocking generation
      validationResult = {
        isValid: true,
        errors: ["Failed to parse validation result, proceeding with generation"],
      }
    }

    return validationResult
  } catch (error) {
    console.error("Error validating code:", error)
    // If validation fails, we'll assume the code is valid to avoid blocking generation
    return {
      isValid: true,
      errors: ["Validation service unavailable, proceeding with generation"],
    }
  }
}

// Function to generate code with Claude
async function generateWithClaude(
  prompt: string,
  previousCode?: string,
  fixInstructions?: string,
): Promise<ReadableStream> {
  let finalPrompt = prompt

  if (previousCode && fixInstructions) {
    finalPrompt = `${prompt}

IMPORTANT: The previous code had errors. Here's the code that needs to be fixed:

${previousCode}

SPECIFIC ERRORS TO FIX:
${fixInstructions}

Please regenerate the code with these specific fixes applied. Make sure to:
1. Fix all the mentioned errors
2. Keep the same functionality as intended
3. Ensure proper HTML, CSS, and JavaScript syntax
4. Return only the corrected code, no explanations
5. Generate AT LEAST 1300 lines of functional code`
  }

  // Add instructions for comprehensive generation
  finalPrompt = `${finalPrompt}

CRITICAL REQUIREMENTS FOR CODE GENERATION:

1. **MINIMUM CODE SIZE**: You MUST generate AT LEAST 1300 lines of functional HTML, CSS, and JavaScript code
2. **COMPLETE FEATURES**: Every feature mentioned must be FULLY implemented with working JavaScript
3. **NO PLACEHOLDERS**: Use real content, real functionality, no "lorem ipsum" or placeholder text
4. **PRODUCTION READY**: The code should work immediately when opened in a browser

MANDATORY SECTIONS TO INCLUDE:
- Complete HTML structure with 10+ sections (300+ lines)
- Comprehensive CSS with animations, responsive design, and hover states (500+ lines)
- Full JavaScript implementation including all interactive features (500+ lines)
- Detailed comments explaining functionality

IMPORTANT ADDITIONAL INSTRUCTIONS:
1. Generate the HTML structure incrementally, starting with the basic structure
2. First output the DOCTYPE, html, head, and an empty body tag
3. Then add elements one by one to the body, in a logical order (header, main sections, footer)
4. For each element, output the complete HTML structure so far
5. Make sure each incremental output is valid HTML that can be rendered
6. Add CSS styles progressively as you add elements
7. Add JavaScript at the end
8. Signal completion with a comment <!-- GENERATION_COMPLETE -->

This will be used for a real-time preview that shows elements appearing one by one.

Remember: This is a PROFESSIONAL website that needs to be feature-rich and fully functional. Do not create a minimal implementation.`

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307", // Using the available model
        max_tokens: 4000,
        stream: true, // Enable streaming
        messages: [
          {
            role: "user",
            content: finalPrompt,
          },
        ],
        system: `You are a world-class web developer with 15+ years of experience creating professional, production-ready websites. You specialize in creating comprehensive, feature-rich websites with clean, maintainable code.

CRITICAL HERO SECTION REQUIREMENTS:
1. NEVER create a minimal or blank hero section
2. ALWAYS include rich visual elements (background images, product images, graphics)
3. ALWAYS include compelling headline, detailed subheading, and multiple CTAs
4. ALWAYS implement at least 2 interactive elements (animations, hover effects, carousels)
5. ALWAYS use a multi-column layout for desktop (not just centered text)
6. NEVER use a plain background with just text and a button
7. ALWAYS ensure proper spacing and visual hierarchy
8. CRITICAL: ALWAYS use dark text (black or dark gray) on light backgrounds
9. CRITICAL: ALWAYS use light text (white or light gray) on dark backgrounds
10. CRITICAL: NEVER use white or light-colored text on light backgrounds
11. CRITICAL: If using a light background, add a dark overlay behind text or use dark text
12. CRITICAL: Ensure ALL text has a minimum contrast ratio of 4.5:1 for accessibility
13. CRITICAL: Fill the entire hero section with meaningful content and visuals - NO empty space

CRITICAL TEXT CONTRAST RULES:
1. On white/light backgrounds: Use black (#000), dark gray (#333), or other dark colors for text
2. On dark backgrounds: Use white (#fff), light gray (#f0f0f0), or other light colors for text
3. For colored backgrounds: Ensure text has sufficient contrast (4.5:1 ratio minimum)
4. When using images as backgrounds: Add a semi-transparent overlay to ensure text readability
5. For gradients: Ensure text is placed on the part of the gradient with best contrast
6. ALWAYS test all color combinations for proper contrast
7. NEVER use similar colors for text and background (e.g., light gray text on white background)
8. When in doubt, add a text shadow or background to improve readability

CRITICAL HTML RULES:
1. Always ensure proper HTML5 syntax with closing tags for all elements
2. Always include the DOCTYPE declaration and proper meta tags
3. Always include html, head, and body tags with proper attributes
4. Always include meta charset and viewport tags
5. Always use proper attribute syntax with quotes
6. Always close all tags properly or use self-closing tags where appropriate
7. Always use lowercase tag names for better compatibility
8. Include AT LEAST 10 major sections with full content
9. Use proper semantic elements (header, nav, main, section, article, footer)
10. Include proper ARIA attributes for accessibility
11. Use proper microdata or JSON-LD for SEO
12. Include proper meta tags for social sharing

CRITICAL CSS RULES:
1. Always use proper CSS syntax with opening and closing braces
2. Always include semicolons after each CSS property
3. Always use valid CSS properties and values
4. Always properly nest selectors and properties
5. Include comprehensive styling for ALL elements
6. Add animations and transitions throughout
7. Implement full responsive design with multiple breakpoints
8. Generate AT LEAST 500 lines of CSS
9. Use CSS variables for consistent theming
10. Include hover, focus, and active states for all interactive elements
11. Use proper media queries for responsive design
12. Include print styles for better printing experience

CRITICAL JAVASCRIPT RULES:
1. Always use proper JavaScript syntax with ES6+ features
2. Always include semicolons at the end of statements
3. Always properly close brackets, parentheses, and quotes
4. Always declare variables before using them
5. Always use proper function syntax with error handling
6. Always handle potential errors in event handlers
7. Implement ALL interactive features mentioned
8. Use modern JavaScript patterns and best practices
9. Add event listeners for all interactive elements
10. Generate AT LEAST 500 lines of JavaScript
11. Use proper error handling with try/catch blocks
12. Implement proper form validation with detailed error messages

CRITICAL STRUCTURE RULES:
1. Place CSS in a <style> tag in the head
2. Place JavaScript in a <script> tag at the end of the body
3. Organize HTML in a logical structure with proper indentation
4. Use comments to explain complex code sections
5. Implement ALL features completely, no placeholders
6. Create a cohesive design with consistent styling
7. Ensure all interactive elements are fully functional
8. Make the website fully responsive for all devices
9. Ensure proper accessibility for all users
10. Optimize for performance and SEO

INCREMENTAL GENERATION RULES:
1. Start with the basic HTML structure (DOCTYPE, html, head with meta tags, empty body)
2. Add elements one by one, in a logical order
3. After adding each significant element, output the complete HTML structure so far
4. Make sure each incremental output is valid HTML that can be rendered
5. Add CSS styles progressively as you add elements
6. Add JavaScript at the end
7. Signal completion with a comment <!-- GENERATION_COMPLETE -->

Remember: You are creating a PROFESSIONAL, PRODUCTION-READY website. Every feature must work, every section must have real content, and the total code must be AT LEAST 1300 lines.`,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Claude API error:", errorText)
      throw new Error(`Claude API request failed: ${errorText}`)
    }

    return response.body as ReadableStream
  } catch (error) {
    console.error("Error in generateWithClaude:", error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const { enhancedPrompt, template = "default" } = await request.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY is not configured")
      return NextResponse.json(
        {
          error: "ANTHROPIC_API_KEY is not configured",
        },
        { status: 500 },
      )
    }

    // Create the prompt for plain HTML/CSS/JS
    const promptContent = `Create a COMPREHENSIVE, PROFESSIONAL website using plain HTML, CSS, and JavaScript based on this prompt:

${enhancedPrompt}

CRITICAL REQUIREMENTS:
1. Generate AT LEAST 1300 lines of functional code
2. Use only HTML, CSS, and JavaScript (no frameworks or libraries)
3. Make the website fully responsive with mobile, tablet, and desktop layouts
4. Implement ALL interactive features with complete JavaScript functionality
5. Keep the code clean, organized, and well-commented
6. Ensure cross-browser compatibility
7. Optimize for performance
8. Create a PRODUCTION-READY website, not a prototype

CRITICAL TEXT CONTRAST REQUIREMENTS:
1. ALWAYS use dark text (black or dark gray) on light backgrounds
2. ALWAYS use light text (white or light gray) on dark backgrounds
3. NEVER use white or light-colored text on light backgrounds
4. NEVER use black or dark-colored text on dark backgrounds
5. For hero sections with image backgrounds, add a semi-transparent overlay to ensure text readability
6. Ensure ALL text has a minimum contrast ratio of 4.5:1 for accessibility
7. Use text shadows or background colors to improve readability when needed

MANDATORY FEATURES TO INCLUDE:
- Navigation with mobile menu and dropdowns
- Hero section with animations or carousel
- Multiple content sections (minimum 10-12)
- Interactive elements (forms, modals, accordions, tabs)
- Image galleries or carousels
- Contact form with validation
- Footer with multiple columns
- Loading states and animations
- Error handling for all interactions
- Accessibility features throughout
- Dark mode toggle
- Smooth scrolling
- Lazy loading for images
- Form validation with detailed error messages
- Responsive tables
- Tooltips and popovers
- Progress indicators
- Notification system
- Filtering and sorting functionality
- Animated counters or statistics

CRITICAL FORMATTING REQUIREMENTS:
- Return a complete HTML file with embedded CSS and JavaScript
- Include the DOCTYPE declaration
- Include proper meta tags for responsive design
- Include proper HTML structure (html, head, body)
- Make sure the code is valid and can run in a modern browser
- DO NOT include any explanatory text or markdown formatting in your response
- DO NOT include backticks or language tags
- DO NOT include any text like "Here's the code" or "Here's the implementation"
- ONLY return the actual code, nothing else

HTML STRUCTURE RULES:
- ALWAYS use proper HTML5 syntax
- ALWAYS include the DOCTYPE declaration
- ALWAYS include html, head, and body tags
- ALWAYS include meta charset and viewport tags
- ALWAYS use lowercase tag names
- ALWAYS close all tags properly
- ALWAYS use proper attribute syntax with quotes
- Include AT LEAST 300 lines of HTML structure

CSS RULES:
- Place CSS in a <style> tag in the head
- Use proper CSS syntax with opening and closing braces
- Include semicolons after each CSS property
- Use valid CSS properties and values
- Consider using CSS variables for consistent colors and sizes
- Use media queries for responsive design
- Add animations and transitions
- Include hover and focus states
- Generate AT LEAST 500 lines of CSS
- Include helper classes for text contrast (dark text on light backgrounds, light text on dark backgrounds)

JAVASCRIPT RULES:
- Place JavaScript in a <script> tag at the end of the body
- Use proper JavaScript syntax
- Include semicolons at the end of statements
- Properly close brackets, parentheses, and quotes
- Declare variables before using them
- Use proper function syntax
- Handle potential errors in event handlers
- Use modern JavaScript features (ES6+) where appropriate
- Implement all interactive features mentioned in the prompt
- Use event delegation for multiple similar elements
- Add proper error handling for user interactions
- Ensure all interactive elements have keyboard accessibility
- Generate AT LEAST 500 lines of JavaScript

Return a complete, standalone HTML file that can be opened directly in a browser with AT LEAST 1300 lines of code total.`

    try {
      // Create a streaming response
      const stream = await generateWithClaude(promptContent)

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      })
    } catch (error) {
      console.error("Error generating code with Claude:", error)
      return NextResponse.json(
        {
          error: `Error generating code with Claude: ${error.message || "Unknown error"}`,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in POST handler:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to generate code",
      },
      { status: 500 },
    )
  }
}

// Function to fix common HTML issues
function fixCommonHtmlIssues(code: string): string {
  let fixedCode = code

  // Fix 1: Ensure DOCTYPE declaration
  if (!fixedCode.includes("<!DOCTYPE") && !fixedCode.includes("<!doctype")) {
    fixedCode = "<!DOCTYPE html>\n" + fixedCode
  }

  // Fix 2: Ensure html tag
  if (!fixedCode.includes("<html") && !fixedCode.includes("</html>")) {
    fixedCode = fixedCode.replace("<!DOCTYPE html>", '<!DOCTYPE html>\n<html lang="en">\n')
    fixedCode += "\n</html>"
  }

  // Fix 3: Ensure head tag
  if (!fixedCode.includes("<head") && !fixedCode.includes("</head>")) {
    const htmlStartIndex = fixedCode.indexOf("<html")
    if (htmlStartIndex !== -1) {
      const insertIndex = fixedCode.indexOf(">", htmlStartIndex) + 1
      fixedCode =
        fixedCode.substring(0, insertIndex) +
        '\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Generated Website</title>\n</head>' +
        fixedCode.substring(insertIndex)
    }
  }

  // Fix 4: Ensure body tag
  if (!fixedCode.includes("<body") && !fixedCode.includes("</body>")) {
    const headEndIndex = fixedCode.indexOf("</head>")
    if (headEndIndex !== -1) {
      fixedCode =
        fixedCode.substring(0, headEndIndex + 7) + "\n<body>\n" + fixedCode.substring(headEndIndex + 7) + "\n</body>"
    } else {
      const htmlStartIndex = fixedCode.indexOf("<html")
      if (htmlStartIndex !== -1) {
        const insertIndex = fixedCode.indexOf(">", htmlStartIndex) + 1
        fixedCode = fixedCode.substring(0, insertIndex) + "\n<body>\n" + fixedCode.substring(insertIndex) + "\n</body>"
      }
    }
  }

  // Fix 5: Ensure meta charset tag
  if (!fixedCode.includes("<meta charset")) {
    const headStartIndex = fixedCode.indexOf("<head")
    if (headStartIndex !== -1) {
      const insertIndex = fixedCode.indexOf(">", headStartIndex) + 1
      fixedCode = fixedCode.substring(0, insertIndex) + '\n  <meta charset="UTF-8">' + fixedCode.substring(insertIndex)
    }
  }

  // Fix 6: Ensure viewport meta tag
  if (!fixedCode.includes("viewport")) {
    const headStartIndex = fixedCode.indexOf("<head")
    if (headStartIndex !== -1) {
      const insertIndex = fixedCode.indexOf(">", headStartIndex) + 1
      fixedCode =
        fixedCode.substring(0, insertIndex) +
        '\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">' +
        fixedCode.substring(insertIndex)
    }
  }

  // Fix 7: Ensure title tag
  if (!fixedCode.includes("<title")) {
    const headStartIndex = fixedCode.indexOf("<head")
    if (headStartIndex !== -1) {
      const insertIndex = fixedCode.indexOf(">", headStartIndex) + 1
      fixedCode =
        fixedCode.substring(0, insertIndex) + "\n  <title>Generated Website</title>" + fixedCode.substring(insertIndex)
    }
  }

  return fixedCode
}

// Function to parse HTML generated code into separate files
function parseHtmlGeneratedCode(code: string) {
  const files: { name: string; content: string }[] = []

  // Extract CSS from style tags
  let cssContent = ""
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi
  let styleMatch
  while ((styleMatch = styleRegex.exec(code)) !== null) {
    cssContent += styleMatch[1] + "\n\n"
  }

  // Extract JavaScript from script tags
  let jsContent = ""
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi
  let scriptMatch
  while ((scriptMatch = scriptRegex.exec(code)) !== null) {
    // Skip script tags with src attribute
    if (!scriptMatch[0].includes("src=")) {
      jsContent += scriptMatch[1] + "\n\n"
    }
  }

  // Create HTML file with external CSS and JS references
  const htmlContent = code

  // Add the main HTML file
  files.push({
    name: "index.html",
    content: htmlContent,
  })

  // Add CSS file if there's content
  if (cssContent.trim()) {
    files.push({
      name: "styles.css",
      content: cssContent.trim(),
    })
  }

  // Add JavaScript file if there's content
  if (jsContent.trim()) {
    files.push({
      name: "script.js",
      content: jsContent.trim(),
    })
  }

  return files
}

// Function to validate hero section quality
function validateHeroSection(code: string): { isValid: boolean; issues: string[] } {
  const issues: string[] = []

  // Check for hero section existence
  if (!code.includes("hero") && !code.includes("banner") && !code.includes("jumbotron")) {
    issues.push("No hero section detected")
    return { isValid: false, issues }
  }

  // Check for visual elements
  const hasBackgroundImage =
    code.includes("background-image") || code.includes("background:") || code.includes("background-color")
  const hasProductImage = code.includes("<img") || code.includes("background-image")

  if (!hasBackgroundImage) {
    issues.push("Hero section lacks background styling")
  }

  if (!hasProductImage) {
    issues.push("Hero section lacks images or visual elements")
  }

  // Check for content elements
  const hasHeadline = code.includes("<h1") || code.includes("<h2")
  const hasSubheading = code.includes("<p") || code.includes("<h3") || code.includes("<h4")
  const hasMultipleButtons =
    (code.match(/<button|<a [^>]*class="[^"]*btn|<a [^>]*class="[^"]*button/g) || []).length >= 2

  if (!hasHeadline) {
    issues.push("Hero section lacks a main headline")
  }

  if (!hasSubheading) {
    issues.push("Hero section lacks a descriptive subheading")
  }

  if (!hasMultipleButtons) {
    issues.push("Hero section should have at least 2 call-to-action buttons")
  }

  // Check for interactive elements
  const hasAnimation = code.includes("animation") || code.includes("transition") || code.includes("keyframes")
  const hasHoverEffects = code.includes(":hover")
  const hasCarousel = code.includes("carousel") || code.includes("slider") || code.includes("swiper")

  const interactiveElementsCount = [hasAnimation, hasHoverEffects, hasCarousel].filter(Boolean).length

  if (interactiveElementsCount < 2) {
    issues.push("Hero section lacks sufficient interactive elements (need at least 2)")
  }

  // Check for text contrast issues
  const hasLightBackground =
    code.includes("background-color: #fff") ||
    code.includes("background-color: white") ||
    code.includes("background-color: #f") ||
    code.includes("background: #fff") ||
    code.includes("background: white") ||
    code.includes("background: #f") ||
    code.includes("background-color: rgb(255") ||
    code.includes("background: rgb(255")

  const hasWhiteText =
    code.includes("color: #fff") ||
    code.includes("color: white") ||
    code.includes("color: rgb(255, 255, 255)") ||
    code.includes("color: rgba(255, 255, 255")

  const hasDarkText =
    code.includes("color: #000") ||
    code.includes("color: black") ||
    code.includes("color: rgb(0") ||
    code.includes("color: rgba(0")

  const hasDarkOverlay = code.includes("background-color: rgba(0, 0, 0, 0.5") || code.includes("background-color: #333")

  // Check for potential contrast issues
  if (hasLightBackground && hasWhiteText) {
    issues.push("Hero section has light text on a light background, causing poor contrast")
  }

  if (hasLightBackground && !hasDarkText && !hasDarkOverlay) {
    issues.push("Hero section lacks dark text or overlay on light background")
  }

  // Check for empty space
  const heroSectionContent = extractHeroSection(code)
  if (heroSectionContent && heroSectionContent.trim().length < 200) {
    issues.push("Hero section appears to have minimal content or empty space")
  }

  return {
    isValid: issues.length === 0,
    issues,
  }
}

// Helper function to extract hero section content
function extractHeroSection(code: string): string | null {
  // Try to find hero section by common class names
  const heroRegexPatterns = [
    /<(?:div|section|header)[^>]*class="[^"]*hero[^"]*"[^>]*>([\s\S]*?)<\/(?:div|section|header)>/i,
    /<(?:div|section|header)[^>]*class="[^"]*banner[^"]*"[^>]*>([\s\S]*?)<\/(?:div|section|header)>/i,
    /<(?:div|section|header)[^>]*class="[^"]*jumbotron[^"]*"[^>]*>([\s\S]*?)<\/(?:div|section|header)>/i,
    /<(?:div|section|header)[^>]*id="[^"]*hero[^"]*"[^>]*>([\s\S]*?)<\/(?:div|section|header)>/i,
    /<(?:div|section|header)[^>]*id="[^"]*banner[^"]*"[^>]*>([\s\S]*?)<\/(?:div|section|header)>/i,
    /<(?:div|section|header)[^>]*id="[^"]*jumbotron[^"]*"[^>]*>([\s\S]*?)<\/(?:div|section|header)>/i,
  ]

  for (const pattern of heroRegexPatterns) {
    const match = code.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  // If no specific hero section found, try to find the first major section after the header
  const headerEndMatch = code.match(/<\/header>/i)
  if (headerEndMatch) {
    const afterHeader = code.substring(headerEndMatch.index + headerEndMatch[0].length)
    const firstSectionMatch = afterHeader.match(/<(?:div|section)[^>]*>([\s\S]*?)<\/(?:div|section)>/i)
    if (firstSectionMatch && firstSectionMatch[1]) {
      return firstSectionMatch[1]
    }
  }

  return null
}
