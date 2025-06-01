import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { generatedCode, realTimePrompt } = body

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert web developer. You will be given an existing HTML website and a request to modify it. 
You must update the HTML to implement the requested changes while PRESERVING ALL EXISTING CONTENT AND FUNCTIONALITY.
CRITICAL INSTRUCTIONS:
1. NEVER remove any existing content, sections, or functionality
2. ONLY enhance or add what is specifically requested
3. Maintain the exact same structure, styling, and organization of the original website
4. Preserve all existing classes, IDs, and styling
5. Keep all interactive elements fully functional
6. Ensure all buttons and inputs remain easy to click and interact with
7. Maintain any existing state management logic
8. Return only the complete, updated HTML code without any explanations or markdown

Your goal is to ENHANCE the website by adding or improving what was requested WITHOUT removing or changing anything else.`,
          },
          {
            role: "user",
            content: `Here is the current website HTML:

${generatedCode}

Please enhance this website according to this request: "${realTimePrompt}"

CRITICAL REQUIREMENTS: 
1. PRESERVE ALL existing content, sections, and functionality
2. ONLY add or enhance what is specifically requested
3. Maintain the exact same structure, styling, and organization
4. Keep all interactive elements fully functional
5. Ensure all buttons and inputs are easy to click and interact with
6. Maintain any existing state management logic
7. Return only the complete, updated HTML code

Return only the complete, updated HTML code.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 16000,
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error in update-website API route:", error)
    return NextResponse.json({ error: error.message || "Failed to update website" }, { status: 500 })
  }
}
