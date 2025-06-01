"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Accessibility, Gauge, Search, Sparkle } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { DesignStyle, ColorScheme } from "@/utils/theme-generator"

interface GeneratorConfig {
  prompt: string
  style: DesignStyle
  colorScheme: ColorScheme
  features: string[]
  animations: boolean
  accessibility: boolean
  performance: boolean
  seo: boolean
  interactivity: "high" | "medium" | "low"
}

const FEATURE_OPTIONS = [
  { value: "contact-form", label: "Contact Form", icon: "📝" },
  { value: "image-gallery", label: "Image Gallery", icon: "🖼️" },
  { value: "testimonials", label: "Testimonials", icon: "💬" },
  { value: "pricing-table", label: "Pricing Table", icon: "💰" },
  { value: "team-section", label: "Team Section", icon: "👥" },
  { value: "blog-layout", label: "Blog Layout", icon: "📰" },
  { value: "video-hero", label: "Video Hero", icon: "🎥" },
  { value: "countdown-timer", label: "Countdown Timer", icon: "⏰" },
  { value: "newsletter-signup", label: "Newsletter Signup", icon: "📧" },
  { value: "social-feed", label: "Social Feed", icon: "🌐" },
]

export function EnhancedGeneratorUI() {
  const [config, setConfig] = useState<GeneratorConfig>({
    prompt: "",
    style: "modern",
    colorScheme: "vibrant",
    features: [],
    animations: true,
    accessibility: true,
    performance: true,
    seo: true,
    interactivity: "high",
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCode, setGeneratedCode] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("config")
  const [generationProgress, setGenerationProgress] = useState(0)

  const handleGenerate = async () => {
    if (!config.prompt.trim()) {
      alert("Please describe your website first")
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)
    setActiveTab("preview")

    // Simulate progress
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => Math.min(prev + 10, 90))
    }, 500)

    try {
      const response = await fetch("/api/generate-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedCode(data)
        setGenerationProgress(100)
      } else {
        throw new Error(data.error || "Generation failed")
      }
    } catch (error) {
      console.error("Generation error:", error)
      alert("Failed to generate website. Please try again.")
    } finally {
      clearInterval(progressInterval)
      setIsGenerating(false)
    }
  }

  const toggleFeature = (feature: string) => {
    setConfig((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }))
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Ultra Enhanced AI Website Generator
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Create stunning, production-ready websites with advanced AI
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="config">Configure</TabsTrigger>
          <TabsTrigger value="preview" disabled={!generatedCode && !isGenerating}>
            Preview
          </TabsTrigger>
          <TabsTrigger value="code" disabled={!generatedCode}>
            Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Website Configuration
              </CardTitle>
              <CardDescription>Customize every aspect of your generated website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Prompt Input */}
              <div className="space-y-2">
                <Label htmlFor="prompt">Describe Your Website</Label>
                <Textarea
                  id="prompt"
                  placeholder="E.g., A modern SaaS landing page for a project management tool with pricing, features, and testimonials..."
                  value={config.prompt}
                  onChange={(e) => setConfig((prev) => ({ ...prev, prompt: e.target.value }))}
                  className="min-h-[120px]"
                />
              </div>

              {/* Style and Color Scheme */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="style">Design Style</Label>
                  <Select
                    value={config.style}
                    onValueChange={(value: DesignStyle) => setConfig((prev) => ({ ...prev, style: value }))}
                  >
                    <SelectTrigger id="style">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="minimalist">Minimalist</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                      <SelectItem value="elegant">Elegant</SelectItem>
                      <SelectItem value="playful">Playful</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="colorScheme">Color Scheme</Label>
                  <Select
                    value={config.colorScheme}
                    onValueChange={(value: ColorScheme) => setConfig((prev) => ({ ...prev, colorScheme: value }))}
                  >
                    <SelectTrigger id="colorScheme">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vibrant">Vibrant</SelectItem>
                      <SelectItem value="monochrome">Monochrome</SelectItem>
                      <SelectItem value="pastel">Pastel</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <Label>Additional Features</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {FEATURE_OPTIONS.map((feature) => (
                    <button
                      key={feature.value}
                      onClick={() => toggleFeature(feature.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        config.features.includes(feature.value)
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-950"
                          : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{feature.icon}</span>
                        <span className="text-sm font-medium">{feature.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Options */}
              <div className="space-y-4">
                <Label>Advanced Options</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkle className="w-4 h-4 text-purple-500" />
                      <span>Animations</span>
                    </div>
                    <Switch
                      checked={config.animations}
                      onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, animations: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Accessibility className="w-4 h-4 text-blue-500" />
                      <span>Accessibility</span>
                    </div>
                    <Switch
                      checked={config.accessibility}
                      onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, accessibility: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-green-500" />
                      <span>Performance</span>
                    </div>
                    <Switch
                      checked={config.performance}
                      onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, performance: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-orange-500" />
                      <span>SEO</span>
                    </div>
                    <Switch
                      checked={config.seo}
                      onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, seo: checked }))}
                    />
                  </div>
                </div>
              </div>

              {/* Interactivity Level */}
              <div className="space-y-2">
                <Label htmlFor="interactivity">Interactivity Level</Label>
                <Select
                  value={config.interactivity}
                  onValueChange={(value: any) => setConfig((prev) => ({ ...prev, interactivity: value }))}
                >
                  <SelectTrigger id="interactivity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !config.prompt.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                size="lg"
              >
                {isGenerating ? "Generating..." : "Generate Website"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Website Preview</CardTitle>
              <CardDescription>
                {isGenerating ? "Generating your website..." : "Your generated website"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="space-y-4 py-8">
                  <Progress value={generationProgress} className="w-full" />
                  <p className="text-center text-sm text-gray-500">
                    {generationProgress < 30 && "Analyzing your requirements..."}
                    {generationProgress >= 30 && generationProgress < 60 && "Designing your website..."}
                    {generationProgress >= 60 && generationProgress < 90 && "Optimizing code and assets..."}
                    {generationProgress >= 90 && "Finalizing your website..."}
                  </p>
                </div>
              ) : generatedCode ? (
                <div className="space-y-4">
                  <div className="border rounded-lg overflow-hidden h-[600px]">
                    <iframe
                      srcDoc={generatedCode.fullCode}
                      title="Website Preview"
                      className="w-full h-full"
                      sandbox="allow-scripts"
                    />
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Quality Score:</span>
                      <span
                        className={`text-sm font-bold ${
                          generatedCode.validation.score >= 90
                            ? "text-green-500"
                            : generatedCode.validation.score >= 70
                              ? "text-yellow-500"
                              : "text-red-500"
                        }`}
                      >
                        {generatedCode.validation.score}/100
                      </span>
                    </div>
                    <Button onClick={() => setActiveTab("code")}>View Code</Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Configure and generate a website to see the preview
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="space-y-6">
          {generatedCode ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>Generated Code</CardTitle>
                  <CardDescription>HTML, CSS, and JavaScript for your website</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Tabs defaultValue="html" className="w-full">
                    <TabsList className="w-full justify-start rounded-none px-6">
                      <TabsTrigger value="html">HTML</TabsTrigger>
                      <TabsTrigger value="css">CSS</TabsTrigger>
                      <TabsTrigger value="js">JavaScript</TabsTrigger>
                      <TabsTrigger value="full">Full Code</TabsTrigger>
                    </TabsList>
                    <TabsContent value="html" className="p-0">
                      <pre className="language-html rounded-t-none overflow-auto max-h-[500px] p-6 text-sm bg-gray-50 dark:bg-gray-900">
                        <code>{generatedCode.html}</code>
                      </pre>
                    </TabsContent>
                    <TabsContent value="css" className="p-0">
                      <pre className="language-css rounded-t-none overflow-auto max-h-[500px] p-6 text-sm bg-gray-50 dark:bg-gray-900">
                        <code>{generatedCode.css}</code>
                      </pre>
                    </TabsContent>
                    <TabsContent value="js" className="p-0">
                      <pre className="language-javascript rounded-t-none overflow-auto max-h-[500px] p-6 text-sm bg-gray-50 dark:bg-gray-900">
                        <code>{generatedCode.javascript}</code>
                      </pre>
                    </TabsContent>
                    <TabsContent value="full" className="p-0">
                      <pre className="language-html rounded-t-none overflow-auto max-h-[500px] p-6 text-sm bg-gray-50 dark:bg-gray-900">
                        <code>{generatedCode.fullCode}</code>
                      </pre>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>Download & Deploy</CardTitle>
                  <CardDescription>Get your website files or deploy directly</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 10l5 5 5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 15V3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Download ZIP
                  </Button>
                  <Button className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 7.5v9l-4-2.25V9.75L20 7.5z" fill="currentColor" />
                      <path d="M12 17l-8-4.5v-9L12 8v9z" fill="currentColor" />
                    </svg>
                    Deploy to Vercel
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Push to GitHub
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12 text-gray-500">Generate a website to view the code</CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
