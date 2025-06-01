export const maxDuration = 60 // Keep within Vercel hobby plan limits

import { type NextRequest, NextResponse } from "next/server"
import { enhancePromptWithTemplate } from "@/lib/prompt-enhancer"

export async function POST(request: NextRequest) {
  try {
    const { prompt, templateId } = await request.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY is not configured" }, { status: 500 })
    }

    // Enhanced prompt with more detailed requirements
    const enhancedPrompt = enhancePromptWithTemplate(prompt, templateId)

    // Enhanced system prompt for Claude
    const systemPrompt = `You are an expert full-stack developer with 15+ years of experience creating professional, production-ready websites.

CRITICAL EXPERTISE AREAS:
- Semantic HTML5 with proper accessibility
- Modern CSS with animations, Grid, Flexbox, and responsive design
- Professional JavaScript with modern ES6+ patterns
- UI/UX best practices and design principles
- Performance optimization and Core Web Vitals
- Cross-browser compatibility and progressive enhancement
- Accessibility (WCAG 2.1 AA compliance)
- SEO best practices and structured data

CODING STANDARDS:
1. Write clean, maintainable, and well-commented code
2. Follow industry best practices and design patterns
3. Implement proper error handling and fallbacks
4. Create responsive designs that work on all devices
5. Ensure accessibility for all users
6. Optimize for performance and Core Web Vitals
7. Follow security best practices
8. Create comprehensive, feature-rich implementations

CRITICAL REQUIREMENTS:
1. Generate AT LEAST 1000 lines of functional code
2. Implement ALL requested features completely
3. Create PROFESSIONAL, PRODUCTION-READY code
4. Include detailed comments explaining complex logic
5. Follow modern best practices for all technologies
6. Create visually appealing and user-friendly designs
7. Ensure cross-browser compatibility
8. Implement proper error handling and validation

Your task is to create a COMPLETE, PROFESSIONAL website based on the user's requirements. Do not create minimal implementations or placeholders. Every feature should be fully functional and production-ready.`

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-opus-20240229", // Use the most capable model for better code
        max_tokens: 4000,
        messages: [
          {
            role: "user",
            content: enhancedPrompt,
          },
        ],
        system: systemPrompt,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Claude API error:", errorText)
      return NextResponse.json({ error: `Claude API request failed: ${errorText}` }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in Claude code generator:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 },
    )
  }
}
