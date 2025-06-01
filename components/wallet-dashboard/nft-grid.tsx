"use client"

import { ImageIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

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

interface NFTGridProps {
  nfts: NFT[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  setSelectedNFT: (nft: NFT | null) => void
}

export function NFTGrid({ nfts, searchQuery, setSearchQuery, setSelectedNFT }: NFTGridProps) {
  const filteredNFTs = nfts.filter(
    (nft) =>
      nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.collection?.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search NFTs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-black border-[#d4af37]/30 text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filteredNFTs.map((nft, index) => (
          <Card
            key={index}
            className="bg-black border border-[#d4af37]/30 hover:border-[#d4af37] transition-all duration-300 cursor-pointer shadow-xl group"
            onClick={() => setSelectedNFT(nft)}
          >
            <CardContent className="p-4">
              <div className="aspect-square bg-black rounded-xl mb-3 overflow-hidden border border-[#d4af37]/20 group-hover:border-[#d4af37]/50 transition-all duration-300">
                {nft.image ? (
                  <img
                    src={nft.image || "/placeholder.svg"}
                    alt={nft.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-[#d4af37]/50" />
                  </div>
                )}
              </div>
              <div>
                <div className="text-white text-sm font-medium truncate">{nft.name}</div>
                {nft.collection && <div className="text-gray-400 text-xs truncate">{nft.collection.name}</div>}
                {nft.compressed && (
                  <Badge className="mt-2 bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/20 text-xs">Compressed</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
