// Types for the prompt enhancer system

export interface WebsiteTemplate {
  id: string
  name: string
  category: string
  description: string
  structure: {
    sections: string[]
    features: string[]
    designPrinciples: string[]
  }
  codePatterns: {
    html: string[]
    css: string[]
    javascript: string[]
  }
  bestPractices: string[]
  examplePrompt: string
}
