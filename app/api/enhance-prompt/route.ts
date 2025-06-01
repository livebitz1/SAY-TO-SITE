import { type NextRequest, NextResponse } from "next/server"
import { enhancePromptWithTemplate } from "@/lib/claude-prompt-enhancer"

export async function POST(request: NextRequest) {
  try {
    const { prompt, templateId } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        {
          error: "Prompt is required",
        },
        { status: 400 },
      )
    }

    // Enhance the prompt using our template system
    const enhancedPrompt = enhancePromptWithTemplate(prompt, templateId)

    return NextResponse.json({
      originalPrompt: prompt,
      enhancedPrompt,
      templateId,
    })
  } catch (error) {
    console.error("Error enhancing prompt:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to enhance prompt",
      },
      { status: 500 },
    )
  }
}
