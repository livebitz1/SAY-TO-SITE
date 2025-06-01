"use client"

import { Copy, ExternalLink, ImageIcon } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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

interface NFTDetailModalProps {
  selectedNFT: NFT | null
  setSelectedNFT: (nft: NFT | null) => void
  copyToClipboard: (text: string) => Promise<void>
}

export function NFTDetailModal({ selectedNFT, setSelectedNFT, copyToClipboard }: NFTDetailModalProps) {
  return (
    <Dialog open={!!selectedNFT} onOpenChange={() => setSelectedNFT(null)}>
      <DialogContent className="bg-black border border-[#d4af37]/30 max-w-2xl shadow-2xl">
        {selectedNFT && (
          <>
            <DialogHeader>
              <DialogTitle className="text-white text-xl">{selectedNFT.name}</DialogTitle>
              <DialogDescription className="text-gray-400">
                {selectedNFT.collection?.name || "NFT Details"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-square bg-black rounded-xl overflow-hidden border border-[#d4af37]/20">
                {selectedNFT.image ? (
                  <img
                    src={selectedNFT.image || "/placeholder.svg"}
                    alt={selectedNFT.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-[#d4af37]/50" />
                  </div>
                )}
              </div>
              <div className="space-y-4">
                {selectedNFT.collection && (
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Collection</div>
                    <div className="flex items-center gap-2">
                      <span className="text-white">{selectedNFT.collection.name}</span>
                      {selectedNFT.collection.verified && (
                        <Badge className="bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/20">Verified</Badge>
                      )}
                    </div>
                  </div>
                )}
                {selectedNFT.compressed && (
                  <div>
                    <Badge className="bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/20">Compressed NFT</Badge>
                  </div>
                )}
                {selectedNFT.attributes && selectedNFT.attributes.length > 0 && (
                  <div>
                    <div className="text-gray-400 text-sm mb-2">Attributes</div>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedNFT.attributes.slice(0, 6).map((attr, index) => (
                        <div key={index} className="p-3 bg-black/50 rounded-lg text-center border border-[#d4af37]/20">
                          <div className="text-gray-400 text-xs">{attr.trait_type}</div>
                          <div className="text-white text-sm">{attr.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(selectedNFT.mint)}
                    className="border-[#d4af37]/30 bg-black text-gray-300 hover:bg-[#d4af37]/10 hover:text-white"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy Address
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`https://solscan.io/token/${selectedNFT.mint}`, "_blank")}
                    className="border-[#d4af37]/30 bg-black text-gray-300 hover:bg-[#d4af37]/10 hover:text-white"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View on Solscan
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
