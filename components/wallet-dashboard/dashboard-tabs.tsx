"use client"

import { BarChart3, Coins, ImageIcon, History, Settings, Bell, Activity } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatsOverview } from "./stats-overview"
import { TokenList } from "./token-list"
import { NFTGrid } from "./nft-grid"
import { TransactionList } from "./transaction-list"
import { ProgramInteractions } from "./program-interactions"
import { ActivityFeed } from "./activity-feed"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface DashboardTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  walletStats: any
  tokens: any[]
  nfts: any[]
  transactions: any[]
  programInteractions: any[]
  recentActivity: any[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  filterType: string
  setFilterType: (type: string) => void
  expandedPrograms: Set<string>
  setExpandedPrograms: (programs: Set<string>) => void
  setSelectedNFT: (nft: any | null) => void
  formatCurrency: (amount: number) => string
  formatNumber: (num: number, decimals?: number) => string
  formatDate: (timestamp: number) => string
  truncateAddress: (address: string) => string
  copyToClipboard: (text: string) => Promise<void>
}

export function DashboardTabs({
  activeTab,
  setActiveTab,
  walletStats,
  tokens,
  nfts,
  transactions,
  programInteractions,
  recentActivity,
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  expandedPrograms,
  setExpandedPrograms,
  setSelectedNFT,
  formatCurrency,
  formatNumber,
  formatDate,
  truncateAddress,
  copyToClipboard,
}: DashboardTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
      <TabsList className="grid w-full grid-cols-6 bg-black border border-[#d4af37]/20 p-1 rounded-xl">
        <TabsTrigger
          value="overview"
          className="data-[state=active]:bg-[#d4af37]/10 data-[state=active]:text-[#d4af37] text-gray-400 transition-all duration-300 flex items-center gap-2"
        >
          <BarChart3 className="w-4 h-4" />
          Overview
        </TabsTrigger>
        <TabsTrigger
          value="tokens"
          className="data-[state=active]:bg-[#d4af37]/10 data-[state=active]:text-[#d4af37] text-gray-400 transition-all duration-300 flex items-center gap-2"
        >
          <Coins className="w-4 h-4" />
          Tokens
        </TabsTrigger>
        <TabsTrigger
          value="nfts"
          className="data-[state=active]:bg-[#d4af37]/10 data-[state=active]:text-[#d4af37] text-gray-400 transition-all duration-300 flex items-center gap-2"
        >
          <ImageIcon className="w-4 h-4" />
          NFTs
        </TabsTrigger>
        <TabsTrigger
          value="transactions"
          className="data-[state=active]:bg-[#d4af37]/10 data-[state=active]:text-[#d4af37] text-gray-400 transition-all duration-300 flex items-center gap-2"
        >
          <History className="w-4 h-4" />
          Transactions
        </TabsTrigger>
        <TabsTrigger
          value="programs"
          className="data-[state=active]:bg-[#d4af37]/10 data-[state=active]:text-[#d4af37] text-gray-400 transition-all duration-300 flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Programs
        </TabsTrigger>
        <TabsTrigger
          value="activity"
          className="data-[state=active]:bg-[#d4af37]/10 data-[state=active]:text-[#d4af37] text-gray-400 transition-all duration-300 flex items-center gap-2"
        >
          <Bell className="w-4 h-4" />
          Activity
        </TabsTrigger>
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-6">
        <StatsOverview walletStats={walletStats} formatCurrency={formatCurrency} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="bg-black border border-[#d4af37]/30 shadow-xl">
            <CardHeader className="border-b border-[#d4af37]/20">
              <CardTitle className="text-white flex items-center gap-3">
                <div className="p-2 bg-[#d4af37]/10 rounded-lg">
                  <Activity className="w-5 h-5 text-[#d4af37]" />
                </div>
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentActivity.slice(0, 5).map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-black rounded-xl border border-[#d4af37]/20 hover:border-[#d4af37]/40 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          activity.status === "Success" ? "bg-[#d4af37]" : "bg-[#d4af37]"
                        }`}
                      ></div>
                      <div>
                        <div className="text-white text-sm font-medium">{activity.type}</div>
                        <div className="text-gray-400 text-xs">{activity.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-300 text-sm">{formatDate(activity.blockTime)}</div>
                      {activity.amount > 0 && (
                        <div className="text-[#d4af37] text-xs">{formatNumber(activity.amount)}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Tokens */}
          <Card className="bg-black border border-[#d4af37]/30 shadow-xl">
            <CardHeader className="border-b border-[#d4af37]/20">
              <CardTitle className="text-white flex items-center gap-3">
                <div className="p-2 bg-[#d4af37]/10 rounded-lg">
                  <Coins className="w-5 h-5 text-[#d4af37]" />
                </div>
                Top Token Holdings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {tokens.slice(0, 5).map((token, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-black rounded-xl border border-[#d4af37]/20 hover:border-[#d4af37]/40 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center border border-[#d4af37]/30">
                        {token.logoURI ? (
                          <img
                            src={token.logoURI || "/placeholder.svg"}
                            alt={token.symbol}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <Coins className="w-5 h-5 text-[#d4af37]" />
                        )}
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">{token.symbol}</div>
                        <div className="text-gray-400 text-xs">{token.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-sm">{formatNumber(token.balance || 0)}</div>
                      <div className="text-[#d4af37] text-xs">{formatCurrency(token.valueUSD || 0)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Program Interactions Overview */}
        <Card className="bg-black border border-[#d4af37]/30 shadow-xl">
          <CardHeader className="border-b border-[#d4af37]/20">
            <CardTitle className="text-white flex items-center gap-3">
              <div className="p-2 bg-[#d4af37]/10 rounded-lg">
                <Settings className="w-5 h-5 text-[#d4af37]" />
              </div>
              Program Interactions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {programInteractions.slice(0, 4).map((program, index) => (
                <div
                  key={index}
                  className="p-6 bg-black rounded-xl border border-[#d4af37]/20 hover:border-[#d4af37]/40 transition-all duration-300"
                >
                  <div className="text-white font-medium mb-2">{program.programName}</div>
                  <div className="text-gray-400 text-sm mb-4">{program.description}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-gray-300 text-sm">{program.transactionCount} txs</div>
                    {program.totalVolume && (
                      <div className="text-[#d4af37] text-xs">{formatNumber(program.totalVolume)}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Tokens Tab */}
      <TabsContent value="tokens" className="space-y-6">
        <TokenList
          tokens={tokens}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          formatCurrency={formatCurrency}
          formatNumber={formatNumber}
          copyToClipboard={copyToClipboard}
        />
      </TabsContent>

      {/* NFTs Tab */}
      <TabsContent value="nfts" className="space-y-6">
        <NFTGrid
          nfts={nfts}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setSelectedNFT={setSelectedNFT}
        />
      </TabsContent>

      {/* Transactions Tab */}
      <TabsContent value="transactions" className="space-y-6">
        <TransactionList
          transactions={transactions}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterType={filterType}
          setFilterType={setFilterType}
          formatDate={formatDate}
          formatNumber={formatNumber}
          truncateAddress={truncateAddress}
        />
      </TabsContent>

      {/* Programs Tab */}
      <TabsContent value="programs" className="space-y-6">
        <ProgramInteractions
          programInteractions={programInteractions}
          expandedPrograms={expandedPrograms}
          setExpandedPrograms={setExpandedPrograms}
          formatNumber={formatNumber}
          copyToClipboard={copyToClipboard}
        />
      </TabsContent>

      {/* Activity Tab */}
      <TabsContent value="activity" className="space-y-6">
        <ActivityFeed recentActivity={recentActivity} formatDate={formatDate} truncateAddress={truncateAddress} />
      </TabsContent>
    </Tabs>
  )
}
