"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import {
  Sparkles,
  Loader2,
  ShoppingCart,
  FileInput,
  Briefcase,
  GraduationCap,
  Heart,
  Camera,
  Newspaper,
  Calendar,
  AlertCircle,
} from "lucide-react"
import LoadingScreen from "@/components/loading-screen"
import { MinimalistButton } from "@/components/minimalist-button"
import { toast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Home() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [currentComponent, setCurrentComponent] = useState<
    | "token-tracker"
    | "wallet-connect"
    | "wallet-analyzer"
    | "pnl-checker"
    | "token-burner"
    | "wallet-dashboard"
    | "default"
  >("default")
  const promptSectionRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [hasVisited, setHasVisited] = useState(false)
  const [showBetaAlert, setShowBetaAlert] = useState(false)

  // Check if this is the first visit
  useEffect(() => {
    const visited = localStorage.getItem("hasVisitedBefore")
    if (!visited) {
      setHasVisited(false)
      localStorage.setItem("hasVisitedBefore", "true")
    } else {
      setHasVisited(true)
    }
  }, [])

  const handleBuildTracker = () => {
    setCurrentComponent("token-tracker")
    setIsGenerating(true)
    setTimeout(() => {
      window.location.href = "/token-tracker"
    }, 3000)
  }

  const handleBuildWalletConnect = () => {
    setCurrentComponent("wallet-connect")
    setIsGenerating(true)
    setTimeout(() => {
      window.location.href = "/wallet-connect"
    }, 3000)
  }

  const handleBuildWalletAnalyzer = () => {
    setCurrentComponent("wallet-analyzer")
    setIsGenerating(true)
    setTimeout(() => {
      window.location.href = "/wallet-analyzer"
    }, 3000)
  }

  const handleBuildPNLChecker = () => {
    setCurrentComponent("pnl-checker")
    setIsGenerating(true)
    setTimeout(() => {
      window.location.href = "/pnl-checker"
    }, 3000)
  }

  const handleBuildTokenBurner = () => {
    setCurrentComponent("token-burner")
    setIsGenerating(true)
    setTimeout(() => {
      window.location.href = "/token-burner"
    }, 3000)
  }

  const handleBuildWalletDashboard = () => {
    setCurrentComponent("wallet-dashboard")
    setIsGenerating(true)
    setTimeout(() => {
      window.location.href = "/wallet-dashboard"
    }, 3000)
  }

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please enter a prompt to enhance.",
        variant: "destructive",
      })
      return
    }

    setIsEnhancing(true)

    try {
      // Simulate AI enhancement with Web2 improvements
      setTimeout(() => {
        const enhancedPrompt = enhanceWeb2Prompt(prompt)

        setPrompt(enhancedPrompt)
        setIsEnhancing(false)

        toast({
          title: "Prompt Enhanced",
          description: "Your prompt has been improved with additional details.",
        })
      }, 1500)
    } catch (error) {
      console.error("Error enhancing prompt:", error)
      toast({
        title: "Enhancement Failed",
        description: "Unable to enhance your prompt. Please try again.",
        variant: "destructive",
      })
      setIsEnhancing(false)
    }
  }

  // Helper function to enhance Web2 prompts
  const enhanceWeb2Prompt = (originalPrompt: string): string => {
    // Add design details if not present
    let enhanced = originalPrompt

    if (!enhanced.toLowerCase().includes("design")) {
      enhanced += " with a modern, clean design"
    }

    // Add responsive details if not mentioned
    if (!enhanced.toLowerCase().includes("responsive")) {
      enhanced += ", fully responsive for mobile and desktop"
    }

    // Add accessibility if not mentioned
    if (!enhanced.toLowerCase().includes("accessible") && !enhanced.toLowerCase().includes("a11y")) {
      enhanced += ", accessible to all users"
    }

    // Add SEO if not mentioned
    if (!enhanced.toLowerCase().includes("seo")) {
      enhanced += ", optimized for search engines"
    }

    return enhanced
  }

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    try {
      // Directly redirect to web2-generator with prompt without showing loading screen
      const encodedPrompt = encodeURIComponent(prompt)
      window.location.href = `/web2-generator?prompt=${encodedPrompt}`
    } catch (error) {
      console.error("Error redirecting to generator:", error)
      toast({
        title: "Navigation Error",
        description: "Unable to navigate to the generator page. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle suggestion button clicks
  const handleSuggestionClick = (suggestionPrompt: string) => {
    setPrompt(suggestionPrompt)
    // Automatically submit the form after a short delay
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.requestSubmit()
      }
    }, 100)
  }

  // Suggestion prompts
  const suggestions = [
    {
      icon: <ShoppingCart className="h-4 w-4" />,
      text: "E-commerce website",
      prompt:
        "Create a modern e-commerce website with product listings, shopping cart, checkout process, and payment integration",
    },
    {
      icon: <FileInput className="h-4 w-4" />,
      text: "Contact form",
      prompt: "Create a professional contact form with name, email, phone, message fields, and email validation",
    },
    {
      icon: <Briefcase className="h-4 w-4" />,
      text: "Portfolio website",
      prompt:
        "Create a creative portfolio website with project gallery, about section, skills showcase, and contact information",
    },
    {
      icon: <GraduationCap className="h-4 w-4" />,
      text: "Educational platform",
      prompt:
        "Create an educational platform with course listings, video lessons, quizzes, and student progress tracking",
    },
    {
      icon: <Heart className="h-4 w-4" />,
      text: "Healthcare website",
      prompt: "Create a healthcare website with appointment booking, doctor profiles, services, and patient portal",
    },
    {
      icon: <Camera className="h-4 w-4" />,
      text: "Photography portfolio",
      prompt:
        "Create a photography portfolio with image galleries, client testimonials, booking system, and pricing packages",
    },
    {
      icon: <Newspaper className="h-4 w-4" />,
      text: "Blog website",
      prompt: "Create a blog website with article listings, categories, search functionality, and comment system",
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      text: "Event booking",
      prompt:
        "Create an event booking website with calendar view, ticket purchasing, venue information, and registration forms",
    },
  ]

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const navbarAnimation = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1,
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const backgroundAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1.2,
      },
    },
  }

  const handleAssetIconClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowBetaAlert(true)

    // Auto-hide the alert after 5 seconds
    setTimeout(() => {
      setShowBetaAlert(false)
    }, 5000)
  }

  if (isGenerating) {
    return <LoadingScreen prompt={prompt} componentType={currentComponent} />
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Gold gradient background */}
      <motion.div
        className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#d4af37]/40 via-[#d4af37]/20 to-transparent"
        initial={!hasVisited ? "hidden" : "visible"}
        animate="visible"
        variants={backgroundAnimation}
      />

      {/* Navigation */}
      <motion.header
        className="relative z-20 px-6 py-4 flex items-center justify-between"
        initial={!hasVisited ? "hidden" : "visible"}
        animate="visible"
        variants={navbarAnimation}
      >
        <Link href="/" className="font-bold text-2xl flex items-center">
          <Image src="/images/new-logo.png" alt="New Say-to-Site Logo" width={40} height={40} className="mr-2" />
          <span className="text-white">Say-to-Site</span>
        </Link>

        <div className="flex items-center gap-4"></div>
      </motion.header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20 pt-[70px] relative z-10">
        <div className="max-w-5xl w-full text-center">
          {/* Hero heading */}
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={!hasVisited ? "hidden" : "visible"}
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            What do you want to <span className="text-[#d4af37]">build</span> today?
          </motion.h1>

          {/* Subtitle */}
          <motion.div
            className="text-lg mb-10 relative z-10 max-w-3xl mx-auto"
            initial={!hasVisited ? "hidden" : "visible"}
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <p className="mb-3">
              <span className="font-semibold bg-gradient-to-r from-[#d4af37] to-[#b8860b] bg-clip-text text-transparent">
                Transform your ideas into stunning websites
              </span>{" "}
              powered by AI in{" "}
              <span className="font-semibold bg-gradient-to-r from-[#d4af37] to-[#b8860b] bg-clip-text text-transparent">
                seconds
              </span>
              .
            </p>
          </motion.div>

          {/* Custom prompt section */}
          <motion.div
            ref={promptSectionRef}
            className="mt-12 pt-8 border-t border-[#d4af37]/20"
            initial={!hasVisited ? "hidden" : "visible"}
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            <form ref={formRef} onSubmit={handlePromptSubmit}>
              <motion.div
                className="bg-gradient-to-b from-black to-black backdrop-blur-sm rounded-xl p-1 border border-[#d4af37]/30 mb-4 max-w-md mx-auto shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all relative"
                initial={!hasVisited ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <div className="flex items-center gap-3 p-7">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the website you want to create..."
                    className="bg-transparent border-none text-white placeholder:text-gray-500 focus:outline-none focus:ring-0 focus:ring-offset-0 text-base flex-1 py-3 resize-none h-[60px] max-h-[120px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#d4af37]/30 scrollbar-track-transparent"
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "rgba(212, 175, 55, 0.3) transparent",
                    }}
                  />
                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      className="text-[#d4af37] hover:text-white transition-colors cursor-pointer"
                      onClick={handleAssetIconClick}
                      title="Upload assets (Coming soon)"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className={`text-[#d4af37] hover:text-white transition-colors ${isEnhancing ? "animate-pulse" : ""}`}
                      onClick={handleEnhancePrompt}
                      disabled={isEnhancing}
                      title="Enhance your prompt with AI"
                    >
                      {isEnhancing ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Suggestion buttons */}
              <motion.div
                className="flex flex-wrap justify-center gap-2 mb-8 max-w-3xl mx-auto"
                initial={!hasVisited ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion.prompt)}
                    className="flex items-center gap-2 px-4 py-2 bg-black border border-[#d4af37]/30 rounded-full text-sm text-gray-300 hover:text-white hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-all"
                  >
                    {suggestion.icon}
                    {suggestion.text}
                  </button>
                ))}
              </motion.div>

              <motion.div
                className="mt-8"
                initial={!hasVisited ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                <MinimalistButton type="submit" disabled={!prompt.trim()} className="min-w-[180px] h-12 text-base">
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Generate
                  </div>
                </MinimalistButton>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </main>
      {showBetaAlert && (
        <motion.div
          className="fixed bottom-6 right-6 z-50 max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <Alert className="border border-[#d4af37] bg-black text-white">
            <AlertCircle className="h-4 w-4 text-[#d4af37]" />
            <AlertTitle className="text-[#d4af37] font-medium">Beta Feature</AlertTitle>
            <AlertDescription className="text-gray-300">
              Asset upload functionality is coming soon! We're working hard to bring you the ability to upload and
              manage assets directly in Say-to-Site.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </div>
  )
}
