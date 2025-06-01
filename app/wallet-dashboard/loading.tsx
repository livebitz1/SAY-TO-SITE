"use client"

import { useState, useEffect } from "react"
import { Sparkles, Database, DollarSign, Grid, Activity, Check } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function WalletDashboardLoading() {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(5)

  const steps = [
    { icon: Sparkles, text: "Analyzing dashboard requirements..." },
    { icon: Database, text: "Setting up Helius RPC connection..." },
    { icon: DollarSign, text: "Building portfolio overview..." },
    { icon: Grid, text: "Integrating NFT collections..." },
    { icon: Activity, text: "Adding transaction history..." },
    { icon: Check, text: "Finalizing dashboard interface..." },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        // Calculate new progress
        const newProgress = prev + 100 / (5000 / 100) // 5000ms total time

        // Update current step based on progress
        if (newProgress >= 15 && currentStep < 1) setCurrentStep(1)
        if (newProgress >= 30 && currentStep < 2) setCurrentStep(2)
        if (newProgress >= 50 && currentStep < 3) setCurrentStep(3)
        if (newProgress >= 70 && currentStep < 4) setCurrentStep(4)
        if (newProgress >= 90 && currentStep < 5) setCurrentStep(5)

        return Math.min(newProgress, 100)
      })

      setTimeRemaining((prev) => Math.max(prev - 0.1, 0))
    }, 100)

    return () => clearInterval(interval)
  }, [currentStep])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Solana gradient background */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-purple-600/50 via-purple-500/30 to-transparent" />

      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <div className="max-w-md w-full">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center mb-6 relative">
              <Sparkles className="h-10 w-10 text-purple-400 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-2 border-purple-400 border-dashed animate-spin-slow"></div>
            </div>
            <h1 className="text-2xl font-bold mb-2 text-center">Building Your Wallet Dashboard</h1>
            <p className="text-gray-400 text-center mb-4">Our AI is creating your comprehensive portfolio overview</p>
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg px-4 py-3 text-center font-medium max-w-full">
              <p className="text-sm text-gray-400 mb-1">Project:</p>
              <p className="text-purple-400 break-words">
                Create a comprehensive Solana wallet dashboard that displays portfolio value, token balances, NFTs,
                transaction history, program interactions, and activity with Phantom wallet integration
              </p>
            </div>
          </div>

          <div className="mb-8">
            <Progress value={progress} className="h-2 bg-gray-800" />
            <p className="text-sm text-gray-400 mt-2 text-right">{progress}% complete</p>
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={index}
                  className={`flex items-center ${index <= currentStep ? "text-white" : "text-gray-600"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      index < currentStep
                        ? "bg-green-500/20 text-green-400 border border-green-500/50"
                        : index === currentStep
                          ? "bg-purple-500/20 text-purple-400 border border-purple-500/50 animate-pulse"
                          : "bg-gray-800/50 text-gray-600 border border-gray-700/50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className={index === currentStep ? "font-medium" : ""}>{step.text}</span>
                </div>
              )
            })}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              {currentStep === steps.length - 1
                ? "Almost ready! Preparing your dashboard..."
                : "This usually takes about 5 seconds"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
