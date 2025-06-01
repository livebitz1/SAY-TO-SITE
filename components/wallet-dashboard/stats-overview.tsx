import { TrendingUp, TrendingDown, Wallet, Coins, ImageIcon, Activity } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface WalletStats {
  totalValueUSD: number
  solBalance: number
  tokenCount: number
  nftCount: number
  transactionCount: number
  programInteractions: number
  portfolioChange24h: number
}

interface StatsOverviewProps {
  walletStats: WalletStats
  formatCurrency: (amount: number) => string
}

export function StatsOverview({ walletStats, formatCurrency }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {/* Total Portfolio Value */}
      <Card className="bg-black border border-[#d4af37]/30 shadow-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-[#d4af37]/10 rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-[#d4af37]"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <span className="text-gray-300 font-medium">Total Portfolio Value</span>
          </div>
          <div className="text-3xl font-bold text-white mb-2">{formatCurrency(walletStats.totalValueUSD)}</div>
          <div
            className={`flex items-center gap-2 text-sm ${
              walletStats.portfolioChange24h >= 0 ? "text-[#d4af37]" : "text-[#d4af37]"
            }`}
          >
            {walletStats.portfolioChange24h >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {formatCurrency(Math.abs(walletStats.portfolioChange24h))} (24h)
          </div>
        </CardContent>
      </Card>

      {/* SOL Balance */}
      <Card className="bg-black border border-[#d4af37]/30 shadow-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-[#d4af37]/10 rounded-xl">
              <Wallet className="w-5 h-5 text-[#d4af37]" />
            </div>
            <span className="text-gray-300 font-medium">SOL Balance</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{walletStats.solBalance.toFixed(4)}</div>
          <div className="text-gray-500 text-sm">≈ {formatCurrency(walletStats.solBalance * 180)}</div>
        </CardContent>
      </Card>

      {/* Tokens */}
      <Card className="bg-black border border-[#d4af37]/30 shadow-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-[#d4af37]/10 rounded-xl">
              <Coins className="w-5 h-5 text-[#d4af37]" />
            </div>
            <span className="text-gray-300 font-medium">Tokens</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{walletStats.tokenCount}</div>
          <div className="text-gray-500 text-sm">SPL Tokens</div>
        </CardContent>
      </Card>

      {/* NFTs */}
      <Card className="bg-black border border-[#d4af37]/30 shadow-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-[#d4af37]/10 rounded-xl">
              <ImageIcon className="w-5 h-5 text-[#d4af37]" />
            </div>
            <span className="text-gray-300 font-medium">NFTs</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{walletStats.nftCount}</div>
          <div className="text-gray-500 text-sm">Digital Assets</div>
        </CardContent>
      </Card>

      {/* Activity */}
      <Card className="bg-black border border-[#d4af37]/30 shadow-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-[#d4af37]/10 rounded-xl">
              <Activity className="w-5 h-5 text-[#d4af37]" />
            </div>
            <span className="text-gray-300 font-medium">Activity</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{walletStats.transactionCount}</div>
          <div className="text-gray-500 text-sm">Transactions</div>
        </CardContent>
      </Card>
    </div>
  )
}
