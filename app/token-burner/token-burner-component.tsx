"use client"

import { useState, useEffect } from "react"
import {
  Flame,
  Wallet,
  AlertTriangle,
  Check,
  Copy,
  ExternalLink,
  Loader2,
  Shield,
  Zap,
  Info,
  Activity,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Phantom wallet types
interface PhantomWallet {
  isPhantom: boolean
  publicKey: {
    toString(): string
  } | null
  isConnected: boolean
  connect(): Promise<{ publicKey: { toString(): string } }>
  disconnect(): Promise<void>
  signAndSendTransaction(transaction: any): Promise<{ signature: string }>
  on(event: string, callback: () => void): void
  off(event: string, callback: () => void): void
}

interface TokenBalance {
  mint: string
  amount: number
  decimals: number
  uiAmount: number
  symbol?: string
  name?: string
  logoURI?: string
}

interface BurnTransaction {
  signature: string
  amount: number
  tokenMint: string
  timestamp: Date
  status: "pending" | "confirmed" | "failed"
}

declare global {
  interface Window {
    solana?: PhantomWallet
  }
}

export default function TokenBurnerPage() {
  const [wallet, setWallet] = useState<PhantomWallet | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [tokens, setTokens] = useState<TokenBalance[]>([])
  const [selectedToken, setSelectedToken] = useState<TokenBalance | null>(null)
  const [burnAmount, setBurnAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isBurning, setIsBurning] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [burnHistory, setBurnHistory] = useState<BurnTransaction[]>([])
  const [copied, setCopied] = useState(false)

  const HELIUS_RPC_URL = "https://mainnet.helius-rpc.com/?api-key=bc153566-8ac2-4019-9c90-e0ef5b840c07"
  const BURN_ADDRESS = "1nc1nerator11111111111111111111111111111111" // Standard burn address

  // Check if Phantom wallet is installed
  useEffect(() => {
    const getProvider = () => {
      if ("solana" in window) {
        const provider = window.solana
        if (provider?.isPhantom) {
          setWallet(provider)
          return provider
        }
      }
      return null
    }

    const provider = getProvider()

    if (provider) {
      // Check if already connected
      if (provider.isConnected && provider.publicKey) {
        setIsConnected(true)
        setWalletAddress(provider.publicKey.toString())
        fetchTokenBalances(provider.publicKey.toString())
      }

      // Listen for account changes
      const handleAccountChanged = () => {
        if (provider.publicKey) {
          setWalletAddress(provider.publicKey.toString())
          fetchTokenBalances(provider.publicKey.toString())
        } else {
          setIsConnected(false)
          setWalletAddress("")
          setTokens([])
          setSelectedToken(null)
        }
      }

      provider.on("accountChanged", handleAccountChanged)

      return () => {
        provider.off("accountChanged", handleAccountChanged)
      }
    }
  }, [])

  // Connect wallet
  const connectWallet = async () => {
    if (!wallet) {
      setError("Phantom wallet is not installed")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await wallet.connect()
      const publicKey = response.publicKey.toString()

      setIsConnected(true)
      setWalletAddress(publicKey)
      await fetchTokenBalances(publicKey)
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet")
      console.error("Connection error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch token balances
  const fetchTokenBalances = async (address: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(HELIUS_RPC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getTokenAccountsByOwner",
          params: [address, { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" }, { encoding: "jsonParsed" }],
        }),
      })

      const data = await response.json()

      if (data.result) {
        const tokenBalances = data.result.value
          .map((account: any) => {
            const info = account.account.data.parsed.info
            return {
              mint: info.mint,
              amount: Number.parseInt(info.tokenAmount.amount),
              decimals: info.tokenAmount.decimals,
              uiAmount: info.tokenAmount.uiAmount,
              symbol: "Unknown",
              name: "Unknown Token",
            }
          })
          .filter((token: any) => token.uiAmount > 0)

        // Fetch token metadata for each token
        const tokensWithMetadata = await Promise.all(
          tokenBalances.map(async (token: TokenBalance) => {
            try {
              const metadata = await getTokenMetadata(token.mint)
              return {
                ...token,
                symbol: metadata?.symbol || token.symbol,
                name: metadata?.name || token.name,
                logoURI: metadata?.image || null,
              }
            } catch {
              return token
            }
          }),
        )

        setTokens(tokensWithMetadata)
      }
    } catch (err) {
      console.error("Error fetching tokens:", err)
      setError("Failed to fetch token balances")
    } finally {
      setIsLoading(false)
    }
  }

  // Get token metadata
  const getTokenMetadata = async (mintAddress: string) => {
    try {
      const response = await fetch(HELIUS_RPC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getAsset",
          params: { id: mintAddress },
        }),
      })

      const data = await response.json()
      if (data.result) {
        return {
          name: data.result.content?.metadata?.name || "Unknown Token",
          symbol: data.result.content?.metadata?.symbol || "UNKNOWN",
          image: data.result.content?.files?.[0]?.uri || data.result.content?.links?.image || null,
        }
      }
      return null
    } catch (err) {
      console.warn("Failed to fetch metadata:", err)
      return null
    }
  }

  // Create burn transaction
  const createBurnTransaction = async () => {
    if (!selectedToken || !burnAmount || !wallet?.publicKey) {
      throw new Error("Missing required data for burn transaction")
    }

    const burnAmountNum = Number.parseFloat(burnAmount)
    if (burnAmountNum <= 0 || burnAmountNum > selectedToken.uiAmount) {
      throw new Error("Invalid burn amount")
    }

    // Convert to raw amount (considering decimals)
    const rawAmount = Math.floor(burnAmountNum * Math.pow(10, selectedToken.decimals))

    // Create a simple transfer to burn address (this is a simplified version)
    // In a real implementation, you would use @solana/web3.js and @solana/spl-token
    const transaction = {
      feePayer: wallet.publicKey.toString(),
      recentBlockhash: "11111111111111111111111111111111", // Would be fetched from RPC
      instructions: [
        {
          programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          keys: [
            { pubkey: wallet.publicKey.toString(), isSigner: true, isWritable: false },
            { pubkey: selectedToken.mint, isSigner: false, isWritable: false },
            { pubkey: BURN_ADDRESS, isSigner: false, isWritable: true },
          ],
          data: Buffer.from([3, ...new Array(8).fill(0)]), // Simplified burn instruction
        },
      ],
    }

    return transaction
  }

  // Execute burn transaction
  const executeBurn = async () => {
    if (!selectedToken || !burnAmount || !wallet) {
      setError("Missing required data")
      return
    }

    setIsBurning(true)
    setError("")
    setSuccess("")

    try {
      // Validate amount
      const burnAmountNum = Number.parseFloat(burnAmount)
      if (burnAmountNum <= 0) {
        throw new Error("Burn amount must be greater than 0")
      }

      if (burnAmountNum > selectedToken.uiAmount) {
        throw new Error("Insufficient token balance")
      }

      // For demo purposes, we'll simulate the transaction
      // In a real implementation, you would:
      // 1. Create the actual burn transaction using @solana/web3.js
      // 2. Sign and send it through Phantom
      // 3. Wait for confirmation

      // Simulate transaction delay
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate successful burn
      const mockSignature = `burn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const burnTx: BurnTransaction = {
        signature: mockSignature,
        amount: burnAmountNum,
        tokenMint: selectedToken.mint,
        timestamp: new Date(),
        status: "confirmed",
      }

      setBurnHistory((prev) => [burnTx, ...prev])
      setSuccess(`Successfully burned ${burnAmountNum} ${selectedToken.symbol}!`)

      // Update token balance (simulate)
      setTokens((prev) =>
        prev.map((token) =>
          token.mint === selectedToken.mint ? { ...token, uiAmount: token.uiAmount - burnAmountNum } : token,
        ),
      )

      // Reset form
      setBurnAmount("")
      setSelectedToken(null)
      setShowConfirmDialog(false)
    } catch (err: any) {
      setError(err.message || "Failed to burn tokens")
      console.error("Burn error:", err)
    } finally {
      setIsBurning(false)
    }
  }

  const handleBurnClick = () => {
    if (!selectedToken || !burnAmount) {
      setError("Please select a token and enter burn amount")
      return
    }

    const burnAmountNum = Number.parseFloat(burnAmount)
    if (burnAmountNum <= 0) {
      setError("Burn amount must be greater than 0")
      return
    }

    if (burnAmountNum > selectedToken.uiAmount) {
      setError("Insufficient token balance")
      return
    }

    setShowConfirmDialog(true)
  }

  const copySignature = async (signature: string) => {
    try {
      await navigator.clipboard.writeText(signature)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.warn("Copy failed:", err)
    }
  }

  const truncateAddress = (address: string) => {
    if (!address || address.length < 8) return address
    return `${address.slice(0, 6)}...${address.slice(-6)}`
  }

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(2)}M`
    if (amount >= 1000) return `${(amount / 1000).toFixed(2)}K`
    return amount.toLocaleString()
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-zinc-900 border-zinc-800 shadow-2xl shadow-black/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5"></div>
          <CardHeader className="text-center relative z-10">
            <div className="mx-auto mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20 relative">
                <Flame className="w-9 h-9 text-white" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Zap className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
            <CardTitle className="text-white text-3xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
              Token Burn Station
            </CardTitle>
            <CardDescription className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Permanently remove tokens from circulation to reduce supply and potentially increase value
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 relative z-10">
            {/* Warning Alert */}
            <Alert className="bg-red-950/50 border-red-800 text-red-200">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-200">
                <strong>Warning:</strong> Token burning is irreversible. Burned tokens are permanently removed from
                circulation and cannot be recovered.
              </AlertDescription>
            </Alert>

            {!isConnected ? (
              <div className="text-center space-y-6">
                <div className="space-y-4">
                  <h3 className="text-white text-lg font-medium">Connect Your Wallet</h3>
                  <p className="text-zinc-400 text-sm max-w-md mx-auto">
                    Connect your Phantom wallet to view your token balances and start burning tokens
                  </p>
                </div>

                <Button
                  onClick={connectWallet}
                  disabled={isLoading || !wallet}
                  className="h-12 px-8 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-red-600/25"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : !wallet ? (
                    "Install Phantom Wallet"
                  ) : (
                    <>
                      <Wallet className="w-4 h-4 mr-2" />
                      Connect Phantom Wallet
                    </>
                  )}
                </Button>

                {!wallet && (
                  <div className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open("https://phantom.app/", "_blank")}
                      className="text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 text-xs"
                    >
                      Download Phantom Wallet
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Wallet Info */}
                <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-zinc-400 text-sm mb-1">Connected Wallet</div>
                      <div className="text-white font-mono text-sm">{truncateAddress(walletAddress)}</div>
                    </div>
                    <Badge className="bg-emerald-950/50 text-emerald-400 border-emerald-800">● Connected</Badge>
                  </div>
                </div>

                {/* Token Selection */}
                <div className="space-y-4">
                  <h3 className="text-white text-lg font-medium flex items-center gap-2">
                    <Flame className="w-5 h-5 text-red-400" />
                    Select Token to Burn
                  </h3>

                  {isLoading ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 text-zinc-400 animate-spin mx-auto mb-3" />
                      <div className="text-zinc-400">Loading your tokens...</div>
                    </div>
                  ) : tokens.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {tokens.map((token) => (
                        <div
                          key={token.mint}
                          onClick={() => setSelectedToken(token)}
                          className={`bg-zinc-800 rounded-lg p-4 border cursor-pointer transition-all duration-200 ${
                            selectedToken?.mint === token.mint
                              ? "border-red-500 bg-red-500/10"
                              : "border-zinc-700 hover:border-zinc-600"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center">
                                {token.logoURI ? (
                                  <img
                                    src={token.logoURI || "/placeholder.svg"}
                                    alt={token.symbol}
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                ) : (
                                  <span className="text-white text-xs font-bold">
                                    {token.symbol?.slice(0, 2) || "??"}
                                  </span>
                                )}
                              </div>
                              <div>
                                <div className="text-white font-medium">{token.symbol || "Unknown"}</div>
                                <div className="text-zinc-400 text-sm">{token.name || "Unknown Token"}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-mono">{formatAmount(token.uiAmount)}</div>
                              <div className="text-zinc-500 text-xs">{token.symbol}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Flame className="w-8 h-8 text-zinc-600" />
                      </div>
                      <div className="text-zinc-400">No tokens found in your wallet</div>
                    </div>
                  )}
                </div>

                {/* Burn Amount Input */}
                {selectedToken && (
                  <div className="space-y-4">
                    <h3 className="text-white text-lg font-medium">Burn Amount</h3>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <Input
                          placeholder="Enter amount to burn"
                          value={burnAmount}
                          onChange={(e) => setBurnAmount(e.target.value)}
                          type="number"
                          min="0"
                          max={selectedToken.uiAmount}
                          step="any"
                          className="flex-1 h-12 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-500"
                        />
                        <Button
                          onClick={() => setBurnAmount(selectedToken.uiAmount.toString())}
                          variant="outline"
                          className="h-12 px-6 border-red-600/50 bg-red-950/30 text-red-400 hover:bg-red-900/50 hover:border-red-500 hover:text-red-300 transition-all duration-300 group relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative flex items-center gap-2">
                            <Flame className="w-4 h-4 group-hover:animate-pulse" />
                            <span className="font-bold tracking-wider">BURN ALL</span>
                            <AlertTriangle className="w-3 h-3 group-hover:animate-bounce" />
                          </div>
                        </Button>
                      </div>
                      {burnAmount === selectedToken.uiAmount.toString() && (
                        <div className="bg-red-950/50 border border-red-800/50 rounded-lg p-3 animate-pulse">
                          <div className="flex items-center gap-2 text-red-400 text-sm font-medium">
                            <AlertTriangle className="w-4 h-4 animate-bounce" />
                            <span>⚠️ TOTAL DESTRUCTION MODE ACTIVATED</span>
                            <Flame className="w-4 h-4 animate-pulse" />
                          </div>
                          <div className="text-red-300 text-xs mt-1">
                            You are about to burn your ENTIRE {selectedToken.symbol} balance. This cannot be undone!
                          </div>
                        </div>
                      )}
                      <div className="text-zinc-400 text-sm">
                        Available: {formatAmount(selectedToken.uiAmount)} {selectedToken.symbol}
                      </div>
                    </div>
                  </div>
                )}

                {/* Burn Button */}
                {selectedToken && burnAmount && (
                  <div className="space-y-4">
                    <Button
                      onClick={handleBurnClick}
                      disabled={isBurning || !burnAmount || Number.parseFloat(burnAmount) <= 0}
                      className="w-full h-12 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-red-600/25"
                    >
                      {isBurning ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Burning Tokens...
                        </>
                      ) : (
                        <>
                          <Flame className="w-4 h-4 mr-2" />
                          Burn {burnAmount} {selectedToken.symbol}
                        </>
                      )}
                    </Button>

                    <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4 text-blue-400" />
                        <span className="text-zinc-300 text-sm font-medium">Burn Summary</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Token:</span>
                          <span className="text-white">{selectedToken.symbol}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Amount to burn:</span>
                          <span className="text-white">{burnAmount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Remaining balance:</span>
                          <span className="text-white">
                            {(selectedToken.uiAmount - Number.parseFloat(burnAmount || "0")).toFixed(6)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Burn address:</span>
                          <span className="text-white font-mono text-xs">{truncateAddress(BURN_ADDRESS)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Status Messages */}
                {error && (
                  <Alert className="bg-red-950/50 border-red-800 text-red-200">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-200">{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-emerald-950/50 border-emerald-800 text-emerald-200">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <AlertDescription className="text-emerald-200">{success}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Burn History */}
        {burnHistory.length > 0 && (
          <Card className="bg-zinc-900 border-zinc-800 shadow-xl shadow-black/30">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-400" />
                Burn History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {burnHistory.map((burn, index) => (
                  <div key={index} className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <div>
                          <div className="text-white font-medium">Burned {burn.amount} tokens</div>
                          <div className="text-zinc-400 text-sm">{burn.timestamp.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          {burn.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copySignature(burn.signature)}
                          className="text-zinc-400 hover:text-white"
                        >
                          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                Confirm Token Burn
              </DialogTitle>
              <DialogDescription className="text-zinc-400">
                This action cannot be undone. The tokens will be permanently removed from circulation.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Token:</span>
                    <span className="text-white">{selectedToken?.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Amount to burn:</span>
                    <span className="text-red-400 font-bold">{burnAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Value:</span>
                    <span className="text-white">Permanently destroyed</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowConfirmDialog(false)}
                  variant="outline"
                  className="flex-1 bg-zinc-800 border-zinc-600 text-zinc-200 hover:bg-zinc-700 hover:border-zinc-500 hover:text-white transition-all duration-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={executeBurn}
                  disabled={isBurning}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {isBurning ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Burning...
                    </>
                  ) : (
                    <>
                      <Flame className="w-4 h-4 mr-2" />
                      Confirm Burn
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Footer */}
        <div className="text-center py-6">
          <Separator className="bg-zinc-800 mb-6" />
          <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm">
            <Shield className="w-4 h-4" />
            <span>Secure token burning • Powered by Solana blockchain</span>
          </div>
          <div className="text-zinc-600 text-xs mt-2">
            ⚠️ Always double-check before burning. This action is irreversible.
          </div>
        </div>
      </div>
    </div>
  )
}
