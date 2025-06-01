"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Search,
  Wallet,
  Coins,
  ImageIcon,
  Activity,
  Copy,
  Check,
  ExternalLink,
  AlertCircle,
  Loader2,
  TrendingUp,
  Shield,
  Zap,
  RefreshCw,
  Code,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TokenBalance {
  mint: string
  amount: number
  decimals: number
  uiAmount: number
  symbol?: string
  name?: string
  logoURI?: string
  verified?: boolean
}

interface NFT {
  mint: string
  name?: string
  symbol?: string
  uri?: string
  image?: string
  collection?: string
  verified?: boolean
}

interface Transaction {
  signature: string
  slot: number
  blockTime: number
  fee: number
  status: string
  type: string
  amount?: number
}

interface WalletData {
  address: string
  solBalance: number
  tokens: TokenBalance[]
  nfts: NFT[]
  transactions: Transaction[]
  totalValueUSD: number
  lastUpdated: Date
}

// Wallet Analyzer Component
function WalletAnalyzer() {
  const [walletAddress, setWalletAddress] = useState("")
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [solPrice, setSolPrice] = useState(180)
  const [activeTab, setActiveTab] = useState("overview")

  const HELIUS_RPC_URL = "https://mainnet.helius-rpc.com/?api-key=bc153566-8ac2-4019-9c90-e0ef5b840c07"

  // Enhanced address validation
  const isValidSolanaAddress = (address: string) => {
    if (!address || address.length < 32 || address.length > 44) return false
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)
  }

  // Get SOL price with fallback
  const getSolPrice = async () => {
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd", {
        signal: AbortSignal.timeout(5000),
      })
      if (!response.ok) throw new Error("Price fetch failed")
      const data = await response.json()
      return data.solana?.usd || 180
    } catch (err) {
      console.warn("Failed to fetch SOL price, using fallback")
      return 180
    }
  }

  // Enhanced SOL balance fetch with error handling
  const getSolBalance = async (address: string) => {
    try {
      const response = await fetch(HELIUS_RPC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(10000),
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getBalance",
          params: [address],
        }),
      })

      if (!response.ok) throw new Error("Network error")
      const data = await response.json()

      if (data.error) {
        console.warn("RPC Error:", data.error)
        return 0
      }

      return data.result ? data.result.value / 1000000000 : 0
    } catch (err) {
      console.warn("Failed to fetch SOL balance:", err)
      return 0
    }
  }

  // Enhanced token balance fetch
  const getTokenBalances = async (address: string) => {
    try {
      const response = await fetch(HELIUS_RPC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(15000),
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getTokenAccountsByOwner",
          params: [address, { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" }, { encoding: "jsonParsed" }],
        }),
      })

      if (!response.ok) throw new Error("Network error")
      const data = await response.json()

      if (data.error) {
        console.warn("Token fetch error:", data.error)
        return []
      }

      if (data.result?.value) {
        return data.result.value
          .map((account: any) => {
            try {
              const info = account.account.data.parsed.info
              const uiAmount = info.tokenAmount.uiAmount || 0

              if (uiAmount <= 0) return null

              return {
                mint: info.mint || "Unknown",
                amount: Number.parseInt(info.tokenAmount.amount || "0"),
                decimals: info.tokenAmount.decimals || 0,
                uiAmount,
                symbol: "Token",
                name: "SPL Token",
                verified: false,
              }
            } catch (err) {
              console.warn("Error parsing token:", err)
              return null
            }
          })
          .filter(Boolean)
          .slice(0, 50) // Limit to prevent UI overload
      }
      return []
    } catch (err) {
      console.warn("Failed to fetch tokens:", err)
      return []
    }
  }

  // Enhanced NFT fetch with better error handling
  const getNFTs = async (address: string) => {
    try {
      const response = await fetch(
        `https://api.helius.xyz/v0/addresses/${address}/nfts?api-key=bc153566-8ac2-4019-9c90-e0ef5b840c07`,
        { signal: AbortSignal.timeout(15000) },
      )

      if (!response.ok) {
        console.warn("NFT fetch failed with status:", response.status)
        return []
      }

      const data = await response.json()

      if (Array.isArray(data)) {
        return data.slice(0, 24).map((nft: any) => ({
          mint: nft.mint || "Unknown",
          name: nft.content?.metadata?.name || "Unknown NFT",
          symbol: nft.content?.metadata?.symbol || "NFT",
          image: nft.content?.links?.image || nft.content?.files?.[0]?.uri || null,
          collection: nft.grouping?.[0]?.group_value || null,
          verified: nft.content?.metadata?.verified || false,
        }))
      }
      return []
    } catch (err) {
      console.warn("Failed to fetch NFTs:", err)
      return []
    }
  }

  // Enhanced transaction fetch
  const getTransactions = async (address: string) => {
    try {
      const response = await fetch(HELIUS_RPC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(10000),
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getSignaturesForAddress",
          params: [address, { limit: 20 }],
        }),
      })

      if (!response.ok) throw new Error("Network error")
      const data = await response.json()

      if (data.error) {
        console.warn("Transaction fetch error:", data.error)
        return []
      }

      if (data.result) {
        return data.result.map((tx: any) => ({
          signature: tx.signature || "Unknown",
          slot: tx.slot || 0,
          blockTime: tx.blockTime || Date.now() / 1000,
          fee: tx.fee || 0,
          status: tx.err ? "Failed" : "Success",
          type: "Transaction",
          amount: 0,
        }))
      }
      return []
    } catch (err) {
      console.warn("Failed to fetch transactions:", err)
      return []
    }
  }

  // Enhanced wallet analysis with comprehensive error handling
  const analyzeWallet = async () => {
    const trimmedAddress = walletAddress.trim()

    if (!trimmedAddress) {
      setError("Please enter a wallet address")
      return
    }

    if (!isValidSolanaAddress(trimmedAddress)) {
      setError("Please enter a valid Solana wallet address")
      return
    }

    setIsAnalyzing(true)
    setError("")
    setWalletData(null)

    try {
      // Get SOL price first
      const currentSolPrice = await getSolPrice()
      setSolPrice(currentSolPrice)

      // Fetch all data with individual error handling
      const [solBalance, tokens, nfts, transactions] = await Promise.allSettled([
        getSolBalance(trimmedAddress),
        getTokenBalances(trimmedAddress),
        getNFTs(trimmedAddress),
        getTransactions(trimmedAddress),
      ])

      // Extract results with fallbacks
      const finalSolBalance = solBalance.status === "fulfilled" ? solBalance.value : 0
      const finalTokens = tokens.status === "fulfilled" ? tokens.value : []
      const finalNfts = nfts.status === "fulfilled" ? nfts.value : []
      const finalTransactions = transactions.status === "fulfilled" ? transactions.value : []

      const totalValueUSD = finalSolBalance * currentSolPrice

      setWalletData({
        address: trimmedAddress,
        solBalance: finalSolBalance,
        tokens: finalTokens,
        nfts: finalNfts,
        transactions: finalTransactions,
        totalValueUSD,
        lastUpdated: new Date(),
      })

      setActiveTab("overview")
    } catch (err: any) {
      console.error("Analysis error:", err)
      setError("Unable to analyze wallet. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const copyAddress = async () => {
    if (walletData?.address) {
      try {
        await navigator.clipboard.writeText(walletData.address)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.warn("Copy failed:", err)
      }
    }
  }

  const truncateAddress = (address: string) => {
    if (!address || address.length < 8) return address
    return `${address.slice(0, 6)}...${address.slice(-6)}`
  }

  const formatDate = (timestamp: number) => {
    try {
      return new Date(timestamp * 1000).toLocaleDateString()
    } catch {
      return "Unknown"
    }
  }

  const formatTime = (date: Date) => {
    try {
      return date.toLocaleTimeString()
    } catch {
      return "Unknown"
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isAnalyzing) {
      analyzeWallet()
    }
  }

  const refreshAnalysis = () => {
    if (walletData?.address) {
      setWalletAddress(walletData.address)
      analyzeWallet()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gray-900/60 border-gray-800 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Search className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-white text-2xl font-bold">Solana Wallet Analyzer</CardTitle>
          <CardDescription className="text-gray-400">
            Comprehensive analysis of any Solana wallet with real-time data
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Enter Solana wallet address..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isAnalyzing}
                className="bg-gray-800/60 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
            <Button
              onClick={analyzeWallet}
              disabled={isAnalyzing || !walletAddress.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze Wallet
                </>
              )}
            </Button>
          </div>

          {error && (
            <Alert className="bg-red-500/10 border-red-500/30 text-red-400">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}

          {/* Quick Stats */}
          {walletData && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-gray-400 text-sm">Portfolio Value</span>
                </div>
                <div className="text-white text-lg font-bold">${walletData.totalValueUSD.toFixed(2)}</div>
              </div>
              <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-400 text-sm">Assets</span>
                </div>
                <div className="text-white text-lg font-bold">{walletData.tokens.length + walletData.nfts.length}</div>
              </div>
              <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-400 text-sm">Transactions</span>
                </div>
                <div className="text-white text-lg font-bold">{walletData.transactions.length}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {walletData && (
        <div className="space-y-4">
          {/* Wallet Overview */}
          <Card className="bg-gray-900/60 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">Wallet Overview</CardTitle>
                    <CardDescription className="text-gray-400 text-sm">
                      Last updated: {formatTime(walletData.lastUpdated)}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={refreshAnalysis}
                    className="text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyAddress}
                    className="text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700">
                <div className="text-gray-400 text-sm mb-1">Wallet Address</div>
                <div className="text-white font-mono text-sm break-all">{walletData.address}</div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-300 text-sm">SOL Balance</span>
                  </div>
                  <div className="text-white text-lg font-bold">{walletData.solBalance.toFixed(4)}</div>
                  <div className="text-gray-400 text-xs">≈ ${walletData.totalValueUSD.toFixed(2)} USD</div>
                </div>

                <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Coins className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300 text-sm">SPL Tokens</span>
                  </div>
                  <div className="text-white text-lg font-bold">{walletData.tokens.length}</div>
                  <div className="text-gray-400 text-xs">Token Holdings</div>
                </div>

                <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <ImageIcon className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300 text-sm">NFTs</span>
                  </div>
                  <div className="text-white text-lg font-bold">{walletData.nfts.length}</div>
                  <div className="text-gray-400 text-xs">Digital Assets</div>
                </div>

                <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-orange-400" />
                    <span className="text-gray-300 text-sm">Activity</span>
                  </div>
                  <div className="text-white text-lg font-bold">{walletData.transactions.length}</div>
                  <div className="text-gray-400 text-xs">Recent Transactions</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <Card className="bg-gray-900/60 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-800/60 rounded-none">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
                  >
                    <Coins className="w-4 h-4 mr-2" />
                    Tokens ({walletData.tokens.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="nfts"
                    className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    NFTs ({walletData.nfts.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="transactions"
                    className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Activity ({walletData.transactions.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="p-4 space-y-3">
                  {walletData.tokens.length > 0 ? (
                    <div className="space-y-2">
                      {walletData.tokens.map((token, index) => (
                        <div
                          key={`${token.mint}-${index}`}
                          className="bg-gray-800/60 rounded-lg p-3 border border-gray-700"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                <Coins className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <div className="text-white font-medium">{token.symbol || "Unknown"}</div>
                                <div className="text-gray-400 text-sm">{token.name || "SPL Token"}</div>
                                <div className="text-gray-500 text-xs font-mono">{truncateAddress(token.mint)}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-mono font-bold">
                                {(token.uiAmount || 0).toLocaleString()}
                              </div>
                              <div className="text-gray-400 text-sm">{token.symbol || "Tokens"}</div>
                              {token.verified && (
                                <Badge className="mt-1 bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                  Verified
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Coins className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="text-gray-400 font-medium">No tokens found</div>
                      <div className="text-gray-500 text-sm">This wallet doesn't hold any SPL tokens</div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="nfts" className="p-4">
                  {walletData.nfts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {walletData.nfts.map((nft, index) => (
                        <div
                          key={`${nft.mint}-${index}`}
                          className="bg-gray-800/60 rounded-lg p-2 border border-gray-700"
                        >
                          <div className="aspect-square bg-gray-700 rounded-lg mb-2 overflow-hidden relative">
                            {nft.image ? (
                              <img
                                src={nft.image || "/placeholder.svg"}
                                alt={nft.name || "NFT"}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.style.display = "none"
                                  const parent = target.parentElement
                                  if (parent) {
                                    parent.innerHTML = `<div class="w-full h-full flex items-center justify-center"><svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>`
                                  }
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-gray-500" />
                              </div>
                            )}
                            {nft.verified && (
                              <div className="absolute top-1 right-1">
                                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                  <Check className="w-2 h-2 text-white" />
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="text-white text-sm font-medium truncate" title={nft.name}>
                              {nft.name || "Unknown NFT"}
                            </div>
                            <div className="text-gray-400 text-xs truncate">{nft.symbol || "NFT"}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                        <ImageIcon className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="text-gray-400 font-medium">No NFTs found</div>
                      <div className="text-gray-500 text-sm">This wallet doesn't hold any NFTs</div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="transactions" className="p-4 space-y-2">
                  {walletData.transactions.length > 0 ? (
                    <div className="space-y-2">
                      {walletData.transactions.map((tx, index) => (
                        <div
                          key={`${tx.signature}-${index}`}
                          className="bg-gray-800/60 rounded-lg p-3 border border-gray-700"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  tx.status === "Success" ? "bg-green-400" : "bg-red-400"
                                }`}
                              ></div>
                              <div>
                                <div className="text-white font-mono text-sm">{truncateAddress(tx.signature)}</div>
                                <div className="text-gray-400 text-xs">
                                  {tx.type} • {formatDate(tx.blockTime)} • Fee: {(tx.fee / 1000000000).toFixed(6)} SOL
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                className={`text-xs ${
                                  tx.status === "Success"
                                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                                    : "bg-red-500/20 text-red-400 border-red-500/30"
                                }`}
                              >
                                {tx.status}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(`https://solscan.io/tx/${tx.signature}`, "_blank")}
                                className="text-gray-400 hover:text-white hover:bg-gray-700 h-6 w-6 p-0"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Activity className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="text-gray-400 font-medium">No recent transactions</div>
                      <div className="text-gray-500 text-sm">No transaction history available</div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <div className="text-center py-4">
        <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
          <Zap className="w-4 h-4" />
          <span>Powered by Helius RPC • Real-time Solana blockchain data</span>
        </div>
      </div>
    </div>
  )
}

// Code snippet to display
const codeSnippet = `
// Solana Wallet Analyzer - Comprehensive Wallet Analysis Tool
// Dependencies to install:
// $ npm install @solana/web3.js

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Wallet, Coins, ImageIcon, Activity } from 'lucide-react'

interface TokenBalance {
  mint: string
  amount: number
  decimals: number
  uiAmount: number
  symbol?: string
  name?: string
  verified?: boolean
}

interface NFT {
  mint: string
  name?: string
  symbol?: string
  image?: string
  collection?: string
  verified?: boolean
}

interface Transaction {
  signature: string
  slot: number
  blockTime: number
  fee: number
  status: string
  type: string
}

interface WalletData {
  address: string
  solBalance: number
  tokens: TokenBalance[]
  nfts: NFT[]
  transactions: Transaction[]
  totalValueUSD: number
  lastUpdated: Date
}

export default function WalletAnalyzer() {
  const [walletAddress, setWalletAddress] = useState("")
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState("")
  const [solPrice, setSolPrice] = useState(180)

  const HELIUS_RPC_URL = "https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY"

  // Validate Solana address
  const isValidSolanaAddress = (address: string) => {
    if (!address || address.length < 32 || address.length > 44) return false
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)
  }

  // Get SOL price from CoinGecko
  const getSolPrice = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
      )
      const data = await response.json()
      return data.solana?.usd || 180
    } catch (err) {
      console.warn("Failed to fetch SOL price, using fallback")
      return 180
    }
  }

  // Get SOL balance using Helius RPC
  const getSolBalance = async (address: string) => {
    try {
      const response = await fetch(HELIUS_RPC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getBalance",
          params: [address],
        }),
      })

      const data = await response.json()
      if (data.error) {
        console.warn("RPC Error:", data.error)
        return 0
      }

      return data.result ? data.result.value / 1000000000 : 0
    } catch (err) {
      console.warn("Failed to fetch SOL balance:", err)
      return 0
    }
  }

  // Get token balances
  const getTokenBalances = async (address: string) => {
    try {
      const response = await fetch(HELIUS_RPC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getTokenAccountsByOwner",
          params: [
            address,
            { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
            { encoding: "jsonParsed" }
          ],
        }),
      })

      const data = await response.json()
      if (data.error) {
        console.warn("Token fetch error:", data.error)
        return []
      }

      if (data.result?.value) {
        return data.result.value
          .map((account: any) => {
            const info = account.account.data.parsed.info
            const uiAmount = info.tokenAmount.uiAmount || 0

            if (uiAmount <= 0) return null

            return {
              mint: info.mint || "Unknown",
              amount: parseInt(info.tokenAmount.amount || "0"),
              decimals: info.tokenAmount.decimals || 0,
              uiAmount,
              symbol: "Token",
              name: "SPL Token",
              verified: false,
            }
          })
          .filter(Boolean)
          .slice(0, 50)
      }
      return []
    } catch (err) {
      console.warn("Failed to fetch tokens:", err)
      return []
    }
  }

  // Get NFTs using Helius API
  const getNFTs = async (address: string) => {
    try {
      const response = await fetch(
        \`https://api.helius.xyz/v0/addresses/\${address}/nfts?api-key=YOUR_API_KEY\`
      )

      if (!response.ok) {
        console.warn("NFT fetch failed with status:", response.status)
        return []
      }

      const data = await response.json()

      if (Array.isArray(data)) {
        return data.slice(0, 24).map((nft: any) => ({
          mint: nft.mint || "Unknown",
          name: nft.content?.metadata?.name || "Unknown NFT",
          symbol: nft.content?.metadata?.symbol || "NFT",
          image: nft.content?.links?.image || nft.content?.files?.[0]?.uri || null,
          collection: nft.grouping?.[0]?.group_value || null,
          verified: nft.content?.metadata?.verified || false,
        }))
      }
      return []
    } catch (err) {
      console.warn("Failed to fetch NFTs:", err)
      return []
    }
  }

  // Get recent transactions
  const getTransactions = async (address: string) => {
    try {
      const response = await fetch(HELIUS_RPC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getSignaturesForAddress",
          params: [address, { limit: 20 }],
        }),
      })

      const data = await response.json()
      if (data.error) {
        console.warn("Transaction fetch error:", data.error)
        return []
      }

      if (data.result) {
        return data.result.map((tx: any) => ({
          signature: tx.signature || "Unknown",
          slot: tx.slot || 0,
          blockTime: tx.blockTime || Date.now() / 1000,
          fee: tx.fee || 0,
          status: tx.err ? "Failed" : "Success",
          type: "Transaction",
        }))
      }
      return []
    } catch (err) {
      console.warn("Failed to fetch transactions:", err)
      return []
    }
  }

  // Main analysis function
  const analyzeWallet = async () => {
    const trimmedAddress = walletAddress.trim()

    if (!trimmedAddress) {
      setError("Please enter a wallet address")
      return
    }

    if (!isValidSolanaAddress(trimmedAddress)) {
      setError("Please enter a valid Solana wallet address")
      return
    }

    setIsAnalyzing(true)
    setError("")
    setWalletData(null)

    try {
      // Get SOL price first
      const currentSolPrice = await getSolPrice()
      setSolPrice(currentSolPrice)

      // Fetch all data
      const [solBalance, tokens, nfts, transactions] = await Promise.allSettled([
        getSolBalance(trimmedAddress),
        getTokenBalances(trimmedAddress),
        getNFTs(trimmedAddress),
        getTransactions(trimmedAddress),
      ])

      // Extract results with fallbacks
      const finalSolBalance = solBalance.status === "fulfilled" ? solBalance.value : 0
      const finalTokens = tokens.status === "fulfilled" ? tokens.value : []
      const finalNfts = nfts.status === "fulfilled" ? nfts.value : []
      const finalTransactions = transactions.status === "fulfilled" ? transactions.value : []

      const totalValueUSD = finalSolBalance * currentSolPrice

      setWalletData({
        address: trimmedAddress,
        solBalance: finalSolBalance,
        tokens: finalTokens,
        nfts: finalNfts,
        transactions: finalTransactions,
        totalValueUSD,
        lastUpdated: new Date(),
      })
    } catch (err) {
      console.error("Analysis error:", err)
      setError("Unable to analyze wallet. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const truncateAddress = (address: string) => {
    if (!address || address.length < 8) return address
    return \`\${address.slice(0, 6)}...\${address.slice(-6)}\`
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-white text-2xl">Solana Wallet Analyzer</CardTitle>
            <p className="text-gray-400">
              Comprehensive analysis of any Solana wallet with real-time data
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input
                placeholder="Enter Solana wallet address..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                disabled={isAnalyzing}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button
                onClick={analyzeWallet}
                disabled={isAnalyzing || !walletAddress.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Wallet"}
              </Button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {walletData && (
          <div className="space-y-6">
            {/* Overview */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Wallet Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                    <div className="text-purple-400 text-sm mb-1">SOL Balance</div>
                    <div className="text-white text-xl font-bold">
                      {walletData.solBalance.toFixed(4)}
                    </div>
                    <div className="text-gray-400 text-sm">
                      ≈ \${walletData.totalValueUSD.toFixed(2)} USD
                    </div>
                  </div>

                  <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                    <div className="text-green-400 text-sm mb-1">SPL Tokens</div>
                    <div className="text-white text-xl font-bold">{walletData.tokens.length}</div>
                  </div>

                  <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                    <div className="text-blue-400 text-sm mb-1">NFTs</div>
                    <div className="text-white text-xl font-bold">{walletData.nfts.length}</div>
                  </div>

                  <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/20">
                    <div className="text-orange-400 text-sm mb-1">Transactions</div>
                    <div className="text-white text-xl font-bold">{walletData.transactions.length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Analysis */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-0">
                <Tabs defaultValue="tokens" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                    <TabsTrigger value="tokens">
                      <Coins className="w-4 h-4 mr-2" />
                      Tokens ({walletData.tokens.length})
                    </TabsTrigger>
                    <TabsTrigger value="nfts">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      NFTs ({walletData.nfts.length})
                    </TabsTrigger>
                    <TabsTrigger value="transactions">
                      <Activity className="w-4 h-4 mr-2" />
                      Activity ({walletData.transactions.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="tokens" className="p-6">
                    {walletData.tokens.length > 0 ? (
                      <div className="space-y-3">
                        {walletData.tokens.map((token, index) => (
                          <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="text-white font-semibold">{token.symbol || "Unknown"}</div>
                                <div className="text-gray-400 text-sm">{token.name || "SPL Token"}</div>
                                <div className="text-gray-500 text-xs font-mono">
                                  {truncateAddress(token.mint)}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-white font-mono font-bold">
                                  {(token.uiAmount || 0).toLocaleString()}
                                </div>
                                <div className="text-gray-400 text-sm">{token.symbol || "Tokens"}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-gray-400">No tokens found</div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="nfts" className="p-6">
                    {walletData.nfts.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {walletData.nfts.map((nft, index) => (
                          <div key={index} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                            <div className="aspect-square bg-gray-700 rounded-lg mb-3 overflow-hidden">
                              {nft.image ? (
                                <img
                                  src={nft.image || "/placeholder.svg"}
                                  alt={nft.name || "NFT"}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ImageIcon className="w-8 h-8 text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="text-white text-sm font-medium truncate">
                              {nft.name || "Unknown NFT"}
                            </div>
                            <div className="text-gray-400 text-xs truncate">{nft.symbol || "NFT"}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-gray-400">No NFTs found</div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="transactions" className="p-6">
                    {walletData.transactions.length > 0 ? (
                      <div className="space-y-3">
                        {walletData.transactions.map((tx, index) => (
                          <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="text-white font-mono text-sm">
                                  {truncateAddress(tx.signature)}
                                </div>
                                <div className="text-gray-400 text-xs">
                                  {tx.type} • Fee: {(tx.fee / 1000000000).toFixed(6)} SOL
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={\`text-sm \${tx.status === "Success" ? "text-green-400" : "text-red-400"}\`}>
                                  {tx.status}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-gray-400">No recent transactions</div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
`

// Main showcase component with split-screen layout
export default function WalletAnalyzerShowcase() {
  const [copied, setCopied] = useState<boolean>(false)

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippet.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with gradient */}
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-purple-600/50 via-purple-500/30 to-transparent" />

        <header className="relative z-10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Search className="h-5 w-5 text-purple-400" />
              <span>Your Wallet Analyzer</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/50 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-blue-500 inline-block mr-2 animate-pulse"></span>
              Ready
            </Badge>
          </div>
        </header>
      </div>

      {/* Split screen layout */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
          {/* Left side - Wallet Analyzer UI */}
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 border border-gray-800">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Search className="h-5 w-5 text-purple-400" />
              <span>Solana Wallet Analyzer</span>
            </h2>

            <ScrollArea className="h-[70vh] pr-2">
              <WalletAnalyzer />
            </ScrollArea>
          </div>

          {/* Right side - Code */}
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Code className="h-5 w-5 text-purple-400" />
                <span>Your Code</span>
              </h2>
              <Button variant="outline" size="sm" className="text-xs" onClick={handleCopyCode} disabled={copied}>
                {copied ? (
                  <>
                    <Check className="h-3 w-3 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 mr-1" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>
            <ScrollArea className="h-[70vh] rounded-md border border-gray-800 bg-black/50 p-4">
              <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">{codeSnippet}</pre>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}
