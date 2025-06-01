"use client"

import { useState, useEffect, useRef } from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { WalletConnection } from "@/components/wallet-dashboard/wallet-connection"
import { DashboardLoadingState } from "@/components/wallet-dashboard/loading-state"
import { DashboardHeader } from "@/components/wallet-dashboard/dashboard-header"
import { DashboardTabs } from "@/components/wallet-dashboard/dashboard-tabs"
import { NFTDetailModal } from "@/components/wallet-dashboard/nft-detail-modal"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Copy, Code } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

// Types
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

interface NFT {
  mint: string
  name: string
  image?: string
  collection?: {
    name: string
    verified: boolean
    floorPrice?: number
  }
  attributes?: Array<{ trait_type: string; value: string }>
  compressed?: boolean
  lastSale?: {
    price: number
    marketplace: string
    date: string
  }
  listing?: {
    price: number
    marketplace: string
  }
}

interface Transaction {
  signature: string
  slot: number
  blockTime: number
  fee: number
  status: string
  type: string
  description: string
  amount?: number
  token?: string
  from?: string
  to?: string
  nft?: string
  program?: string
  source?: string
}

interface DomainName {
  domain: string
  owner: string
  resolver?: string
  records?: Record<string, string>
}

interface ProgramInteraction {
  program: string
  programName: string
  transactionCount: number
  firstInteraction: Date
  lastInteraction: Date
  totalVolume?: number
  description?: string
}

interface WalletStats {
  totalValueUSD: number
  solBalance: number
  tokenCount: number
  nftCount: number
  transactionCount: number
  programInteractions: number
  portfolioChange24h: number
}

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

export default function SolanaWalletDashboard() {
  const [wallet, setWallet] = useState<PhantomWallet | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)
  const [expandedPrograms, setExpandedPrograms] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview")
  const codeRef = useRef<HTMLPreElement>(null)

  // Data states
  const [walletStats, setWalletStats] = useState<WalletStats | null>(null)
  const [tokens, setTokens] = useState<TokenBalance[]>([])
  const [nfts, setNFTs] = useState<NFT[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [domainNames, setDomainNames] = useState<DomainName[]>([])
  const [programInteractions, setProgramInteractions] = useState<ProgramInteraction[]>([])
  const [recentActivity, setRecentActivity] = useState<Transaction[]>([])

  const HELIUS_RPC_URL = "https://mainnet.helius-rpc.com/?api-key=bc153566-8ac2-4019-9c90-e0ef5b840c07"

  // Check wallet connection
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
      if (provider.isConnected && provider.publicKey) {
        setIsConnected(true)
        setWalletAddress(provider.publicKey.toString())
        fetchAllWalletData(provider.publicKey.toString())
      }

      const handleAccountChanged = () => {
        if (provider.publicKey) {
          setWalletAddress(provider.publicKey.toString())
          fetchAllWalletData(provider.publicKey.toString())
        } else {
          resetWalletData()
        }
      }

      provider.on("accountChanged", handleAccountChanged)
      return () => provider.off("accountChanged", handleAccountChanged)
    }
  }, [])

  // Helius RPC helper
  const heliusRPC = async (method: string, params: any[] = []) => {
    try {
      const response = await fetch(HELIUS_RPC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method,
          params,
        }),
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      if (data.error) throw new Error(data.error.message || "RPC call failed")
      return data.result
    } catch (error) {
      console.error(`Helius RPC call failed for ${method}:`, error)
      throw error
    }
  }

  // Get SOL balance
  const getSolBalance = async (address: string): Promise<number> => {
    try {
      const result = await heliusRPC("getBalance", [address])
      return result.value / 1000000000 // Convert lamports to SOL
    } catch (error) {
      console.error("Failed to fetch SOL balance:", error)
      return 0
    }
  }

  // Get token balances with metadata
  const getTokenBalances = async (address: string): Promise<TokenBalance[]> => {
    try {
      const result = await heliusRPC("getTokenAccountsByOwner", [
        address,
        { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
        { encoding: "jsonParsed" },
      ])

      const tokenBalances = await Promise.all(
        result.value
          .filter((account: any) => {
            const amount = account.account.data.parsed.info.tokenAmount.uiAmount
            return amount > 0
          })
          .map(async (account: any) => {
            const info = account.account.data.parsed.info
            const mint = info.mint
            const uiAmount = info.tokenAmount.uiAmount

            // Get token metadata
            let metadata = { name: "Unknown Token", symbol: "UNKNOWN", logoURI: undefined }
            try {
              const metadataResult = await heliusRPC("getAsset", [mint])
              if (metadataResult?.content?.metadata) {
                metadata = {
                  name: metadataResult.content.metadata.name || "Unknown Token",
                  symbol: metadataResult.content.metadata.symbol || "UNKNOWN",
                  logoURI: metadataResult.content.files?.[0]?.uri || metadataResult.content.links?.image,
                }
              }
            } catch (error) {
              // Silently handle metadata fetch errors
              console.warn(`Failed to get metadata for token ${mint}`)
            }

            // Get token price from Jupiter
            let price = 0
            let priceChange24h = 0
            try {
              const priceResponse = await fetch(`https://price.jup.ag/v4/price?ids=${mint}`)
              if (priceResponse.ok) {
                const priceData = await priceResponse.json()
                if (priceData.data?.[mint]) {
                  price = priceData.data[mint].price
                  priceChange24h = priceData.data[mint].priceChange24h || 0
                }
              }
            } catch (error) {
              console.warn(`Failed to get price for token ${mint}`)
            }

            return {
              mint,
              amount: Number.parseInt(info.tokenAmount.amount),
              decimals: info.tokenAmount.decimals,
              uiAmount,
              name: metadata.name,
              symbol: metadata.symbol,
              logoURI: metadata.logoURI,
              price,
              priceChange24h,
              verified: false, // Could add verification logic
              balance: uiAmount,
              valueUSD: uiAmount * price,
            }
          }),
      )

      return tokenBalances.sort((a, b) => (b.valueUSD || 0) - (a.valueUSD || 0))
    } catch (error) {
      console.error("Failed to fetch token balances:", error)
      return []
    }
  }

  // Get all NFTs (compressed + uncompressed)
  const getAllNFTs = async (address: string): Promise<NFT[]> => {
    try {
      const response = await fetch(
        `https://api.helius.xyz/v0/addresses/${address}/nfts?api-key=bc153566-8ac2-4019-9c90-e0ef5b840c07`,
      )

      if (!response.ok) throw new Error("Failed to fetch NFTs")
      const nfts = await response.json()

      return nfts.map((nft: any) => ({
        mint: nft.mint,
        name: nft.content?.metadata?.name || "Unknown NFT",
        image: nft.content?.files?.[0]?.uri || nft.content?.links?.image,
        collection: nft.grouping?.[0]
          ? {
              name: nft.grouping[0].group_value || "Unknown Collection",
              verified: nft.content?.metadata?.verified || false,
            }
          : undefined,
        attributes: nft.content?.metadata?.attributes || [],
        compressed: nft.compression?.compressed || false,
      }))
    } catch (error) {
      console.error("Failed to fetch NFTs:", error)
      return []
    }
  }

  // Get transaction history with decoding
  const getTransactionHistory = async (address: string): Promise<Transaction[]> => {
    try {
      const signatures = await heliusRPC("getSignaturesForAddress", [address, { limit: 100 }])

      const transactions = await Promise.all(
        signatures.slice(0, 50).map(async (sig: any) => {
          try {
            const tx = await heliusRPC("getTransaction", [
              sig.signature,
              { encoding: "jsonParsed", maxSupportedTransactionVersion: 0 },
            ])

            // Parse transaction details
            const meta = tx.meta
            const message = tx.transaction.message
            const instructions = message.instructions

            let type = "Unknown"
            let description = "Transaction"
            let amount = 0
            const token = ""
            let program = ""

            // Analyze instructions to determine transaction type
            for (const instruction of instructions) {
              if (instruction.program === "system") {
                if (instruction.parsed?.type === "transfer") {
                  type = "SOL Transfer"
                  description = `Transferred ${instruction.parsed.info.lamports / 1000000000} SOL`
                  amount = instruction.parsed.info.lamports / 1000000000
                }
              } else if (instruction.program === "spl-token") {
                if (instruction.parsed?.type === "transfer") {
                  type = "Token Transfer"
                  description = `Token transfer`
                  amount = Number.parseFloat(instruction.parsed.info.amount || "0")
                }
              } else if (instruction.programId) {
                program = instruction.programId
                if (program.includes("Candy")) {
                  type = "NFT Mint"
                  description = "Minted NFT"
                } else if (program.includes("Auction")) {
                  type = "NFT Purchase"
                  description = "Purchased NFT"
                }
              }
            }

            return {
              signature: sig.signature,
              slot: tx.slot,
              blockTime: sig.blockTime,
              fee: meta.fee / 1000000000,
              status: meta.err ? "Failed" : "Success",
              type,
              description,
              amount,
              token,
              program,
              source: "blockchain",
            }
          } catch (error) {
            console.warn(`Failed to fetch transaction ${sig.signature}`)
            return null
          }
        }),
      )

      return transactions.filter(Boolean) as Transaction[]
    } catch (error) {
      console.error("Failed to fetch transaction history:", error)
      return []
    }
  }

  // Get domain names (SNS)
  const getDomainNames = async (address: string): Promise<DomainName[]> => {
    try {
      // This would require specific SNS domain lookup
      // For now, return empty array as SNS integration requires specific libraries
      return []
    } catch (error) {
      console.error("Failed to fetch domain names:", error)
      return []
    }
  }

  // Analyze program interactions
  const analyzeProgramInteractions = (transactions: Transaction[]): ProgramInteraction[] => {
    const programMap = new Map<string, ProgramInteraction>()

    transactions.forEach((tx) => {
      if (tx.program) {
        const existing = programMap.get(tx.program)
        if (existing) {
          existing.transactionCount++
          existing.lastInteraction = new Date(tx.blockTime * 1000)
          if (tx.amount) existing.totalVolume = (existing.totalVolume || 0) + tx.amount
        } else {
          programMap.set(tx.program, {
            program: tx.program,
            programName: getProgramName(tx.program),
            transactionCount: 1,
            firstInteraction: new Date(tx.blockTime * 1000),
            lastInteraction: new Date(tx.blockTime * 1000),
            totalVolume: tx.amount || 0,
            description: getProgramDescription(tx.program),
          })
        }
      }
    })

    return Array.from(programMap.values()).sort((a, b) => b.transactionCount - a.transactionCount)
  }

  // Get program name
  const getProgramName = (programId: string): string => {
    const knownPrograms: Record<string, string> = {
      "11111111111111111111111111111111": "System Program",
      TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA: "SPL Token",
      "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM": "Serum DEX",
      JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4: "Jupiter",
      "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8": "Raydium",
    }
    return knownPrograms[programId] || `Program ${programId.slice(0, 8)}...`
  }

  // Get program description
  const getProgramDescription = (programId: string): string => {
    const descriptions: Record<string, string> = {
      "11111111111111111111111111111111": "Core Solana system operations",
      TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA: "SPL token transfers and operations",
      "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM": "Decentralized exchange trading",
      JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4: "Token swapping aggregator",
      "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8": "Automated market maker",
    }
    return descriptions[programId] || "Smart contract interactions"
  }

  // Calculate wallet stats
  const calculateWalletStats = (
    solBalance: number,
    tokens: TokenBalance[],
    nfts: NFT[],
    transactions: Transaction[],
    programs: ProgramInteraction[],
  ): WalletStats => {
    const solPrice = 180 // Could fetch real SOL price
    const totalTokenValue = tokens.reduce((sum, token) => sum + (token.valueUSD || 0), 0)
    const totalValueUSD = solBalance * solPrice + totalTokenValue

    // Calculate 24h portfolio change (simplified)
    const portfolioChange24h = tokens.reduce((sum, token) => {
      const tokenValue = token.valueUSD || 0
      const change = (token.priceChange24h || 0) / 100
      return sum + tokenValue * change
    }, 0)

    return {
      totalValueUSD,
      solBalance,
      tokenCount: tokens.length,
      nftCount: nfts.length,
      transactionCount: transactions.length,
      programInteractions: programs.length,
      portfolioChange24h,
    }
  }

  // Fetch all wallet data
  const fetchAllWalletData = async (address: string) => {
    setIsLoading(true)
    setError("")

    try {
      console.log("Fetching comprehensive wallet data for:", address)

      // Fetch all data in parallel
      const [solBalance, tokenBalances, allNFTs, txHistory, domains] = await Promise.all([
        getSolBalance(address),
        getTokenBalances(address),
        getAllNFTs(address),
        getTransactionHistory(address),
        getDomainNames(address),
      ])

      // Analyze program interactions
      const programs = analyzeProgramInteractions(txHistory)

      // Calculate stats
      const stats = calculateWalletStats(solBalance, tokenBalances, allNFTs, txHistory, programs)

      // Set all data
      setWalletStats(stats)
      setTokens(tokenBalances)
      setNFTs(allNFTs)
      setTransactions(txHistory)
      setDomainNames(domains)
      setProgramInteractions(programs)
      setRecentActivity(txHistory.slice(0, 10))

      console.log("Successfully fetched all wallet data")
    } catch (error: any) {
      console.error("Failed to fetch wallet data:", error)
      setError("Failed to fetch wallet data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

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
      await fetchAllWalletData(publicKey)
    } catch (error: any) {
      setError(error.message || "Failed to connect wallet")
      console.error("Connection error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Reset wallet data
  const resetWalletData = () => {
    setIsConnected(false)
    setWalletAddress("")
    setWalletStats(null)
    setTokens([])
    setNFTs([])
    setTransactions([])
    setDomainNames([])
    setProgramInteractions([])
    setRecentActivity([])
  }

  // Refresh data
  const refreshData = async () => {
    if (!walletAddress) return

    setIsRefreshing(true)
    try {
      await fetchAllWalletData(walletAddress)
    } catch (error) {
      setError("Failed to refresh data")
    } finally {
      setIsRefreshing(false)
    }
  }

  // Utility functions
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatNumber = (num: number, decimals = 2) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toFixed(decimals)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Copy code to clipboard
  const copyCode = async () => {
    if (codeRef.current) {
      await copyToClipboard(codeRef.current.textContent || "")
    }
  }

  if (!wallet) {
    return <WalletConnection wallet={wallet} isLoading={isLoading} error={error} connectWallet={connectWallet} />
  }

  if (!isConnected) {
    return <WalletConnection wallet={wallet} isLoading={isLoading} error={error} connectWallet={connectWallet} />
  }

  if (isLoading && !walletStats) {
    return <DashboardLoadingState />
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Split screen layout */}
      <div className="flex flex-col h-screen">
        {/* Top section - Dashboard Preview */}
        <div className={`${viewMode === "preview" ? "h-full" : "hidden md:block h-[60vh]"} w-full overflow-auto`}>
          <TooltipProvider>
            <div className="p-4 md:p-6">
              <div className="max-w-7xl mx-auto">
                <DashboardHeader
                  walletAddress={walletAddress}
                  isRefreshing={isRefreshing}
                  copied={copied}
                  refreshData={refreshData}
                  copyToClipboard={copyToClipboard}
                  truncateAddress={truncateAddress}
                />

                {/* Stats Overview */}
                {walletStats && (
                  <DashboardTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    walletStats={walletStats}
                    tokens={tokens}
                    nfts={nfts}
                    transactions={transactions}
                    programInteractions={programInteractions}
                    recentActivity={recentActivity}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filterType={filterType}
                    setFilterType={setFilterType}
                    expandedPrograms={expandedPrograms}
                    setExpandedPrograms={setExpandedPrograms}
                    setSelectedNFT={setSelectedNFT}
                    formatCurrency={formatCurrency}
                    formatNumber={formatNumber}
                    formatDate={formatDate}
                    truncateAddress={truncateAddress}
                    copyToClipboard={copyToClipboard}
                  />
                )}

                {/* NFT Detail Modal */}
                <NFTDetailModal
                  selectedNFT={selectedNFT}
                  setSelectedNFT={setSelectedNFT}
                  copyToClipboard={copyToClipboard}
                />
              </div>
            </div>
          </TooltipProvider>
        </div>

        {/* Bottom section - Code View */}
        <div
          className={`${viewMode === "code" ? "h-full" : "hidden md:block h-[40vh]"} w-full bg-gray-950 border-t border-gray-800`}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-black">
              <h3 className="text-white font-medium">Component Code</h3>
              <Button variant="outline" size="sm" onClick={copyCode} className="text-xs">
                <Copy className="h-3 w-3 mr-1" />
                Copy Code
              </Button>
            </div>
            <ScrollArea className="flex-1 p-4">
              <pre ref={codeRef} className="text-sm text-gray-300 font-mono">
                <code>{`// Solana Wallet Dashboard Component
import { useState, useEffect } from "react";
import { Wallet, RefreshCw, Copy, Check, ExternalLink, TrendingUp, TrendingDown, Coins, ImageIcon, Activity, History, Settings, Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function SolanaWalletDashboard() {
  // State management for wallet connection
  const [wallet, setWallet] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // UI state
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedNFT, setSelectedNFT] = useState(null);
  
  // Data states
  const [walletStats, setWalletStats] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [nfts, setNFTs] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [programInteractions, setProgramInteractions] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  // Connect to Phantom wallet
  const connectWallet = async () => {
    if (!window.solana) {
      setError("Phantom wallet is not installed");
      return;
    }

    try {
      const response = await window.solana.connect();
      const publicKey = response.publicKey.toString();
      setIsConnected(true);
      setWalletAddress(publicKey);
      await fetchWalletData(publicKey);
    } catch (error) {
      setError(error.message || "Failed to connect wallet");
    }
  };

  // Fetch wallet data from Helius RPC
  const fetchWalletData = async (address) => {
    setIsLoading(true);
    
    try {
      // Fetch SOL balance
      const solBalance = await getSolBalance(address);
      
      // Fetch token balances
      const tokenBalances = await getTokenBalances(address);
      
      // Fetch NFTs
      const nftList = await getNFTs(address);
      
      // Fetch transaction history
      const txHistory = await getTransactionHistory(address);
      
      // Analyze program interactions
      const programs = analyzeProgramInteractions(txHistory);
      
      // Calculate wallet stats
      const stats = {
        totalValueUSD: calculateTotalValue(solBalance, tokenBalances),
        solBalance,
        tokenCount: tokenBalances.length,
        nftCount: nftList.length,
        transactionCount: txHistory.length,
        programInteractions: programs.length,
        portfolioChange24h: calculatePortfolioChange(tokenBalances)
      };
      
      // Update state
      setWalletStats(stats);
      setTokens(tokenBalances);
      setNFTs(nftList);
      setTransactions(txHistory);
      setProgramInteractions(programs);
      setRecentActivity(txHistory.slice(0, 10));
    } catch (error) {
      setError("Failed to fetch wallet data");
    } finally {
      setIsLoading(false);
    }
  };

  // Implement the rest of the functionality:
  // - getSolBalance()
  // - getTokenBalances()
  // - getNFTs()
  // - getTransactionHistory()
  // - analyzeProgramInteractions()
  // - calculateTotalValue()
  // - calculatePortfolioChange()
  // - formatCurrency()
  // - formatNumber()
  // - formatDate()
  // - truncateAddress()
  // - copyToClipboard()

  // Render the dashboard with all components
  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">Solana Wallet Dashboard</h1>
          <p className="text-gray-400 text-lg">Complete portfolio overview powered by Helius RPC</p>
        </div>

        {/* Wallet Address & Refresh Button */}
        <div className="flex justify-center mb-8 gap-4">
          <Button variant="outline" onClick={refreshData} className="border-gray-800 bg-gray-900/50 text-gray-300">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <div className="flex items-center gap-3 bg-gray-900/50 rounded-xl px-4 py-2 border border-gray-800">
            <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
            <span className="text-sm text-white font-mono">{truncateAddress(walletAddress)}</span>
            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(walletAddress)} className="h-6 w-6 p-0">
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {/* Portfolio Value Card */}
          <Card className="bg-black border border-gray-800 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-gray-300 font-medium">Total Portfolio Value</span>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{formatCurrency(walletStats.totalValueUSD)}</div>
              <div className="flex items-center gap-2 text-sm text-emerald-400">
                <TrendingUp className="w-4 h-4" />
                {formatCurrency(walletStats.portfolioChange24h)} (24h)
              </div>
            </CardContent>
          </Card>
          
          {/* Additional stat cards... */}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid grid-cols-6 bg-gray-900/50 border border-gray-800 p-1 rounded-xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="nfts">NFTs</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          
          {/* Tab content for each section... */}
        </Tabs>
      </div>
    </div>
  );
}`}</code>
              </pre>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Mobile view toggle */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview" onClick={() => setViewMode("preview")}>
              Preview
            </TabsTrigger>
            <TabsTrigger value="code" onClick={() => setViewMode("code")}>
              <Code className="h-4 w-4 mr-2" />
              Code
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}
