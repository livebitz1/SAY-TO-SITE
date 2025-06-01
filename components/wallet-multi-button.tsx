"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, ChevronDown, Check, Copy, ExternalLink, LogOut, Loader2 } from "lucide-react"
import { useWallet } from "./wallet-provider"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function WalletMultiButton() {
  const { connected, connecting, publicKey, balance, disconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (address: string | null) => {
    if (!address) return ""
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  const formatBalance = (balance: number | null) => {
    if (balance === null) return "0"
    return balance.toFixed(4)
  }

  const handleConnect = () => {
    setVisible(true)
  }

  if (!connected) {
    return (
      <Button onClick={handleConnect} className="bg-[#d4af37] hover:bg-[#b8860b] text-black" disabled={connecting}>
        {connecting ? (
          <span className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </span>
        ) : (
          <span className="flex items-center">
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </span>
        )}
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-[#d4af37] bg-black/40 hover:bg-black/60">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-[#d4af37]" />
            <div className="flex flex-col items-start">
              <span className="text-xs text-gray-400">Balance</span>
              <span className="text-sm font-medium">{formatBalance(balance)} SOL</span>
            </div>
            <div className="ml-2 border-l border-[#d4af37]/30 pl-2">
              <span className="text-sm">{formatAddress(publicKey)}</span>
            </div>
            <ChevronDown className="ml-2 h-4 w-4" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-black border-[#d4af37]/30 text-white">
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">Wallet Address</span>
            <span className="text-xs text-[#d4af37]">Mainnet</span>
          </div>
          <div className="font-mono text-sm bg-black rounded px-2 py-1 break-all border border-[#d4af37]/20">
            {publicKey}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-gray-400">Balance</span>
            <span className="font-medium">{formatBalance(balance)} SOL</span>
          </div>
        </div>
        <DropdownMenuSeparator className="bg-[#d4af37]/20" />
        <DropdownMenuItem className="focus:bg-[#d4af37]/10 focus:text-white cursor-pointer" onClick={copyAddress}>
          {copied ? <Check className="mr-2 h-4 w-4 text-[#d4af37]" /> : <Copy className="mr-2 h-4 w-4" />}
          {copied ? "Copied!" : "Copy address"}
        </DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-[#d4af37]/10 focus:text-white cursor-pointer" asChild>
          <a
            href={`https://solscan.io/account/${publicKey}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View on Solscan
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[#d4af37]/20" />
        <DropdownMenuItem
          className="focus:bg-[#d4af37]/10 focus:text-white cursor-pointer text-[#d4af37] focus:text-[#d4af37]"
          onClick={disconnect}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
