"use client"

import { Loader2, Code, Sparkles, Zap } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-pink-600/10"></div>
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-500/5 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-500/5 blur-3xl rounded-full"></div>

      <div className="text-center relative z-10 px-4 py-10 bg-gray-900/40 backdrop-blur-md rounded-xl border border-gray-800/50 max-w-md w-full">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse"></div>
          <div
            className="absolute inset-0 rounded-full border-2 border-blue-400/30 border-dashed animate-spin"
            style={{ animationDuration: "8s" }}
          ></div>
          <div
            className="absolute inset-0 rounded-full border-2 border-purple-400/20 border-dashed animate-spin"
            style={{ animationDuration: "12s", animationDirection: "reverse" }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Initializing Web2 Generator
        </h3>

        <p className="text-gray-300 mb-6">Preparing your AI website builder with advanced capabilities</p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon: Code, text: "1000+ Lines of Code" },
            { icon: Sparkles, text: "Professional Design" },
            { icon: Zap, text: "Interactive Features" },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gray-800/80 flex items-center justify-center mb-2">
                <item.icon className="h-5 w-5 text-blue-400" />
              </div>
              <span className="text-xs text-gray-400 text-center">{item.text}</span>
            </div>
          ))}
        </div>

        <div className="relative h-1.5 bg-gray-800 rounded-full overflow-hidden mb-4">
          <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-blue-500 to-purple-500 animate-loading-progress"></div>
        </div>

        <p className="text-sm text-gray-500">Loading advanced AI capabilities...</p>
      </div>

      <style jsx>{`
        @keyframes loading-progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        .animate-loading-progress {
          animation: loading-progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
