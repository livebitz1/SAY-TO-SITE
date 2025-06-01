"use client"

import { useState, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Loader2,
  Sparkles,
  Rocket,
  ArrowLeft,
  Globe,
  Wand2,
  Download,
  Share2,
  CheckCircle,
  Zap,
  Code2,
  Palette,
  Layout,
  ArrowUpRight,
  ExternalLink,
  Plus,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { HtmlPreview } from "@/components/html-preview"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import JSZip from "jszip"

export default function WebGenerator() {
  const searchParams = useSearchParams()
  const promptParam = searchParams.get("prompt")
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const [prompt, setPrompt] = useState(promptParam || "")
  const [enhancementPrompt, setEnhancementPrompt] = useState("")
  const [originalPrompt, setOriginalPrompt] = useState("")
  const [enhancedPrompt, setEnhancedPrompt] = useState("")
  const [parsedFiles, setParsedFiles] = useState<{ name: string; content: string }[]>([])
  const [deploymentUrl, setDeploymentUrl] = useState("")
  const [projectName, setProjectName] = useState("my-ai-website")
  const [previewReady, setPreviewReady] = useState(false)
  const [containerHeight, setContainerHeight] = useState("600px")
  const [isTyping, setIsTyping] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const [currentStep, setCurrentStep] = useState<"idle" | "enhancing" | "generating" | "deploying">("idle")
  const [error, setError] = useState("")
  const [validationAttempts, setValidationAttempts] = useState(0)
  const [streamingContent, setStreamingContent] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [generationComplete, setGenerationComplete] = useState(false)

  const { toast } = useToast()

  const examplePrompts = [
    { icon: <Layout className="h-4 w-4" />, text: "Modern portfolio website" },
    { icon: <Code2 className="h-4 w-4" />, text: "SaaS landing page" },
    { icon: <Palette className="h-4 w-4" />, text: "Creative agency site" },
    { icon: <Zap className="h-4 w-4" />, text: "Tech startup homepage" },
  ]

  // Calculate available height for the preview container
  useEffect(() => {
    const updateHeight = () => {
      if (previewRef.current) {
        const viewportHeight = window.innerHeight
        const previewTop = previewRef.current.getBoundingClientRect().top
        const availableHeight = viewportHeight - previewTop - 80
        setContainerHeight(`${Math.max(500, availableHeight)}px`)
      }
    }

    updateHeight()
    window.addEventListener("resize", updateHeight)
    return () => window.removeEventListener("resize", updateHeight)
  }, [])

  useEffect(() => {
    if (promptParam) {
      handleGenerateWebsite(promptParam, true)
    }
  }, [promptParam])

  useEffect(() => {
    if (parsedFiles.length > 0) {
      try {
        setPreviewReady(true)
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      } catch (err) {
        console.error("Error processing code for preview:", err)
        setError("Failed to process code for preview: " + (err instanceof Error ? err.message : String(err)))
        setPreviewReady(false)
      }
    }
  }, [parsedFiles])

  // Check for generation completion
  useEffect(() => {
    if (streamingContent.includes("<!-- GENERATION_COMPLETE -->")) {
      setGenerationComplete(true)

      // Process the final content
      const finalContent = streamingContent.replace("<!-- GENERATION_COMPLETE -->", "")

      // Parse the HTML into separate files
      const files = [
        {
          name: "index.html",
          content: finalContent,
        },
      ]

      // Extract CSS from style tags
      let cssContent = ""
      const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi
      let styleMatch
      while ((styleMatch = styleRegex.exec(finalContent)) !== null) {
        cssContent += styleMatch[1] + "\n\n"
      }

      // Extract JavaScript from script tags
      let jsContent = ""
      const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi
      let scriptMatch
      while ((scriptMatch = scriptRegex.exec(finalContent)) !== null) {
        // Skip script tags with src attribute
        if (!scriptMatch[0].includes("src=")) {
          jsContent += scriptMatch[1] + "\n\n"
        }
      }

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

      setParsedFiles(files)
      setPreviewReady(true)
      setIsStreaming(false)
      setCurrentStep("idle")

      // Show success toast
      toast({
        title: "✨ Website Generated Successfully",
        description: "Your website has been created and is ready to use",
        duration: 3000,
      })
    }
  }, [streamingContent, toast])

  const handleGenerateWebsite = async (userPrompt: string, isInitialGeneration = false) => {
    if (!userPrompt.trim()) return

    // If website is already generated and this is not the initial generation,
    // treat it as an enhancement
    let finalPrompt = userPrompt
    if (previewReady && !isInitialGeneration) {
      // This is an enhancement request
      finalPrompt = `${originalPrompt}. Additionally, please enhance it with the following: ${userPrompt}`
    } else {
      // This is the initial generation or from the landing page
      setOriginalPrompt(userPrompt)
    }

    setError("")
    setCurrentStep("enhancing")
    setPreviewReady(false)
    setParsedFiles([])
    setEnhancedPrompt("")
    setShowSuccess(false)
    setStreamingContent("")
    setIsStreaming(false)
    setGenerationComplete(false)

    try {
      // Step 1: Enhance the prompt with GPT
      const enhanceResponse = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: finalPrompt }),
      })

      if (!enhanceResponse.ok) {
        const errorData = await enhanceResponse.json().catch(() => ({ error: "Failed to parse error response" }))
        throw new Error(errorData.error || `Failed to enhance prompt: ${enhanceResponse.statusText}`)
      }

      const enhanceData = await enhanceResponse.json().catch(() => {
        throw new Error("Failed to parse enhance response")
      })

      if (enhanceData.error) {
        throw new Error(enhanceData.error)
      }

      setEnhancedPrompt(enhanceData.enhancedPrompt)

      // Step 2: Generate code with Claude (streaming)
      setCurrentStep("generating")
      setIsStreaming(true)

      const generateResponse = await fetch("/api/generate-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enhancedPrompt: enhanceData.enhancedPrompt,
          template: "html",
        }),
      })

      if (!generateResponse.ok) {
        // Try to parse the error response
        const errorData = await generateResponse.json().catch(() => ({ error: "Failed to parse error response" }))
        throw new Error(errorData.error || `Failed to generate code: ${generateResponse.statusText}`)
      }

      if (!generateResponse.body) {
        throw new Error("No response body received from code generation")
      }

      // Process the streaming response
      const reader = generateResponse.body.getReader()
      const decoder = new TextDecoder()
      let accumulatedContent = ""

      try {
        while (true) {
          const { done, value } = await reader.read()

          if (done) {
            break
          }

          // Decode the chunk and add it to our accumulated content
          const chunk = decoder.decode(value, { stream: true })

          // Process the chunk to extract the content
          try {
            // For Claude API, each chunk is a JSON object with a type and content
            const lines = chunk.split("\n").filter((line) => line.trim() !== "")

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const jsonStr = line.slice(6) // Remove 'data: ' prefix

                if (jsonStr === "[DONE]") {
                  continue // End of stream marker
                }

                try {
                  const data = JSON.parse(jsonStr)

                  if (data.type === "content_block_delta" && data.delta && data.delta.text) {
                    accumulatedContent += data.delta.text
                    setStreamingContent(accumulatedContent)
                  }
                } catch (e) {
                  console.error("Error parsing JSON from chunk:", e)
                }
              }
            }
          } catch (e) {
            console.error("Error processing chunk:", e)
          }
        }
      } catch (error) {
        console.error("Error reading stream:", error)
        throw new Error("Error reading stream: " + (error instanceof Error ? error.message : String(error)))
      }

      // If we didn't get a GENERATION_COMPLETE marker, handle completion here
      if (!generationComplete && accumulatedContent) {
        // Parse the HTML into separate files
        const files = [
          {
            name: "index.html",
            content: accumulatedContent,
          },
        ]

        // Extract CSS and JS as before
        let cssContent = ""
        const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi
        let styleMatch
        while ((styleMatch = styleRegex.exec(accumulatedContent)) !== null) {
          cssContent += styleMatch[1] + "\n\n"
        }

        let jsContent = ""
        const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi
        let scriptMatch
        while ((scriptMatch = scriptRegex.exec(accumulatedContent)) !== null) {
          if (!scriptMatch[0].includes("src=")) {
            jsContent += scriptMatch[1] + "\n\n"
          }
        }

        if (cssContent.trim()) {
          files.push({
            name: "styles.css",
            content: cssContent.trim(),
          })
        }

        if (jsContent.trim()) {
          files.push({
            name: "script.js",
            content: jsContent.trim(),
          })
        }

        setParsedFiles(files)
        setPreviewReady(true)
        setIsStreaming(false)
        setCurrentStep("idle")
      }

      // Clear the enhancement prompt after successful generation
      setEnhancementPrompt("")
    } catch (err: any) {
      console.error("Error in website generation process:", err)
      setError(err.message || "An error occurred during the website generation process")
      setCurrentStep("idle")
      setIsStreaming(false)
    }
  }

  const handleDeployToVercel = async () => {
    if (!parsedFiles.length) return

    setCurrentStep("deploying")

    try {
      // Send the raw parsed files for static deployment
      const deployResponse = await fetch("/api/deploy-to-vercel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: parsedFiles, // Send raw parsed files instead of Vite format
          projectName,
        }),
      })

      if (!deployResponse.ok) {
        const errorData = await deployResponse.json()
        throw new Error(errorData.error || `Failed to deploy: ${deployResponse.statusText}`)
      }

      const deployData = await deployResponse.json()
      setDeploymentUrl(deployData.deploymentUrl)

      // Show success toast
      toast({
        title: "🚀 Website Deployed Successfully",
        description: `Your website is now live at ${deployData.deploymentUrl}`,
        duration: 5000,
      })

      setCurrentStep("idle")
    } catch (err: any) {
      console.error("Error deploying to Vercel:", err)
      setError(err.message || "Failed to deploy to Vercel")
      setCurrentStep("idle")
    }
  }

  const downloadWebsite = async () => {
    if (!parsedFiles.length) return

    try {
      // Create a new zip instance
      const zip = new JSZip()

      // Add all the parsed files to the zip
      parsedFiles.forEach((file) => {
        // Create folders if the file path contains directories
        const filePath = file.name
        zip.file(filePath, file.content)
      })

      // Add a simple package.json for those who want to run it locally
      zip.file(
        "package.json",
        JSON.stringify(
          {
            name: projectName.toLowerCase().replace(/\s+/g, "-"),
            version: "1.0.0",
            description: "Website generated with AI",
            scripts: {
              start: "serve .",
            },
            dependencies: {
              serve: "^14.0.0",
            },
          },
          null,
          2,
        ),
      )

      // Add a README file with instructions
      zip.file(
        "README.md",
        `# ${projectName}

This website was generated using AI. Here's how to use these files:

## Option 1: Simple viewing
Open the index.html file directly in your browser.

## Option 2: Local development server
1. Install Node.js if you don't have it: https://nodejs.org/
2. Open a terminal in this folder
3. Run: npm install
4. Run: npm start
5. Open your browser to the URL shown in the terminal

## Files included
- index.html: The main HTML file
- styles.css: CSS styles for the website
- script.js: JavaScript functionality

Made with ✨ AI Website Generator
      `,
      )

      // Generate the zip file
      const content = await zip.generateAsync({ type: "blob" })

      // Create a download link
      const url = URL.createObjectURL(content)
      const a = document.createElement("a")
      a.href = url
      a.download = `${projectName.toLowerCase().replace(/\s+/g, "-")}.zip`
      document.body.appendChild(a)
      a.click()

      // Clean up
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "📥 Website Downloaded",
        description: "Your website files have been downloaded as a zip file",
        duration: 3000,
      })
    } catch (err) {
      console.error("Error creating zip file:", err)
      toast({
        title: "❌ Download Failed",
        description: "Failed to create zip file. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const shareWebsite = async () => {
    if (!deploymentUrl) return

    try {
      await navigator.clipboard.writeText(deploymentUrl)
      toast({
        title: "🔗 Link Copied",
        description: "Website URL copied to clipboard",
        duration: 3000,
      })
    } catch (err) {
      console.error("Failed to copy:", err)
    }
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
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
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
          <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800/50 rounded-2xl overflow-hidden shadow-2xl">
            {/* Preview Section - Now at the top */}
            <div className="relative" ref={previewRef} style={{ height: containerHeight }}>
              <AnimatePresence mode="wait">
                {previewReady || isStreaming ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full"
                  >
                    {showSuccess && !isStreaming && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20"
                      >
                        <div className="bg-green-500/20 backdrop-blur-sm text-green-400 border border-green-500/30 px-4 py-2 rounded-full flex items-center shadow-lg">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          <span>Website generated successfully!</span>
                        </div>
                      </motion.div>
                    )}

                    {/* Real-time preview */}
                    <HtmlPreview
                      files={parsedFiles}
                      height={containerHeight}
                      showDeviceControls={false}
                      showNavigator={false}
                      minimalUI={true}
                      streamingContent={streamingContent}
                      isStreaming={isStreaming}
                    />

                    {/* Building indicator */}
                    {isStreaming && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-[#d4af37]/20 backdrop-blur-sm text-[#d4af37] border border-[#d4af37]/30 px-4 py-2 rounded-full flex items-center shadow-lg"
                        >
                          <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                          <span>Building your website in real-time...</span>
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center h-full bg-gray-950/50"
                  >
                    {currentStep !== "idle" ? (
                      <div className="text-center max-w-md">
                        <div className="relative mb-8">
                          <div className="absolute inset-0 bg-[#d4af37]/20 rounded-full blur-xl animate-pulse" />
                          <div className="relative z-10 flex items-center justify-center">
                            <Sparkles className="h-16 w-16 text-[#d4af37] animate-pulse" />
                          </div>
                        </div>

                        <p className="text-gray-300 font-medium text-lg">
                          {currentStep === "enhancing"
                            ? "Enhancing your idea with AI..."
                            : currentStep === "generating"
                              ? "Preparing to build your website..."
                              : "Deploying to the cloud..."}
                        </p>

                        <p className="text-gray-500 text-sm mt-4">
                          {currentStep === "enhancing"
                            ? "Making your vision clearer"
                            : currentStep === "generating"
                              ? "Getting ready to show you real-time progress"
                              : "Almost there..."}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center max-w-md">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/10 mb-6">
                          <Globe className="h-10 w-10 text-[#d4af37]" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-200">Your Website Preview</h3>
                        <p className="text-gray-400 mb-6">
                          {previewReady
                            ? "Your website is ready! Upgrade it using the form below"
                            : "Describe your dream website below and watch it come to life in real-time"}
                        </p>
                        <Button
                          onClick={() => inputRef.current?.focus()}
                          className="bg-gradient-to-r from-[#d4af37]/20 to-[#b8860b]/20 hover:from-[#d4af37]/30 hover:to-[#b8860b]/30 text-[#d4af37] border-[#d4af37]/30"
                        >
                          <Sparkles className="mr-2 h-4 w-4" />
                          Start Creating
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-0 left-0 right-0 p-4 bg-red-900/20 backdrop-blur-sm border-t border-red-800/50"
                  >
                    <Alert className="bg-transparent border-0 p-0">
                      <AlertDescription className="text-red-300 text-sm flex items-center justify-between">
                        <span>{error}</span>
                        <Button
                          onClick={() => setError("")}
                          variant="ghost"
                          size="sm"
                          className="text-red-300 hover:text-red-200"
                        >
                          Dismiss
                        </Button>
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Deployment Success */}
              <AnimatePresence>
                {deploymentUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-0 left-0 right-0 p-4 bg-green-900/20 backdrop-blur-sm border-t border-green-800/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-500/20 p-1.5 rounded-full">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        </div>
                        <div>
                          <p className="text-green-300 text-sm font-medium">Website deployed successfully!</p>
                          <a
                            href={deploymentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-400 hover:text-green-300 text-xs underline flex items-center"
                          >
                            {deploymentUrl}
                            <ArrowUpRight className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={shareWebsite}
                          variant="ghost"
                          size="sm"
                          className="text-green-400 hover:text-green-300 border border-green-500/20 hover:bg-green-500/10"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Button
                          onClick={() => window.open(deploymentUrl, "_blank")}
                          variant="ghost"
                          size="sm"
                          className="text-green-400 hover:text-green-300 border border-green-500/20 hover:bg-green-500/10"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input Section - Now below the preview */}
            <div className="relative p-6 border-t border-gray-800/50">
              <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/5 to-[#b8860b]/5" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#d4af37]/10 rounded-lg">
                      <Wand2 className="h-5 w-5 text-[#d4af37]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">
                        {previewReady ? "Upgrade Your Website" : "Create Your Website"}
                      </h2>
                      <p className="text-xs text-gray-400">
                        {previewReady ? "Enhance and improve your design" : "Tell me what you want to build"}
                      </p>
                    </div>
                  </div>
                  <AnimatePresence>
                    {previewReady && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center space-x-2"
                      >
                        <Link href="/">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white"
                            title="Create a new website"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          onClick={downloadWebsite}
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white"
                          title="Download as ZIP"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {deploymentUrl && (
                          <Button
                            onClick={shareWebsite}
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          onClick={handleDeployToVercel}
                          disabled={currentStep !== "idle"}
                          className="bg-gradient-to-r from-[#d4af37] to-[#b8860b] hover:opacity-90 text-black font-medium"
                        >
                          {currentStep === "deploying" ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Deploying...
                            </>
                          ) : deploymentUrl ? (
                            <>
                              <Globe className="mr-2 h-4 w-4" />
                              Redeploy
                            </>
                          ) : (
                            <>
                              <Rocket className="mr-2 h-4 w-4" />
                              Deploy
                            </>
                          )}
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative">
                  <textarea
                    ref={inputRef}
                    value={previewReady ? enhancementPrompt : prompt}
                    onChange={(e) => {
                      if (previewReady) {
                        setEnhancementPrompt(e.target.value)
                      } else {
                        setPrompt(e.target.value)
                      }
                      setIsTyping(true)
                      setTimeout(() => setIsTyping(false), 1000)
                    }}
                    placeholder={
                      previewReady
                        ? "Add a contact form, change the color scheme, add animations, improve the layout..."
                        : "Create a modern portfolio website with a hero section, project gallery, and contact form..."
                    }
                    className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4af37]/50 focus:ring-2 focus:ring-[#d4af37]/20 resize-none transition-all duration-300"
                    rows={3}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        if (previewReady) {
                          handleGenerateWebsite(enhancementPrompt)
                        } else {
                          handleGenerateWebsite(prompt, true)
                        }
                      }
                    }}
                  />
                  {((previewReady && enhancementPrompt.trim()) || (!previewReady && prompt.trim())) && (
                    <Button
                      onClick={() => {
                        if (previewReady) {
                          handleGenerateWebsite(enhancementPrompt)
                        } else {
                          handleGenerateWebsite(prompt, true)
                        }
                      }}
                      disabled={currentStep !== "idle"}
                      className="mt-3 w-full bg-gradient-to-r from-[#d4af37] to-[#b8860b] hover:opacity-90 text-black font-medium"
                    >
                      {currentStep !== "idle" ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {currentStep === "enhancing"
                            ? "Enhancing..."
                            : currentStep === "generating"
                              ? "Upgrading..."
                              : "Processing..."}
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          {previewReady ? "Apply Upgrades" : "Generate Website"}
                        </>
                      )}
                    </Button>
                  )}
                  <div className="absolute right-3 bottom-3 flex items-center space-x-2">
                    {((previewReady && enhancementPrompt.trim()) || (!previewReady && prompt.trim())) && (
                      <Button
                        onClick={() => {
                          if (previewReady) {
                            setEnhancementPrompt("")
                          } else {
                            setPrompt("")
                          }
                        }}
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 rounded-full text-gray-400 hover:text-white hover:bg-gray-700/50"
                      >
                        ×
                      </Button>
                    )}
                    <AnimatePresence>
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                        >
                          <Badge className="bg-gray-700/50 text-gray-400 text-xs">Press Enter to generate</Badge>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Example prompts - Only show when no website is generated */}
                {!previewReady && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {examplePrompts.map((example, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => {
                          setPrompt(example.text)
                          inputRef.current?.focus()
                        }}
                        className="flex items-center space-x-1.5 text-xs bg-gray-800/70 hover:bg-gray-700/70 text-gray-300 px-3.5 py-2 rounded-full border border-gray-700/50 transition-all duration-300 hover:border-[#d4af37]/30 hover:scale-105 hover:shadow-md hover:shadow-[#d4af37]/5"
                      >
                        <span className="p-1 bg-[#d4af37]/10 rounded-full">{example.icon}</span>
                        <span>{example.text}</span>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Info message when website is ready */}
                {previewReady && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-xs text-gray-500 flex items-center justify-center"
                  >
                    <span>Want to create a new website?</span>
                    <Link href="/" className="ml-1 text-[#d4af37] hover:text-[#b8860b] underline">
                      Go back to home
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-center space-x-4 mt-6"
        >
          <Badge className="bg-gray-900/40 backdrop-blur-sm border-gray-800/50 text-gray-400">
            <Zap className="h-3 w-3 mr-1" />
            Real-Time Preview
          </Badge>
          <Badge className="bg-gray-900/40 backdrop-blur-sm border-gray-800/50 text-gray-400">
            <Globe className="h-3 w-3 mr-1" />
            One-Click Deploy
          </Badge>
          <Badge className="bg-gray-900/40 backdrop-blur-sm border-gray-800/50 text-gray-400">
            <Code2 className="h-3 w-3 mr-1" />
            No Coding Required
          </Badge>
        </motion.div>
      </div>
    </div>
  )
}
