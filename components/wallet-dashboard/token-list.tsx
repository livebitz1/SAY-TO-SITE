"use client"

import { Copy, ExternalLink, Coins } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"

interface TokenBalance {
  mint: string
  amount: number
  decimals: number
  uiAmount: number
  name: string
  symbol: string
  logoURI?: string
  price?: number
  priceChange24h?: number
  verified?: boolean
  balance?: number
  valueUSD?: number
}

interface TokenListProps {
  tokens: TokenBalance[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  formatCurrency: (amount: number) => string
  formatNumber: (num: number, decimals?: number) => string
  copyToClipboard: (text: string) => Promise<void>
}

export function TokenList({
  tokens,
  searchQuery,
  setSearchQuery,
  formatCurrency,
  formatNumber,
  copyToClipboard,
}: TokenListProps) {
  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search tokens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-900/30 border-gray-800 text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTokens.map((token, index) => (
          <Card
            key={index}
            className="bg-black border border-gray-800 hover:border-gray-700 transition-all duration-300 shadow-xl"
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center border border-gray-800">
                  {token.logoURI ? (
                    <img
                      src={token.logoURI || "/placeholder.svg"}
                      alt={token.symbol}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <Coins className="w-7 h-7 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold text-lg">{token.symbol}</div>
                  <div className="text-gray-400 text-sm">{token.name}</div>
                </div>
                {token.verified && (
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Verified</Badge>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Balance</span>
                  <span className="text-white font-medium">{formatNumber(token.balance || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Value</span>
                  <span className="text-white font-medium">{formatCurrency(token.valueUSD || 0)}</span>
                </div>
                {token.price && (
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Price</span>
                    <div className="text-right">
                      <div className="text-white text-sm">{formatCurrency(token.price)}</div>
                      {token.priceChange24h !== undefined && (
                        <div className={`text-xs ${token.priceChange24h >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {token.priceChange24h >= 0 ? "+" : ""}
                          {token.priceChange24h.toFixed(2)}%
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Separator className="my-6 bg-gray-800" />

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(token.mint)}
                  className="text-gray-400 hover:text-white hover:bg-gray-900"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy Address
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(`https://solscan.io/token/${token.mint}`, "_blank")}
                  className="text-gray-400 hover:text-white hover:bg-gray-900"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
