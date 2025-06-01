"use client"

import { ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

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

interface TransactionListProps {
  transactions: Transaction[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  filterType: string
  setFilterType: (type: string) => void
  formatDate: (timestamp: number) => string
  formatNumber: (num: number, decimals?: number) => string
  truncateAddress: (address: string) => string
}

export function TransactionList({
  transactions,
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  formatDate,
  formatNumber,
  truncateAddress,
}: TransactionListProps) {
  const filteredTransactions = transactions.filter((tx) => {
    if (filterType === "all") return true
    return tx.type.toLowerCase().includes(filterType.toLowerCase())
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-black border-[#d4af37]/30 text-white placeholder:text-gray-500"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48 bg-black border-[#d4af37]/30 text-white">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent className="bg-black border-[#d4af37]/30">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="transfer">Transfers</SelectItem>
            <SelectItem value="swap">Swaps</SelectItem>
            <SelectItem value="mint">Mints</SelectItem>
            <SelectItem value="burn">Burns</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-black border border-[#d4af37]/30 shadow-xl">
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="space-y-2 p-6">
              {filteredTransactions.map((tx, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-black rounded-xl border border-[#d4af37]/20 hover:border-[#d4af37]/40 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-3 h-3 rounded-full ${tx.status === "Success" ? "bg-[#d4af37]" : "bg-[#d4af37]/50"}`}
                    ></div>
                    <div>
                      <div className="text-white font-medium">{tx.type}</div>
                      <div className="text-gray-400 text-sm">{tx.description}</div>
                      <div className="text-[#d4af37]/70 text-xs font-mono">{truncateAddress(tx.signature)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-300">{formatDate(tx.blockTime)}</div>
                    {tx.amount > 0 && <div className="text-[#d4af37] text-sm">{formatNumber(tx.amount)}</div>}
                    <div className="text-gray-500 text-xs">Fee: {tx.fee.toFixed(6)} SOL</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`https://solscan.io/tx/${tx.signature}`, "_blank")}
                    className="text-[#d4af37] hover:text-white hover:bg-[#d4af37]/10"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
