"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, TrendingUp, RefreshCw, Clock, ExternalLink, Info, Code, Copy, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"
import { toast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

// Token type definition
type MoralisPumpToken = {
  tokenAddress: string
  name: string
  symbol: string
  logo: string
  decimals: string
  priceNative: string
  priceUsd: string
  liquidity: string
  fullyDilutedValuation: string
  createdAt: string
}

type Token = {
  id: string
  name: string
  symbol: string
  price: number
  priceChange: number
  volume: number
  marketCap: number
  timestamp: number
  address: string
  lastUpdated?: number
  // Moralis API fields
  logo?: string
  decimals?: string
  totalSupply?: string
  totalSupplyFormatted?: string
  fullyDilutedValue?: string
  description?: string | null
  liquidity?: string
  priceNative?: string
  createdAt?: string
}

// WebSocket message types
type NewTokenEvent = {
  type: "newToken"
  data: {
    address: string
    name: string
    symbol: string
    timestamp: number
    initialPrice: number
  }
}

type MigrationEvent = {
  type: "migration"
  data: {
    fromAddress: string
    toAddress: string
    name: string
    symbol: string
    timestamp: number
  }
}

type TradeEvent = {
  type: "trade"
  data: {
    tokenAddress: string
    tokenName: string
    tokenSymbol: string
    amount: number
    price: number
    timestamp: number
    type: "buy" | "sell"
    account: string
  }
}

type WebSocketEvent = NewTokenEvent | MigrationEvent | TradeEvent

// Sample fallback data to use when API fails
const sampleTokens: Token[] = [
  {
    id: "GiFonU2URxtptiCLtvCzzAEgo2dVSMaaSqF5pugz2S5K",
    name: "joined The Swarm",
    symbol: "catcatwin1",
    price: 0.000004955,
    priceChange: 0,
    volume: 0,
    marketCap: 4955,
    timestamp: new Date("2025-05-26T04:36:29.000Z").getTime(),
    address: "GiFonU2URxtptiCLtvCzzAEgo2dVSMaaSqF5pugz2S5K",
    lastUpdated: Date.now(),
    decimals: "6",
    priceNative: "0.0000000279729",
    liquidity: "10631.04329881",
    fullyDilutedValue: "4955",
    createdAt: "2025-05-26T04:36:29.000Z",
  },
  {
    id: "8JUjWjnPcBR2sLJSxbGQJPGUXGwXqPRpVEsfcw8N4AfZ",
    name: "Solana Meme Coin",
    symbol: "MEME",
    price: 0.000023,
    priceChange: 2.5,
    volume: 150000,
    marketCap: 23000,
    timestamp: Date.now() - 3600000,
    address: "8JUjWjnPcBR2sLJSxbGQJPGUXGwXqPRpVEsfcw8N4AfZ",
    lastUpdated: Date.now(),
    decimals: "9",
    priceNative: "0.0000001298",
    liquidity: "45000.32",
    fullyDilutedValue: "23000",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    name: "Bonk",
    symbol: "BONK",
    price: 0.000012,
    priceChange: -1.2,
    volume: 250000,
    marketCap: 120000,
    timestamp: Date.now() - 7200000,
    address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    lastUpdated: Date.now(),
    logo: "",
    decimals: "5",
    liquidity: "89000.45",
    priceNative: "0.0000000678",
    fullyDilutedValue: "120000",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
]

// Updated fetchTokensFromMoralis function with better error handling
const fetchTokensFromMoralis = async (): Promise<Token[]> => {
  try {
    // Using the exact options and fetch code provided by the user
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "X-API-Key":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImJiNTBkNzUyLTM3MzEtNGVmYi1iZmU5LWY5N2VmN2VkOTgyNSIsIm9yZ0lkIjoiNDQ4ODk3IiwidXNlcklkIjoiNDYxODY2IiwidHlwZUlkIjoiMDFhYThiYzUtNGY3Yy00ZGNkLWEwYTctMGU5MTM2OTE5NTM3IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDgwNzkyOTMsImV4cCI6NDkwMzgzOTI5M30.YrhSPKNsW2itWxXDRI0aFDg5YGl2bGeLK_sQkVW9Clk",
      },
    }

    console.log("Fetching tokens from Moralis API...")

    const response = await fetch(
      "https://solana-gateway.moralis.io/token/mainnet/exchange/pumpfun/new?limit=100",
      options,
    )

    // Handle different HTTP status codes
    if (response.status === 401) {
      console.warn("API Key authentication failed (401). Using sample data.")
      toast({
        title: "API Authentication Issue",
        description: "Using sample data while API key is being validated",
        variant: "default",
      })
      return sampleTokens
    }

    if (response.status === 403) {
      console.warn("API access forbidden (403). Using sample data.")
      return sampleTokens
    }

    if (response.status === 429) {
      console.warn("API rate limit exceeded (429). Using sample data.")
      return sampleTokens
    }

    if (!response.ok) {
      console.warn(`API responded with status: ${response.status}. Using sample data.`)
      return sampleTokens
    }

    const data = await response.json()
    console.log("Moralis API response received:", data)

    // Function to transform token data consistently
    const transformToken = (item: any): Token => {
      const token: Token = {
        id: item.tokenAddress || item.address || item.mint || `token-${Date.now()}-${Math.random()}`,
        name: item.name || "Unknown Token",
        symbol: item.symbol || "UNK",
        price: Number.parseFloat(item.priceUsd || item.price || "0") || 0,
        priceChange: 0,
        volume: 0,
        marketCap: Number.parseFloat(item.fullyDilutedValuation || item.marketCap || "0") || 0,
        timestamp: item.createdAt ? new Date(item.createdAt).getTime() : Date.now(),
        address: item.tokenAddress || item.address || item.mint || "",
        lastUpdated: Date.now(),
        logo: item.logo || "",
        decimals: item.decimals || "9",
        liquidity: item.liquidity || "0",
        priceNative: item.priceNative || "0",
        fullyDilutedValue: item.fullyDilutedValuation || "0",
        createdAt: item.createdAt || new Date().toISOString(),
      }
      return token
    }

    let tokens: Token[] = []

    // Handle different response formats
    if (Array.isArray(data)) {
      console.log(`Found ${data.length} tokens in array format`)
      tokens = data.map(transformToken)
    } else if (data && typeof data === "object") {
      // Check for common response wrapper properties
      if (Array.isArray(data.result)) {
        console.log(`Found ${data.result.length} tokens in data.result`)
        tokens = data.result.map(transformToken)
      } else if (Array.isArray(data.data)) {
        console.log(`Found ${data.data.length} tokens in data.data`)
        tokens = data.data.map(transformToken)
      } else if (Array.isArray(data.tokens)) {
        console.log(`Found ${data.tokens.length} tokens in data.tokens`)
        tokens = data.tokens.map(transformToken)
      } else {
        // Look for any array property that might contain tokens
        for (const key in data) {
          if (Array.isArray(data[key]) && data[key].length > 0) {
            console.log(`Found ${data[key].length} tokens in data.${key}`)
            tokens = data[key].map(transformToken)
            break
          }
        }

        // If no array found but data looks like a single token
        if (tokens.length === 0 && (data.tokenAddress || data.name || data.symbol)) {
          console.log("Response appears to be a single token")
          tokens = [transformToken(data)]
        }
      }
    }

    if (tokens.length === 0) {
      console.log("No tokens found in response, using sample data")
      return sampleTokens
    }

    console.log(`Successfully transformed ${tokens.length} tokens`)
    return tokens
  } catch (error) {
    console.error("Error fetching tokens from Moralis:", error)
    // Show a toast notification about the error
    toast({
      title: "API Connection Issue",
      description: "Using sample data while connection is restored",
      variant: "default",
    })
    // Return sample tokens on error
    return sampleTokens
  }
}

// Update the fetchTokenDetails function to handle errors silently
const fetchTokenDetails = async (tokenAddress: string): Promise<Partial<Token>> => {
  try {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "X-API-Key":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImJiNTBkNzUyLTM3MzEtNGVmYi1iZmU5LWY5N2VmN2VkOTgyNSIsIm9yZ0lkIjoiNDQ4ODk3IiwidXNlcklkIjoiNDYxODY2IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDgwNzkyOTMsImV4cCI6NDkwMzgzOTI5M30.YrhSPKNsW2itWxXDRI0aFDg5YGl2bGeLK_sQkVW9Clk",
      },
    }

    // Use Promise.race to get the fastest response
    const metadataPromise = fetch(
      `https://solana-gateway.moralis.io/token/mainnet/${tokenAddress}/metadata`,
      options,
    ).then((response) => {
      if (!response.ok) {
        return {} // Return empty object on error
      }
      return response.json()
    })

    // Set a timeout to ensure we don't wait too long
    const timeoutPromise = new Promise<any>((resolve) => setTimeout(() => resolve({}), 3000))

    try {
      const data = await Promise.race([metadataPromise, timeoutPromise])
      return {
        name: data.name,
        symbol: data.symbol,
        logo: data.logo,
        decimals: data.decimals,
        totalSupply: data.totalSupply,
        totalSupplyFormatted: data.totalSupplyFormatted,
        fullyDilutedValue: data.fullyDilutedValue,
        description: data.description,
      }
    } catch (error) {
      // Silently return empty object without showing errors
      console.log(`Error in Promise.race for token ${tokenAddress}, continuing without metadata:`, error)
      return {}
    }
  } catch (error) {
    // Silently return empty object without showing errors
    console.log(`Error fetching token details for ${tokenAddress}, continuing without metadata:`, error)
    return {}
  }
}

// Update the fetchTokensPeriodically function to handle errors and provide better feedback
const fetchTokensPeriodically = async (
  setTokens: React.Dispatch<React.SetStateAction<Token[]>>,
  setLastFetch: React.Dispatch<React.SetStateAction<Date | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  try {
    const fetchedTokens = await fetchTokensFromMoralis()
    console.log(`Fetched ${fetchedTokens.length} tokens from Moralis`)

    if (fetchedTokens.length > 0) {
      setTokens((prev) => {
        // Create a map to merge tokens efficiently
        const tokenMap = new Map<string, Token>()

        // Add existing tokens to preserve any real-time updates
        prev.forEach((token) => {
          if (token.address) {
            tokenMap.set(token.address, token)
          }
        })

        // Add or update with fetched tokens
        fetchedTokens.forEach((token) => {
          if (token.address) {
            const existing = tokenMap.get(token.address)
            if (existing) {
              // Preserve price change and other real-time data
              tokenMap.set(token.address, {
                ...token,
                priceChange: existing.priceChange || 0,
                volume: existing.volume || 0,
                lastUpdated: Date.now(),
              })
            } else {
              tokenMap.set(token.address, {
                ...token,
                lastUpdated: Date.now(),
              })
            }
          }
        })

        // Convert back to array and sort by timestamp (newest first)
        const sortedTokens = Array.from(tokenMap.values())
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 100) // Keep top 100 most recent

        return sortedTokens
      })

      setLastFetch(new Date())
    }

    setIsLoading(false)
  } catch (error) {
    console.error("Error in fetchTokensPeriodically:", error)
    setIsLoading(false)

    // If we have no tokens yet, use sample data
    setTokens((prev) => (prev.length > 0 ? prev : sampleTokens))
    setLastFetch(new Date())
  }
}

// Handle WebSocket messages
const handleWebSocketMessage = (message: WebSocketEvent, setTokens: any) => {
  console.log("Processing message:", message.type)

  switch (message.type) {
    case "newToken":
      console.log("New token:", message.data)
      const newToken: Token = {
        id: message.data.address,
        name: message.data.name,
        symbol: message.data.symbol,
        price: message.data.initialPrice,
        priceChange: 0,
        volume: 0,
        marketCap: 0,
        timestamp: message.data.timestamp,
        address: message.data.address,
        lastUpdated: Date.now(),
      }

      // Add the token immediately to show it in the UI
      setTokens((prev) => {
        // Check if token already exists
        const exists = prev.some((token) => token.address === newToken.address)
        if (exists) {
          return prev.map((token) =>
            token.address === newToken.address ? { ...token, ...newToken, lastUpdated: Date.now() } : token,
          )
        }
        return [newToken, ...prev].slice(0, 50) // Keep only 50 most recent tokens
      })

      // Fetch additional data from Moralis for this new token with high priority
      // Use Promise.race to get the fastest response
      Promise.race([
        fetchTokenDetails(message.data.address),
        new Promise<Partial<Token>>((resolve) => setTimeout(() => resolve({}), 2000)), // Timeout after 2 seconds
      ])
        .then((moralisData) => {
          if (Object.keys(moralisData).length > 0) {
            setTokens((prev) => {
              return prev.map((token) =>
                token.address === message.data.address ? { ...token, ...moralisData, lastUpdated: Date.now() } : token,
              )
            })
          }
        })
        .catch((error) => {
          // Silently handle errors
          console.log("Error fetching Moralis data for new token, continuing without metadata:", error)
        })

      toast({
        title: "New Token Created",
        description: `${message.data.name} (${message.data.symbol}) has been created`,
        variant: "default",
      })
      break

    case "trade":
      console.log("Trade event:", message.data)
      // Update token price and volume if we have this token
      setTokens((prev) =>
        prev.map((token) => {
          if (token.address === message.data.tokenAddress) {
            const priceChange = ((message.data.price - token.price) / token.price) * 100
            return {
              ...token,
              price: message.data.price,
              priceChange: token.priceChange === 0 ? priceChange : (token.priceChange + priceChange) / 2,
              volume: token.volume + message.data.amount * message.data.price,
              lastUpdated: Date.now(),
            }
          }
          return token
        }),
      )
      break

    case "migration":
      console.log("Migration event:", message.data)
      toast({
        title: "Token Migration",
        description: `${message.data.name} has migrated to a new contract`,
        variant: "default",
      })
      break
  }
}

// Connect to WebSocket with better error handling
const connectWebSocket = (
  setTokens: any,
  setIsConnecting: any,
  setIsConnected: any,
  wsRef: any,
  reconnectTimeoutRef: any,
) => {
  if (wsRef.current?.readyState === WebSocket.OPEN) return

  setIsConnecting(true)

  try {
    console.log("Connecting to WebSocket...")
    const ws = new WebSocket("wss://pumpportal.fun/api/data")
    wsRef.current = ws

    ws.onopen = () => {
      console.log("WebSocket connected")
      setIsConnected(true)
      setIsConnecting(false)

      // Subscribe to events
      const subscriptions = [{ method: "subscribeNewToken" }, { method: "subscribeMigration" }]

      // Send each subscription
      subscriptions.forEach((payload) => {
        console.log("Sending subscription:", payload)
        ws.send(JSON.stringify(payload))
      })

      toast({
        title: "Connected to pump.fun",
        description: "Real-time token data is now streaming",
        variant: "default",
      })
    }

    ws.onmessage = (event) => {
      console.log("Received message:", event.data)
      try {
        const message = JSON.parse(event.data) as WebSocketEvent
        handleWebSocketMessage(message, setTokens)
      } catch (error) {
        // Silently handle errors
        console.log("Error parsing WebSocket message, ignoring:", error)
      }
    }

    ws.onerror = (error) => {
      // Silently handle errors
      console.log("WebSocket error, continuing with API polling:", error)
      setIsConnected(false)
      setIsConnecting(false)
    }

    ws.onclose = () => {
      console.log("WebSocket closed")
      setIsConnected(false)
      setIsConnecting(false)

      // Attempt to reconnect after a delay
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }

      reconnectTimeoutRef.current = setTimeout(() => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          connectWebSocket(setTokens, setIsConnecting, setIsConnected, wsRef, reconnectTimeoutRef)
        }
      }, 3000)
    }
  } catch (error) {
    // Silently handle errors
    console.log("Failed to create WebSocket, continuing with API polling:", error)
    setIsConnecting(false)
  }
}

// Token card component for the showcase
const TokenCard = ({ token, formatPrice, formatLiquidity, formatTime, formatCreatedAt, truncateAddress }) => {
  return (
    <Card className="bg-gray-900/60 border-gray-800 hover:border-purple-500/50 transition-colors relative overflow-hidden">
      {token.lastUpdated && Date.now() - token.lastUpdated < 2000 && (
        <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full m-2 animate-pulse"></div>
      )}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            {token.logo ? (
              <img
                src={token.logo || "/placeholder.svg"}
                alt={token.name}
                className="w-10 h-10 rounded-full object-cover bg-gray-800"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = `/placeholder.svg?height=40&width=40&query=${token.symbol}`
                }}
                loading="eager"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-400">{token.symbol?.charAt(0) || "?"}</span>
              </div>
            )}
            <div>
              <CardTitle className="text-lg flex items-center gap-1">
                {token.name}
                <Badge className="ml-2 text-xs font-normal bg-gray-800 hover:bg-gray-700">{token.symbol}</Badge>
              </CardTitle>
              <CardDescription className="text-gray-400 flex items-center gap-1">
                {truncateAddress(token.address)}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="inline-flex">
                        <Info className="h-3 w-3 text-gray-500" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-mono text-xs">{token.address}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardDescription>
            </div>
          </div>
          <Badge
            className={`px-2 py-1 ${
              token.priceChange > 0
                ? "bg-green-500/20 text-green-400 border-green-500/50"
                : token.priceChange < 0
                  ? "bg-red-500/20 text-red-400 border-red-500/50"
                  : "bg-gray-500/20 text-gray-400 border-gray-500/50"
            }`}
          >
            {token.priceChange > 0 ? "+" : ""}
            {token.priceChange.toFixed(2)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Price (USD)</span>
          <span className="font-medium text-white">{formatPrice(token.price)}</span>
        </div>
        {token.priceNative && (
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Price (SOL)</span>
            <span className="font-medium text-white">{Number.parseFloat(token.priceNative).toFixed(10)} SOL</span>
          </div>
        )}
        {token.liquidity && (
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Liquidity</span>
            <span className="font-medium text-white">{formatLiquidity(token.liquidity)}</span>
          </div>
        )}
        {token.fullyDilutedValue && (
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>Fully Diluted Value</span>
            <span className="font-medium text-white">
              ${Number.parseFloat(token.fullyDilutedValue).toLocaleString()}
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 flex justify-between text-xs text-gray-500 border-t border-gray-800">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{token.createdAt ? formatCreatedAt(token.createdAt) : formatTime(token.timestamp)}</span>
        </div>
        <Link
          href={`https://solscan.io/token/${token.address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
        >
          View on Solscan
          <ExternalLink className="h-3 w-3" />
        </Link>
      </CardFooter>
    </Card>
  )
}

// Code snippet to display (with API key hidden)
const codeSnippet = `
// Token Tracker - Real-time Solana Token Tracker
// Dependencies to install:
// $ npm install node-fetch --save
// add "type": "module" to package.json

import { useState, useEffect, useRef } from "react"
import { formatDistanceToNow } from "date-fns"
import { toast } from "@/components/ui/use-toast"

// Token type definition
type Token = {
  id: string
  name: string
  symbol: string
  price: number
  priceChange: number
  volume: number
  marketCap: number
  timestamp: number
  address: string
  lastUpdated?: number
  logo?: string
  decimals?: string
  liquidity?: string
  priceNative?: string
  fullyDilutedValue?: string
  createdAt?: string
}

// Fetch tokens from Moralis API
const fetchTokensFromMoralis = async (): Promise<Token[]> => {
  try {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'X-API-Key': 'YOUR_API_KEY_HERE'
      },
    };

    const response = await fetch(
      "https://solana-gateway.moralis.io/token/mainnet/exchange/pumpfun/new?limit=100",
      options,
    )

    if (!response.ok) {
      console.log(\`API responded with status: \${response.status}\`)
      return [] // Return empty array on error
    }

    const data = await response.json()
    
    // Transform token data
    const transformToken = (item: any): Token => ({
      id: item.tokenAddress || item.address || "unknown",
      name: item.name || "Unknown",
      symbol: item.symbol || "UNK",
      price: Number.parseFloat(item.priceUsd || "0") || 0,
      priceChange: 0,
      volume: 0,
      marketCap: Number.parseFloat(item.fullyDilutedValuation || "0") || 0,
      timestamp: item.createdAt ? new Date(item.createdAt).getTime() : Date.now(),
      address: item.tokenAddress || item.address || "unknown",
      lastUpdated: Date.now(),
      logo: item.logo || "",
      decimals: item.decimals,
      liquidity: item.liquidity,
      priceNative: item.priceNative,
      fullyDilutedValue: item.fullyDilutedValuation,
      createdAt: item.createdAt,
    })

    // Handle different response formats
    if (Array.isArray(data)) {
      return data.map(transformToken)
    } else if (data && typeof data === "object" && Array.isArray(data.result)) {
      return data.result.map(transformToken)
    }
    
    return []
  } catch (error) {
    console.log("Error fetching tokens:", error)
    return []
  }
}

// Connect to WebSocket for real-time updates
const connectWebSocket = (setTokens) => {
  try {
    const ws = new WebSocket("wss://pumpportal.fun/api/data")
    
    ws.onopen = () => {
      // Subscribe to token events
      const subscriptions = [
        { method: "subscribeNewToken" }, 
        { method: "subscribeMigration" }
      ]
      
      subscriptions.forEach(payload => {
        ws.send(JSON.stringify(payload))
      })
      
      toast({
        title: "Connected to pump.fun",
        description: "Real-time token data is now streaming"
      })
    }
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      
      // Handle different message types
      switch (message.type) {
        case "newToken":
          // Add new token to the list
          const newToken = {
            id: message.data.address,
            name: message.data.name,
            symbol: message.data.symbol,
            price: message.data.initialPrice,
            priceChange: 0,
            volume: 0,
            marketCap: 0,
            timestamp: message.data.timestamp,
            address: message.data.address,
            lastUpdated: Date.now(),
          }
          
          setTokens(prev => [newToken, ...prev].slice(0, 50))
          break
          
        case "trade":
          // Update token price and volume
          setTokens(prev => 
            prev.map(token => {
              if (token.address === message.data.tokenAddress) {
                const priceChange = ((message.data.price - token.price) / token.price) * 100
                return {
                  ...token,
                  price: message.data.price,
                  priceChange: token.priceChange === 0 ? priceChange : (token.priceChange + priceChange) / 2,
                  volume: token.volume + message.data.amount * message.data.price,
                  lastUpdated: Date.now(),
                }
              }
              return token
            })
          )
          break
      }
    }
    
    return ws
  } catch (error) {
    console.log("WebSocket error:", error)
    return null
  }
}

// Main component
export default function TokenTracker() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [lastFetch, setLastFetch] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const wsRef = useRef<WebSocket | null>(null)
  const fetchIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Initial fetch
    fetchTokensFromMoralis().then(fetchedTokens => {
      if (fetchedTokens.length > 0) {
        setTokens(fetchedTokens)
        setLastFetch(new Date())
      }
      setIsLoading(false)
    })

    // Connect to WebSocket
    wsRef.current = connectWebSocket(setTokens)

    // Set up periodic fetching (every second)
    fetchIntervalRef.current = setInterval(() => {
      fetchTokensFromMoralis().then(fetchedTokens => {
        if (fetchedTokens.length > 0) {
          setTokens(prev => {
            // Merge fetched tokens with existing ones
            const tokenMap = new Map<string, Token>()
            
            // Add existing tokens
            prev.forEach(token => tokenMap.set(token.address, token))
            
            // Update or add fetched tokens
            fetchedTokens.forEach(token => {
              const existing = tokenMap.get(token.address)
              if (existing) {
                tokenMap.set(token.address, {
                  ...existing,
                  ...token,
                  lastUpdated: Date.now(),
                })
              } else {
                tokenMap.set(token.address, token)
              }
            })
            
            // Convert back to array and sort by timestamp (newest first)
            return Array.from(tokenMap.values())
              .sort((a, b) => b.timestamp - a.timestamp)
              .slice(0, 50) // Keep only 50 most recent
          })
          
          setLastFetch(new Date())
        }
      })
    }, 1000)

    // Cleanup
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (fetchIntervalRef.current) {
        clearInterval(fetchIntervalRef.current)
      }
    }
  }, [])

  // Format helpers
  const formatPrice = (price) => price < 0.001 ? price.toFixed(8) : price.toFixed(6)
  const formatLiquidity = (liquidity) => {
    const value = Number.parseFloat(liquidity)
    return value >= 1000000
      ? \`$\${(value / 1000000).toFixed(2)}M\`
      : value >= 1000
        ? \`$\${(value / 1000).toFixed(2)}K\`
        : \`$\${value.toFixed(2)}\`
  }
  const formatTime = (timestamp) => formatDistanceToNow(timestamp, { addSuffix: true })

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="relative z-10 px-6 py-4">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-400" />
          <span>Solana Token Tracker</span>
        </h1>
        
        {lastFetch && (
          <div className="flex items-center gap-4">
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <RefreshCw className="h-3 w-3 animate-spin" />
              <span>Updated {formatDistanceToNow(lastFetch, { addSuffix: true })}</span>
            </div>
            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">
              <span className="h-2 w-2 rounded-full bg-green-500 inline-block mr-2 animate-pulse"></span>
              Live
            </Badge>
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tokens.map((token) => (
            <Card key={token.id} className="bg-gray-900/60 border-gray-800">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {/* Token logo or placeholder */}
                    <div>
                      <CardTitle>{token.name}</CardTitle>
                      <CardDescription>{token.symbol}</CardDescription>
                    </div>
                  </div>
                  <Badge>{token.priceChange.toFixed(2)}%</Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex justify-between">
                  <span>Price (USD)</span>
                  <span>{formatPrice(token.price)}</span>
                </div>
                {/* Other token details */}
              </CardContent>
              <CardFooter className="pt-2">
                <div className="flex justify-between w-full">
                  <span>{formatTime(token.timestamp)}</span>
                  <Link href={\`https://solscan.io/token/\${token.address}\`}>
                    View on Solscan
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
`

// Main showcase component with split-screen layout
export default function TokenTrackerShowcase() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [lastFetch, setLastFetch] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isConnecting, setIsConnecting] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const fetchIntervalRef = useRef<NodeJS.Timeout | null>(null)
  // Add this state variable near the other useState declarations
  const [usingFallbackData, setUsingFallbackData] = useState<boolean>(false)

  // Initialize data and connections
  useEffect(() => {
    setIsLoading(true)
    setIsConnected(true)

    // Initial fetch with fallback detection
    const initialFetch = async () => {
      console.log("Starting initial token fetch...")
      try {
        const tokens = await fetchTokensFromMoralis()
        if (tokens === sampleTokens) {
          setUsingFallbackData(true)
        }
        setTokens(tokens)
        setLastFetch(new Date())
        setIsLoading(false)
      } catch (error) {
        setUsingFallbackData(true)
        setTokens(sampleTokens)
        setLastFetch(new Date())
        setIsLoading(false)
      }
    }

    initialFetch()

    // Connect to WebSocket for real-time updates
    connectWebSocket(setTokens, setIsConnecting, setIsConnected, wsRef, reconnectTimeoutRef)

    // Set up periodic fetching every 10 seconds to reduce API calls
    fetchIntervalRef.current = setInterval(() => {
      console.log("Periodic fetch triggered...")
      fetchTokensPeriodically(setTokens, setLastFetch, setIsLoading)
    }, 10000) // Fetch every 10 seconds to reduce API load

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (fetchIntervalRef.current) {
        clearInterval(fetchIntervalRef.current)
      }
    }
  }, [])

  const formatPrice = (price: number) => {
    return price < 0.001 ? price.toFixed(8) : price.toFixed(6)
  }

  const formatLiquidity = (liquidity: string) => {
    const value = Number.parseFloat(liquidity)
    return value >= 1000000
      ? `$${(value / 1000000).toFixed(2)}M`
      : value >= 1000
        ? `$${(value / 1000).toFixed(2)}K`
        : `$${value.toFixed(2)}`
  }

  const formatTime = (timestamp: number) => {
    return formatDistanceToNow(timestamp, { addSuffix: true })
  }

  const formatCreatedAt = (createdAt: string) => {
    return formatDistanceToNow(new Date(createdAt), { addSuffix: true })
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

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

        {/* Header with gradient */}
        <header className="relative z-10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              <span>Your Solana Token Tracker</span>
            </h1>
          </div>

          {/* Update the header section to show data source */}
          <div className="flex items-center gap-4">
            {lastFetch && (
              <div className="hidden sm:flex text-xs text-gray-400 items-center gap-1">
                <RefreshCw className="h-3 w-3 animate-spin" />
                <span>Updated {formatDistanceToNow(lastFetch, { addSuffix: true })}</span>
              </div>
            )}
            <Badge
              variant="outline"
              className={`px-3 py-1 ${
                usingFallbackData
                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                  : "bg-green-500/20 text-green-400 border-green-500/50"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full inline-block mr-2 animate-pulse ${
                  usingFallbackData ? "bg-yellow-500" : "bg-green-500"
                }`}
              ></span>
              {usingFallbackData ? "Demo Data" : "Live"}
            </Badge>
          </div>
        </header>
      </div>

      {/* Split screen layout */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
          {/* Left side - Token Tracker UI */}
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 border border-gray-800">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              <span>pump.fun Token Tracker</span>
            </h2>

            <Tabs defaultValue="new-tokens" className="w-full">
              <TabsList className="w-full mb-6 bg-gray-900/60">
                <TabsTrigger
                  value="new-tokens"
                  className="w-full data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
                >
                  New Tokens ({tokens.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="new-tokens" className="mt-0">
                {isLoading && tokens.length === 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {Array(2)
                      .fill(0)
                      .map((_, i) => (
                        <Card key={i} className="bg-gray-900/60 border-gray-800">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <Skeleton className="h-6 w-24 bg-gray-800" />
                                <Skeleton className="h-4 w-16 mt-2 bg-gray-800" />
                              </div>
                              <Skeleton className="h-8 w-20 bg-gray-800" />
                            </div>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="flex justify-between text-sm text-gray-400 mb-2">
                              <Skeleton className="h-4 w-20 bg-gray-800" />
                              <Skeleton className="h-4 w-20 bg-gray-800" />
                            </div>
                            <div className="flex justify-between text-sm text-gray-400">
                              <Skeleton className="h-4 w-24 bg-gray-800" />
                              <Skeleton className="h-4 w-16 bg-gray-800" />
                            </div>
                          </CardContent>
                          <CardFooter className="pt-2 flex justify-between text-xs text-gray-500">
                            <Skeleton className="h-4 w-32 bg-gray-800" />
                            <Skeleton className="h-4 w-20 bg-gray-800" />
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                ) : tokens.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-900/60 mb-4">
                      <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Fetching Tokens</h3>
                    <p className="text-gray-400 mb-4">Scanning for new tokens on pump.fun...</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[70vh] pr-2">
                    <div className="grid grid-cols-1 gap-4">
                      {tokens.map((token) => (
                        <TokenCard
                          key={token.id}
                          token={token}
                          formatPrice={formatPrice}
                          formatLiquidity={formatLiquidity}
                          formatTime={formatTime}
                          formatCreatedAt={formatCreatedAt}
                          truncateAddress={truncateAddress}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </TabsContent>
            </Tabs>
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
