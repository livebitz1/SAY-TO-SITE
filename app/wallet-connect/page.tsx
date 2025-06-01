"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Wallet,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  LogOut,
  Settings,
  RefreshCw,
  Code,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"

// Phantom wallet types
interface PhantomWallet {
  isPhantom: boolean
  publicKey: {
    toString(): string
  } | null
  isConnected: boolean
  connect(): Promise<{ publicKey: { toString(): string } }>
  disconnect(): Promise<void>
  on(event: string, callback: () => void): void
  off(event: string, callback: () => void): void
}

declare global {
  interface Window {
    solana?: PhantomWallet
  }
}

// Wallet Connect Component
function PhantomWalletConnect() {
  const [wallet, setWallet] = useState<PhantomWallet | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [balance, setBalance] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Helius RPC endpoint
  const HELIUS_RPC_URL = "https://mainnet.helius-rpc.com/?api-key=bc153566-8ac2-4019-9c90-e0ef5b840c07"

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
        getBalance(provider.publicKey.toString())
      }

      // Listen for account changes
      const handleAccountChanged = () => {
        if (provider.publicKey) {
          setWalletAddress(provider.publicKey.toString())
          getBalance(provider.publicKey.toString())
        } else {
          setIsConnected(false)
          setWalletAddress("")
          setBalance(null)
          setLastUpdated(null)
        }
      }

      provider.on("accountChanged", handleAccountChanged)

      return () => {
        provider.off("accountChanged", handleAccountChanged)
      }
    }
  }, [])

  // Get SOL balance using Helius RPC
  const getBalance = async (publicKey: string, showRefreshing = false) => {
    if (showRefreshing) {
      setIsRefreshing(true)
    }

    try {
      const response = await fetch(HELIUS_RPC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getBalance",
          params: [publicKey],
        }),
      })

      const data = await response.json()

      if (data.result) {
        // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
        const solBalance = data.result.value / 1000000000
        setBalance(solBalance)
        setLastUpdated(new Date())
        setError("")
      } else if (data.error) {
        setError(`RPC Error: ${data.error.message}`)
        console.error("RPC Error:", data.error)
      }
    } catch (err: any) {
      setError("Failed to fetch balance")
      console.error("Error fetching balance:", err)
    } finally {
      if (showRefreshing) {
        setIsRefreshing(false)
      }
    }
  }

  // Get SOL price from CoinGecko
  const getSolPrice = async () => {
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd")
      const data = await response.json()
      return data.solana?.usd || 180 // fallback price
    } catch (err) {
      console.error("Error fetching SOL price:", err)
      return 180 // fallback price
    }
  }

  const [solPrice, setSolPrice] = useState(180)

  useEffect(() => {
    getSolPrice().then(setSolPrice)
  }, [])

  const connectWallet = async () => {
    if (!wallet) {
      setError("Phantom wallet is not installed")
      return
    }

    setIsConnecting(true)
    setError("")

    try {
      const response = await wallet.connect()
      const publicKey = response.publicKey.toString()

      setIsConnected(true)
      setWalletAddress(publicKey)
      await getBalance(publicKey)
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet")
      console.error("Connection error:", err)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = async () => {
    if (!wallet) return

    setIsDisconnecting(true)

    try {
      await wallet.disconnect()
      setIsConnected(false)
      setWalletAddress("")
      setBalance(null)
      setLastUpdated(null)
      setError("")
    } catch (err: any) {
      setError(err.message || "Failed to disconnect wallet")
      console.error("Disconnect error:", err)
    } finally {
      setIsDisconnecting(false)
    }
  }

  const refreshBalance = async () => {
    if (walletAddress) {
      await getBalance(walletAddress, true)
    }
  }

  const copyAddress = async () => {
    if (walletAddress) {
      try {
        await navigator.clipboard.writeText(walletAddress)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error("Failed to copy address:", err)
      }
    }
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`
  }

  const openPhantomDownload = () => {
    window.open("https://phantom.app/", "_blank")
  }

  const formatLastUpdated = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)

    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  return (
    <div className="flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Card className="bg-gray-900/60 border-gray-800 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              {isConnected && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <CardTitle className="text-white text-xl font-semibold">Phantom Wallet</CardTitle>
              <CardDescription className="text-gray-400 text-sm">
                {!wallet ? "Wallet not detected" : isConnected ? "Successfully connected" : "Connect to continue"}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            {error && (
              <Alert className="bg-red-500/10 border-red-500/30 text-red-400">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            {!wallet ? (
              <div className="space-y-4">
                <div className="text-center space-y-3">
                  <p className="text-gray-400 text-sm">Phantom wallet extension is required to connect to Solana</p>
                </div>

                <Button onClick={openPhantomDownload} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Install Phantom Wallet
                </Button>

                <div className="text-center">
                  <p className="text-gray-500 text-xs">Free • Secure • Open Source</p>
                </div>
              </div>
            ) : !isConnected ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  <h3 className="text-white text-sm font-medium">Why connect your wallet?</h3>
                  <div className="space-y-2">
                    {[
                      "View your real-time SOL balance",
                      "Sign transactions securely",
                      "Access decentralized applications",
                    ].map((feature, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-gray-800" />

                <Button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4 mr-2" />
                      Connect Phantom Wallet
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/50">● Connected</Badge>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Wallet Address</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyAddress}
                        className="h-6 px-2 hover:bg-gray-800 text-gray-400 hover:text-white"
                      >
                        {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                    <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700">
                      <span className="text-white font-mono text-sm">{truncateAddress(walletAddress)}</span>
                    </div>
                  </div>

                  {balance !== null && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">SOL Balance</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={refreshBalance}
                          disabled={isRefreshing}
                          className="h-6 px-2 hover:bg-gray-800 text-gray-400 hover:text-white"
                        >
                          <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
                        </Button>
                      </div>
                      <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700">
                        <div className="flex items-baseline gap-2">
                          <span className="text-white font-mono text-lg">{balance.toFixed(4)}</span>
                          <span className="text-gray-400 text-sm">SOL</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <div className="text-gray-500 text-xs">≈ ${(balance * solPrice).toFixed(2)} USD</div>
                          {lastUpdated && (
                            <div className="text-gray-500 text-xs">Updated {formatLastUpdated(lastUpdated)}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Separator className="bg-gray-800" />

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => window.open("https://phantom.app/", "_blank")}
                      className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white"
                      size="sm"
                    >
                      <Settings className="w-3 h-3 mr-1" />
                      Manage
                    </Button>
                    <Button
                      onClick={() => window.open("https://phantom.app/", "_blank")}
                      className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white"
                      size="sm"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Open App
                    </Button>
                  </div>

                  <Button
                    onClick={disconnectWallet}
                    disabled={isDisconnecting}
                    className="w-full bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 hover:border-red-600/50 text-red-400 hover:text-red-300"
                  >
                    {isDisconnecting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Disconnecting...
                      </>
                    ) : (
                      <>
                        <LogOut className="w-4 h-4 mr-2" />
                        Disconnect Wallet
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-center pt-1">
                  <p className="text-gray-500 text-xs">Powered by Helius RPC</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Code snippet to display
const codeSnippet = `
// Phantom Wallet Connect - Solana Wallet Integration
// Dependencies to install:
// $ npm install @solana/web3.js

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Copy, RefreshCw, LogOut } from 'lucide-react'

// Phantom wallet types
interface PhantomWallet {
  isPhantom: boolean
  publicKey: { toString(): string } | null
  isConnected: boolean
  connect(): Promise<{ publicKey: { toString(): string } }>
  disconnect(): Promise<void>
  on(event: string, callback: () => void): void
  off(event: string, callback: () => void): void
}

declare global {
  interface Window {
    solana?: PhantomWallet
  }
}

export default function PhantomWalletConnect() {
  const [wallet, setWallet] = useState<PhantomWallet | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [balance, setBalance] = useState<number | null>(null)
  const [error, setError] = useState("")

  // Helius RPC endpoint for balance fetching
  const HELIUS_RPC_URL = "https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY"

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
        getBalance(provider.publicKey.toString())
      }

      // Listen for account changes
      const handleAccountChanged = () => {
        if (provider.publicKey) {
          setWalletAddress(provider.publicKey.toString())
          getBalance(provider.publicKey.toString())
        } else {
          setIsConnected(false)
          setWalletAddress("")
          setBalance(null)
        }
      }

      provider.on("accountChanged", handleAccountChanged)

      return () => {
        provider.off("accountChanged", handleAccountChanged)
      }
    }
  }, [])

  // Get SOL balance using Helius RPC
  const getBalance = async (publicKey: string) => {
    try {
      const response = await fetch(HELIUS_RPC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getBalance",
          params: [publicKey],
        }),
      })

      const data = await response.json()

      if (data.result) {
        // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
        const solBalance = data.result.value / 1000000000
        setBalance(solBalance)
        setError("")
      } else if (data.error) {
        setError(\`RPC Error: \${data.error.message}\`)
      }
    } catch (err) {
      setError("Failed to fetch balance")
      console.error("Error fetching balance:", err)
    }
  }

  // Connect to Phantom wallet
  const connectWallet = async () => {
    if (!wallet) {
      setError("Phantom wallet is not installed")
      return
    }

    setIsConnecting(true)
    setError("")

    try {
      const response = await wallet.connect()
      const publicKey = response.publicKey.toString()

      setIsConnected(true)
      setWalletAddress(publicKey)
      await getBalance(publicKey)
    } catch (err) {
      setError(err.message || "Failed to connect wallet")
      console.error("Connection error:", err)
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect wallet
  const disconnectWallet = async () => {
    if (!wallet) return

    try {
      await wallet.disconnect()
      setIsConnected(false)
      setWalletAddress("")
      setBalance(null)
      setError("")
    } catch (err) {
      setError(err.message || "Failed to disconnect wallet")
      console.error("Disconnect error:", err)
    }
  }

  // Copy wallet address to clipboard
  const copyAddress = async () => {
    if (walletAddress) {
      try {
        await navigator.clipboard.writeText(walletAddress)
        // Show success feedback
      } catch (err) {
        console.error("Failed to copy address:", err)
      }
    }
  }

  // Truncate address for display
  const truncateAddress = (address: string) => {
    return \`\${address.slice(0, 6)}...\${address.slice(-6)}\`
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <Card className="bg-gray-900 border-gray-800 w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 relative">
            <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            {isConnected && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900">
                <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
              </div>
            )}
          </div>
          <CardTitle className="text-white">Phantom Wallet</CardTitle>
          <p className="text-gray-400 text-sm">
            {!wallet ? "Wallet not detected" : isConnected ? "Connected" : "Connect to continue"}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {!wallet ? (
            <div className="space-y-4">
              <p className="text-gray-400 text-sm text-center">
                Phantom wallet extension is required
              </p>
              <Button
                onClick={() => window.open("https://phantom.app/", "_blank")}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Install Phantom Wallet
              </Button>
            </div>
          ) : !isConnected ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-white text-sm font-medium">Features:</h3>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• View real-time SOL balance</li>
                  <li>• Sign transactions securely</li>
                  <li>• Access dApps</li>
                </ul>
              </div>
              
              <Button
                onClick={connectWallet}
                disabled={isConnecting}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isConnecting ? "Connecting..." : "Connect Phantom Wallet"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50 w-full justify-center">
                ● Connected
              </Badge>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">Address</span>
                    <Button variant="ghost" size="sm" onClick={copyAddress}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <span className="font-mono text-sm">{truncateAddress(walletAddress)}</span>
                  </div>
                </div>

                {balance !== null && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">Balance</span>
                      <Button variant="ghost" size="sm" onClick={() => getBalance(walletAddress)}>
                        <RefreshCw className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <span className="font-mono text-lg">{balance.toFixed(4)} SOL</span>
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={disconnectWallet}
                className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
`

// Main showcase component with split-screen layout
export default function WalletConnectShowcase() {
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
              <Wallet className="h-5 w-5 text-purple-400" />
              <span>Your Phantom Wallet Connect</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/50 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-purple-500 inline-block mr-2 animate-pulse"></span>
              Ready
            </Badge>
          </div>
        </header>
      </div>

      {/* Split screen layout */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
          {/* Left side - Wallet Connect UI */}
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 border border-gray-800">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-purple-400" />
              <span>Phantom Wallet Connect</span>
            </h2>

            <div className="flex items-center justify-center min-h-[70vh]">
              <PhantomWalletConnect />
            </div>
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
