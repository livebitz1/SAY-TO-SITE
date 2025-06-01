"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

interface LoadingScreenProps {
  prompt?: string
  componentType?:
    | "token-tracker"
    | "wallet-connect"
    | "wallet-analyzer"
    | "pnl-checker"
    | "token-burner"
    | "wallet-dashboard"
    | "default"
}

export default function LoadingScreen({ prompt, componentType = "default" }: LoadingScreenProps) {
  const [loadingText, setLoadingText] = useState("Initializing...")
  const [progress, setProgress] = useState(0)

  // Get component-specific loading messages
  const getLoadingMessages = () => {
    switch (componentType) {
      case "token-tracker":
        return [
          "Initializing token tracker...",
          "Connecting to Solana network...",
          "Setting up real-time monitoring...",
          "Configuring price alerts...",
          "Preparing dashboard...",
        ]
      case "wallet-connect":
        return [
          "Initializing wallet connector...",
          "Setting up Phantom integration...",
          "Configuring secure connection...",
          "Preparing authentication...",
          "Almost ready...",
        ]
      case "wallet-analyzer":
        return [
          "Initializing wallet analyzer...",
          "Setting up portfolio tracking...",
          "Configuring NFT detection...",
          "Preparing analytics engine...",
          "Almost ready...",
        ]
      case "pnl-checker":
        return [
          "Initializing PNL checker...",
          "Setting up trade tracking...",
          "Configuring profit calculations...",
          "Preparing performance metrics...",
          "Almost ready...",
        ]
      case "token-burner":
        return [
          "Initializing token burner...",
          "Setting up secure burn mechanism...",
          "Configuring transaction verification...",
          "Preparing burn interface...",
          "Almost ready...",
        ]
      case "wallet-dashboard":
        return [
          "Initializing wallet dashboard...",
          "Setting up portfolio overview...",
          "Configuring asset tracking...",
          "Preparing transaction history...",
          "Almost ready...",
        ]
      default:
        return [
          "Analyzing your prompt...",
          "Generating components...",
          "Applying styles...",
          "Optimizing for performance...",
          "Almost ready...",
        ]
    }
  }

  useEffect(() => {
    const messages = getLoadingMessages()
    let currentIndex = 0
    let progressValue = 0

    const interval = setInterval(() => {
      if (currentIndex < messages.length) {
        setLoadingText(messages[currentIndex])
        currentIndex++
      }

      // Increment progress
      progressValue += 5
      if (progressValue > 100) progressValue = 100
      setProgress(progressValue)

      // Clear interval when done
      if (progressValue >= 100) {
        clearInterval(interval)
      }
    }, 600)

    return () => clearInterval(interval)
  }, [componentType])

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-4 z-50">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#d4af37]/10 to-black pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-md text-center">
        {/* Logo */}
        <div className="mb-8 relative">
          <Image src="/images/s2s-logo.png" alt="Say2Site Logo" width={80} height={80} className="animate-spin-slow" />
          <div className="absolute inset-0 bg-[#d4af37] opacity-20 blur-xl rounded-full" />
        </div>

        {/* Loading text */}
        <h2 className="text-2xl font-bold mb-2 text-white">{loadingText}</h2>

        {/* Show prompt if provided */}
        {prompt && (
          <p className="text-gray-400 mb-6 max-w-sm">
            Creating{" "}
            <span className="font-medium text-[#d4af37]">
              {prompt.length > 50 ? prompt.substring(0, 50) + "..." : prompt}
            </span>
          </p>
        )}

        {/* Progress bar */}
        <div className="w-full max-w-xs bg-black rounded-full h-2 mb-8 overflow-hidden border border-[#d4af37]/20">
          <motion.div
            className="h-full bg-[#d4af37]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Tips */}
        <div className="text-sm text-gray-500">
          <p>
            Powered by{" "}
            <span className="font-medium bg-gradient-to-r from-[#d4af37] to-[#b8860b] bg-clip-text text-transparent">
              Say2Site AI
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
