"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Flame, Copy, Check, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import TokenBurnerPage from "./token-burner-component"

// Code snippet to display
const codeSnippet = `
// Token Burner - Solana Token Burning Station
// Dependencies to install:
// $ npm install @solana/web3.js @solana/spl-token

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Flame, Wallet, AlertTriangle } from 'lucide-react'

// Phantom wallet types
interface PhantomWallet {
  isPhantom: boolean
  publicKey: { toString(): string } | null
  isConnected: boolean
  connect(): Promise<{ publicKey: { toString(): string } }>
  disconnect(): Promise<void>
  signAndSendTransaction(transaction: any): Promise<{ signature: string }>
}

interface TokenBalance {
  mint: string
  amount: number
  decimals: number
  uiAmount: number
  symbol?: string
  name?: string
}

export default function TokenBurner() {
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

  const HELIUS_RPC_URL = "https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY"
  const BURN_ADDRESS = "1nc1nerator11111111111111111111111111111111"

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
    } catch (err) {
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
          params: [
            address, 
            { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" }, 
            { encoding: "jsonParsed" }
          ],
        }),
      })

      const data = await response.json()

      if (data.result) {
        const tokenBalances = data.result.value
          .map((account) => {
            const info = account.account.data.parsed.info
            return {
              mint: info.mint,
              amount: parseInt(info.tokenAmount.amount),
              decimals: info.tokenAmount.decimals,
              uiAmount: info.tokenAmount.uiAmount,
              symbol: "Unknown",
              name: "Unknown Token",
            }
          })
          .filter((token) => token.uiAmount > 0)

        // Fetch token metadata for each token
        const tokensWithMetadata = await Promise.all(
          tokenBalances.map(async (token) => {
            try {
              const metadata = await getTokenMetadata(token.mint)
              return {
                ...token,
                symbol: metadata?.symbol || token.symbol,
                name: metadata?.name || token.name,
              }
            } catch {
              return token
            }
          })
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
        }
      }
      return null
    } catch (err) {
      console.warn("Failed to fetch metadata:", err)
      return null
    }
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
      const burnAmountNum = parseFloat(burnAmount)
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
      setSuccess(\`Successfully burned \${burnAmountNum} \${selectedToken.symbol}!\`)

      // Update token balance (simulate)
      setTokens((prev) =>
        prev.map((token) =>
          token.mint === selectedToken.mint 
            ? { ...token, uiAmount: token.uiAmount - burnAmountNum } 
            : token
        )
      )

      // Reset form
      setBurnAmount("")
      setSelectedToken(null)
    } catch (err) {
      setError(err.message || "Failed to burn tokens")
      console.error("Burn error:", err)
    } finally {
      setIsBurning(false)
    }
  }

  const truncateAddress = (address: string) => {
    if (!address || address.length < 8) return address
    return \`\${address.slice(0, 6)}...\${address.slice(-6)}\`
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Flame className="w-9 h-9 text-white" />
            </div>
            <CardTitle className="text-white text-2xl">Token Burn Station</CardTitle>
            <p className="text-gray-400">
              Permanently remove tokens from circulation to reduce supply
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Warning Alert */}
            <Alert className="bg-red-900/30 border-red-800 text-red-200">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-200">
                <strong>Warning:</strong> Token burning is irreversible. Burned tokens cannot be recovered.
              </AlertDescription>
            </Alert>

            {!isConnected ? (
              <div className="text-center space-y-6">
                <p className="text-gray-400">
                  Connect your Phantom wallet to view your token balances and start burning tokens
                </p>
                <Button
                  onClick={connectWallet}
                  disabled={isLoading || !wallet}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isLoading ? "Connecting..." : "Connect Phantom Wallet"}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Wallet Info */}
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="text-gray-400 text-sm mb-1">Connected Wallet</div>
                  <div className="text-white font-mono">{truncateAddress(walletAddress)}</div>
                </div>

                {/* Token Selection */}
                <div className="space-y-4">
                  <h3 className="text-white text-lg font-medium">Select Token to Burn</h3>
                  
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="text-gray-400">Loading your tokens...</div>
                    </div>
                  ) : tokens.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {tokens.map((token) => (
                        <div
                          key={token.mint}
                          onClick={() => setSelectedToken(token)}
                          className={\`bg-gray-800 rounded-lg p-4 border cursor-pointer \${
                            selectedToken?.mint === token.mint
                              ? "border-red-500"
                              : "border-gray-700 hover:border-gray-600"
                          }\`}
                        >
                          <div className="flex justify-between">
                            <div>
                              <div className="text-white font-medium">{token.symbol || "Unknown"}</div>
                              <div className="text-gray-400 text-sm">{token.name || "Unknown Token"}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-mono">{token.uiAmount}</div>
                              <div className="text-gray-500 text-xs">{token.symbol}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400">No tokens found in your wallet</div>
                    </div>
                  )}
                </div>

                {/* Burn Amount Input */}
                {selectedToken && (
                  <div className="space-y-4">
                    <h3 className="text-white text-lg font-medium">Burn Amount</h3>
                    <div className="space-y-3">
                      <Input
                        placeholder="Enter amount to burn"
                        value={burnAmount}
                        onChange={(e) => setBurnAmount(e.target.value)}
                        type="number"
                        min="0"
                        max={selectedToken.uiAmount}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                      <div className="text-gray-400 text-sm">
                        Available: {selectedToken.uiAmount} {selectedToken.symbol}
                      </div>
                    </div>
                  </div>
                )}

                {/* Burn Button */}
                {selectedToken && burnAmount && (
                  <Button
                    onClick={executeBurn}
                    disabled={isBurning || !burnAmount || parseFloat(burnAmount) <= 0}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isBurning ? "Burning Tokens..." : \`Burn \${burnAmount} \${selectedToken.symbol}\`}
                  </Button>
                )}

                {/* Status Messages */}
                {error && (
                  <Alert className="bg-red-900/30 border-red-800 text-red-200">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-200">{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-900/30 border-green-800 text-green-200">
                    <AlertDescription className="text-green-200">{success}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
`

// Main showcase component with split-screen layout
export default function TokenBurnerShowcase() {
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
              <Flame className="h-5 w-5 text-purple-400" />
              <span>Your Token Burner</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/50 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-red-500 inline-block mr-2 animate-pulse"></span>
              Ready
            </Badge>
          </div>
        </header>
      </div>

      {/* Split screen layout */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
          {/* Left side - Token Burner UI */}
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 border border-gray-800">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Flame className="h-5 w-5 text-purple-400" />
              <span>Token Burn Station</span>
            </h2>

            <ScrollArea className="h-[70vh] pr-2">
              <TokenBurnerPage />
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
