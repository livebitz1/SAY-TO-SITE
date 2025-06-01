"use client"

import { useEffect, useState } from "react"
import { Loader2, FileText, Code2, Sparkles, Globe, Wallet } from "lucide-react"

export default function DocsLoading() {
  const [loadingText, setLoadingText] = useState("Loading documentation")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const texts = ["Loading documentation", "Preparing guides", "Organizing content", "Almost ready"]
    let index = 0

    const textInterval = setInterval(() => {
      index = (index + 1) % texts.length
      setLoadingText(texts[index])
    }, 1000)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev
        return prev + 10
      })
    }, 200)

    return () => {
      clearInterval(textInterval)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#E6FF00] rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-lg">S2S</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Say2Site</h1>
          </div>
          <p className="text-white/60">Documentation</p>
        </div>

        {/* Loading Animation */}
        <div className="relative mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <Loader2 className="h-16 w-16 text-white animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText className="h-8 w-8 text-white/20" />
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-white/80 to-white/60 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Loading Text */}
          <p className="text-center text-white/70 mt-4 text-sm">{loadingText}...</p>
        </div>

        {/* Feature Icons */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {[Code2, Globe, Wallet, Sparkles, FileText].map((Icon, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-3 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm"
              style={{
                animation: `pulse 2s ease-in-out ${index * 0.2}s infinite`,
              }}
            >
              <Icon className="h-5 w-5 text-white/40" />
            </div>
          ))}
        </div>

        {/* Loading Tips */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
          <p className="text-white/60 text-sm text-center">
            <span className="text-white/80 font-medium">Did you know?</span> Say2Site can generate both Web2 and Web3
            applications from simple text prompts.
          </p>
        </div>

        {/* Animated Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-2 h-2 bg-white/40 rounded-full"
              style={{
                animation: `bounce 1.4s ease-in-out ${index * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl" />
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          40% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
