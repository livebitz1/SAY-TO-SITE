"use client"

import { RefreshCw, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  walletAddress: string
  isRefreshing: boolean
  copied: boolean
  refreshData: () => Promise<void>
  copyToClipboard: (text: string) => Promise<void>
  truncateAddress: (address: string) => string
}

export function DashboardHeader({
  walletAddress,
  isRefreshing,
  copied,
  refreshData,
  copyToClipboard,
  truncateAddress,
}: DashboardHeaderProps) {
  return (
    <>
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-white mb-2">Solana Wallet Dashboard</h1>
        <p className="text-gray-400 text-lg">Complete portfolio overview powered by Helius RPC</p>
      </div>

      <div className="flex justify-center mb-8 gap-4">
        <Button
          variant="outline"
          onClick={refreshData}
          disabled={isRefreshing}
          className="border-gray-800 bg-gray-900/50 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
        <div className="flex items-center gap-3 bg-gray-900/50 rounded-xl px-4 py-2 border border-gray-800">
          <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
          <span className="text-sm text-white font-mono">{truncateAddress(walletAddress)}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(walletAddress)}
            className="h-6 w-6 p-0 text-gray-400 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          </Button>
        </div>
      </div>
    </>
  )
}
