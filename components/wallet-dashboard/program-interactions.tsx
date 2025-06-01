"use client"

import { ChevronDown, ChevronRight, Copy } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ProgramInteraction {
  program: string
  programName: string
  transactionCount: number
  firstInteraction: Date
  lastInteraction: Date
  totalVolume?: number
  description?: string
}

interface ProgramInteractionsProps {
  programInteractions: ProgramInteraction[]
  expandedPrograms: Set<string>
  setExpandedPrograms: (value: Set<string>) => void
  formatNumber: (num: number, decimals?: number) => string
  copyToClipboard: (text: string) => Promise<void>
}

export function ProgramInteractions({
  programInteractions,
  expandedPrograms,
  setExpandedPrograms,
  formatNumber,
  copyToClipboard,
}: ProgramInteractionsProps) {
  return (
    <Card className="bg-black border border-[#d4af37]/30 shadow-xl">
      <CardHeader className="border-b border-[#d4af37]/20">
        <CardTitle className="text-white">Program Interactions</CardTitle>
        <CardDescription className="text-gray-400">Smart contracts and programs you've interacted with</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {programInteractions.map((program, index) => (
            <div
              key={index}
              className="p-6 bg-black rounded-xl border border-[#d4af37]/20 hover:border-[#d4af37]/40 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-white font-semibold text-lg">{program.programName}</div>
                  <div className="text-gray-400 text-sm">{program.description}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setExpandedPrograms((prev) => {
                      const newSet = new Set(prev)
                      if (newSet.has(program.program)) {
                        newSet.delete(program.program)
                      } else {
                        newSet.add(program.program)
                      }
                      return newSet
                    })
                  }
                  className="text-[#d4af37] hover:text-white hover:bg-[#d4af37]/10"
                >
                  {expandedPrograms.has(program.program) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-gray-400 text-xs">Transactions</div>
                  <div className="text-white font-medium">{program.transactionCount}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">First Interaction</div>
                  <div className="text-white text-sm">{program.firstInteraction.toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Last Interaction</div>
                  <div className="text-white text-sm">{program.lastInteraction.toLocaleDateString()}</div>
                </div>
                {program.totalVolume && (
                  <div>
                    <div className="text-gray-400 text-xs">Total Volume</div>
                    <div className="text-white font-medium">{formatNumber(program.totalVolume)}</div>
                  </div>
                )}
              </div>

              {expandedPrograms.has(program.program) && (
                <div className="mt-4 p-4 bg-black rounded-lg border border-[#d4af37]/20">
                  <div className="text-gray-300 text-xs mb-2">Program ID</div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-gray-400 font-mono bg-black px-3 py-2 rounded border border-[#d4af37]/20">
                      {program.program}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(program.program)}
                      className="h-8 w-8 p-0 text-[#d4af37] hover:text-white hover:bg-[#d4af37]/10"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
