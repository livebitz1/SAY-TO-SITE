"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Loader2,
  Sparkles,
  Code2,
  Download,
  RefreshCw,
  Zap,
  Wand2,
  Braces,
  FileCode,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Cpu,
  ArrowLeft,
  Maximize,
  Minimize,
  Clipboard,
  ClipboardCheck,
} from "lucide-react"
import Link from "next/link"

// Code editor component with syntax highlighting
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"

// Language options
const LANGUAGES = [
  { value: "html", label: "HTML/CSS/JS", icon: <FileCode className="h-4 w-4" /> },
  { value: "javascript", label: "JavaScript", icon: <Braces className="h-4 w-4" /> },
  { value: "typescript", label: "TypeScript", icon: <Code2 className="h-4 w-4" /> },
  { value: "python", label: "Python", icon: <Code2 className="h-4 w-4" /> },
  { value: "react", label: "React", icon: <Code2 className="h-4 w-4" /> },
]

// Example prompts
const EXAMPLE_PROMPTS = [
  {
    language: "html",
    prompts: [
      "Create a responsive landing page for a SaaS product with a hero section, features, and pricing",
      "Build a portfolio website with a gallery, about section, and contact form",
      "Design a dashboard UI with statistics cards, charts, and a sidebar navigation",
    ],
  },
  {
    language: "javascript",
    prompts: [
      "Write a function to fetch data from an API and handle errors gracefully",
      "Create a carousel slider with autoplay and navigation controls",
      "Implement a form validation system with custom error messages",
    ],
  },
  {
    language: "typescript",
    prompts: [
      "Create a TypeScript interface for a user management system",
      "Build a generic data fetching hook with TypeScript",
      "Implement a state management solution with TypeScript",
    ],
  },
  {
    language: "python",
    prompts: [
      "Write a script to process and analyze CSV data",
      "Create a Flask API with authentication and database integration",
      "Build a web scraper that extracts product information from an e-commerce site",
    ],
  },
  {
    language: "react",
    prompts: [
      "Create a React component for a multi-step form with validation",
      "Build a custom hook for managing API requests with loading and error states",
      "Implement a theme switcher with context API and localStorage",
    ],
  },
]

export default function ClaudeStudio() {
  const [prompt, setPrompt] = useState("")
  const [language, setLanguage] = useState("html")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("")
  const [validationResult, setValidationResult] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("editor")
  const [copied, setCopied] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [previewUrl, setPreviewUrl] = useState("")

  const containerRef = useRef<HTMLDivElement>(null)
  const promptRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()

  // Get example prompts for the selected language
  const examplePrompts = EXAMPLE_PROMPTS.find((item) => item.language === language)?.prompts || []

  // Handle fullscreen toggle
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Generate code with Claude
  const generateCode = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a description of the code you want to generate",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setGeneratedCode("")
    setValidationResult(null)
    setActiveTab("editor")

    try {
      const response = await fetch("/api/claude-code-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          language,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to generate code: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setGeneratedCode(data.code)
      setValidationResult(data.validationResult)
      setAttempts(data.attempts || 1)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)

      // Create preview URL for HTML
      if (language === "html") {
        const blob = new Blob([data.code], { type: "text/html" })
        const url = URL.createObjectURL(blob)
        setPreviewUrl(url)
      } else {
        setPreviewUrl("")
      }

      // Show success toast
      toast({
        title: "Code Generated Successfully",
        description: data.attempts > 1 ? `Code was validated and fixed after ${data.attempts} attempts` : undefined,
        duration: 3000,
      })
    } catch (error) {
      console.error("Error generating code:", error)
      toast({
        title: "Error Generating Code",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Copy code to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Code Copied",
        description: "Code has been copied to clipboard",
        duration: 2000,
      })
    } catch (err) {
      console.error("Failed to copy:", err)
      toast({
        title: "Copy Failed",
        description: "Failed to copy code to clipboard",
        variant: "destructive",
      })
    }
  }

  // Download code
  const downloadCode = () => {
    const fileExtension = language === "javascript" ? "js" : language === "typescript" ? "ts" : language
    const fileName = `claude-generated-code.${fileExtension}`
    const blob = new Blob([generatedCode], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Code Downloaded",
      description: `Saved as ${fileName}`,
      duration: 2000,
    })
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  // Regenerate code
  const regenerateCode = () => {
    generateCode()
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/20 via-[#d4af37]/10 to-[#d4af37]/5 animate-gradient" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#d4af37]/10 via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center text-gray-400 hover:text-white transition-all duration-300 group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            <Badge className="bg-gradient-to-r from-[#d4af37]/20 to-[#b8860b]/20 text-[#d4af37] border-[#d4af37]/30">
              <Cpu className="h-3 w-3 mr-1" />
              Claude 3 Opus
            </Badge>
          </div>
        </motion.div>

        {/* Main Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
          ref={containerRef}
        >
          <Card className="bg-gray-900/40 backdrop-blur-xl border border-gray-800/50 rounded-2xl overflow-hidden shadow-2xl">
            <CardHeader className="relative border-b border-gray-800/50 pb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/5 to-[#b8860b]/5" />
              <div className="relative flex items-center">
                <div className="p-2 bg-[#d4af37]/10 rounded-lg mr-3">
                  <Wand2 className="h-5 w-5 text-[#d4af37]" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl font-semibold">Claude Code Studio</CardTitle>
                  <CardDescription className="text-gray-400">
                    Generate perfect, production-ready code with Claude AI
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFullscreen}
                    className="text-gray-400 hover:text-white"
                  >
                    {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-800/50">
              {/* Input Section */}
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-300 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2 text-[#d4af37]" />
                      What would you like Claude to create?
                    </h3>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-[180px] bg-gray-800/50 border-gray-700/50 text-sm">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value} className="text-white">
                            <div className="flex items-center">
                              {lang.icon}
                              <span className="ml-2">{lang.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="relative">
                    <Textarea
                      ref={promptRef}
                      value={prompt}
                      onChange={(e) => {
                        setPrompt(e.target.value)
                        setIsTyping(true)
                        setTimeout(() => setIsTyping(false), 1000)
                      }}
                      placeholder={`Describe the ${language} code you want to generate in detail...`}
                      className="min-h-[200px] bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4af37]/50 focus:ring-2 focus:ring-[#d4af37]/20 resize-none transition-all duration-300"
                    />
                    <AnimatePresence>
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute bottom-2 right-2"
                        >
                          <Badge className="bg-gray-700/50 text-gray-400 text-xs">Press Generate when ready</Badge>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Example prompts */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-400">Example prompts:</h3>
                  <div className="flex flex-col gap-2">
                    {examplePrompts.map((example, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => {
                          setPrompt(example)
                          promptRef.current?.focus()
                        }}
                        className="text-left text-sm bg-gray-800/70 hover:bg-gray-700/70 text-gray-300 px-3 py-2 rounded-lg border border-gray-700/50 transition-all duration-300 hover:border-[#d4af37]/30"
                      >
                        {example}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    onClick={generateCode}
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full bg-gradient-to-r from-[#d4af37] to-[#b8860b] hover:opacity-90 text-black font-medium"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Code
                      </>
                    )}
                  </Button>
                </div>

                {isGenerating && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                      <span>Generating perfect code...</span>
                      <span>{attempts > 0 ? `Attempt ${attempts}` : ""}</span>
                    </div>
                    <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#d4af37] to-[#b8860b]"
                        initial={{ width: "0%" }}
                        animate={{
                          width: isGenerating ? ["0%", "50%", "70%", "90%"] : "100%",
                        }}
                        transition={{
                          duration: 2,
                          ease: "easeInOut",
                          times: [0, 0.4, 0.7, 0.9],
                          repeat: isGenerating ? Number.POSITIVE_INFINITY : 0,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Output Section */}
              <div className="relative">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="border-b border-gray-800/50">
                    <div className="px-6 pt-6">
                      <TabsList className="bg-gray-800/50 p-1">
                        <TabsTrigger
                          value="editor"
                          className="data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37]"
                        >
                          <Code2 className="h-4 w-4 mr-2" />
                          Code
                        </TabsTrigger>
                        {previewUrl && (
                          <TabsTrigger
                            value="preview"
                            className="data-[state=active]:bg-[#d4af37]/20 data-[state=active]:text-[#d4af37]"
                          >
                            <FileCode className="h-4 w-4 mr-2" />
                            Preview
                          </TabsTrigger>
                        )}
                      </TabsList>
                    </div>
                  </div>

                  <TabsContent value="editor" className="p-0 m-0">
                    <div className="relative">
                      {showSuccess && (
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20"
                        >
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Code generated successfully!
                          </Badge>
                        </motion.div>
                      )}

                      <div className="p-6 pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-gray-300 flex items-center">
                            <FileCode className="h-4 w-4 mr-2 text-[#d4af37]" />
                            Generated Code
                          </h3>
                          {generatedCode && (
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={copyToClipboard}
                                className="h-8 text-gray-400 hover:text-white"
                              >
                                {copied ? (
                                  <ClipboardCheck className="h-4 w-4 text-green-400" />
                                ) : (
                                  <Clipboard className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={downloadCode}
                                className="h-8 text-gray-400 hover:text-white"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={regenerateCode}
                                disabled={isGenerating}
                                className="h-8 text-gray-400 hover:text-white"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-6 pt-0">
                        {generatedCode ? (
                          <div className="rounded-lg overflow-hidden border border-gray-800/50">
                            <SyntaxHighlighter
                              language={language === "react" ? "jsx" : language}
                              style={atomDark}
                              customStyle={{
                                margin: 0,
                                padding: "1rem",
                                borderRadius: "0.5rem",
                                maxHeight: "400px",
                                fontSize: "0.875rem",
                              }}
                              showLineNumbers={true}
                            >
                              {generatedCode}
                            </SyntaxHighlighter>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-[400px] bg-gray-900/50 rounded-lg border border-gray-800/50">
                            {isGenerating ? (
                              <div className="text-center">
                                <div className="relative">
                                  <div className="absolute inset-0 bg-[#d4af37]/20 rounded-full blur-xl animate-pulse" />
                                  <Loader2 className="h-12 w-12 animate-spin text-[#d4af37] relative z-10" />
                                </div>
                                <p className="text-gray-300 mt-6 font-medium">Generating perfect code...</p>
                                <p className="text-gray-500 text-sm mt-2">
                                  Claude is crafting high-quality {language} code
                                </p>
                              </div>
                            ) : (
                              <div className="text-center max-w-md">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/10 mb-6">
                                  <Code2 className="h-10 w-10 text-[#d4af37]" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-200">Code Output</h3>
                                <p className="text-gray-400 mb-6">
                                  Describe what you want to create and Claude will generate the code
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Validation Results */}
                        {validationResult && validationResult.errors && validationResult.errors.length > 0 && (
                          <div className="mt-4 p-4 bg-red-900/20 backdrop-blur-sm border border-red-800/50 rounded-lg">
                            <div className="flex items-center mb-2">
                              <AlertTriangle className="h-4 w-4 text-red-400 mr-2" />
                              <h3 className="text-sm font-medium text-red-300">Issues Found</h3>
                            </div>
                            <ul className="space-y-1 text-sm text-red-300">
                              {validationResult.errors.map((error: string, index: number) => (
                                <li key={index} className="flex items-start">
                                  <span className="mr-2">•</span>
                                  <span>{error}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Suggestions */}
                        {validationResult &&
                          validationResult.suggestions &&
                          validationResult.suggestions.length > 0 && (
                            <div className="mt-4 p-4 bg-blue-900/20 backdrop-blur-sm border border-blue-800/50 rounded-lg">
                              <div className="flex items-center mb-2">
                                <Lightbulb className="h-4 w-4 text-blue-400 mr-2" />
                                <h3 className="text-sm font-medium text-blue-300">Suggestions</h3>
                              </div>
                              <ul className="space-y-1 text-sm text-blue-300">
                                {validationResult.suggestions.map((suggestion: string, index: number) => (
                                  <li key={index} className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>{suggestion}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                      </div>
                    </div>
                  </TabsContent>

                  {previewUrl && (
                    <TabsContent value="preview" className="p-0 m-0 h-[500px]">
                      <div className="w-full h-full">
                        <iframe
                          src={previewUrl}
                          className="w-full h-full border-0"
                          title="Preview"
                          sandbox="allow-scripts allow-same-origin"
                        />
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
              </div>
            </div>

            <CardFooter className="border-t border-gray-800/50 p-4">
              <div className="w-full flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-4">
                  <Badge className="bg-gray-900/40 backdrop-blur-sm border-gray-800/50 text-gray-400">
                    <Zap className="h-3 w-3 mr-1" />
                    Opus-Powered
                  </Badge>
                  <Badge className="bg-gray-900/40 backdrop-blur-sm border-gray-800/50 text-gray-400">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Auto-Validation
                  </Badge>
                  <Badge className="bg-gray-900/40 backdrop-blur-sm border-gray-800/50 text-gray-400">
                    <Code2 className="h-3 w-3 mr-1" />
                    Multiple Languages
                  </Badge>
                </div>
                <p className="text-xs text-gray-500">Powered by Claude 3 Opus - The most advanced AI code generator</p>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
