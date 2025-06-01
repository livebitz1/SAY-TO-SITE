import { ArrowUpRight, Zap, Gift, ShoppingCart, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

interface ActivityFeedProps {
  recentActivity: Transaction[]
  formatDate: (timestamp: number) => string
  truncateAddress: (address: string) => string
}

export function ActivityFeed({ recentActivity, formatDate, truncateAddress }: ActivityFeedProps) {
  return (
    <Card className="bg-black border border-gray-800 shadow-xl">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="text-white flex items-center gap-3">
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-orange-400"
            >
              <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3Z" />
              <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
            </svg>
          </div>
          Live Activity Feed
        </CardTitle>
        <CardDescription className="text-gray-400">Real-time wallet activity and transaction history</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <ScrollArea className="h-[500px]">
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-gray-900/30 rounded-xl border border-gray-800 hover:bg-gray-900/50 transition-all duration-300"
              >
                <div className="flex-shrink-0 mt-1 p-2 bg-gray-900 rounded-lg">
                  {activity.type.includes("Transfer") ? (
                    <ArrowUpRight className="w-5 h-5 text-blue-400" />
                  ) : activity.type.includes("Swap") ? (
                    <Zap className="w-5 h-5 text-purple-400" />
                  ) : activity.type.includes("Mint") ? (
                    <Gift className="w-5 h-5 text-green-400" />
                  ) : activity.type.includes("Purchase") ? (
                    <ShoppingCart className="w-5 h-5 text-orange-400" />
                  ) : (
                    <Activity className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{activity.type}</span>
                    <span className="text-gray-400 text-sm">{formatDate(activity.blockTime)}</span>
                  </div>
                  <div className="text-gray-400 text-sm mb-3">{activity.description}</div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Signature: {truncateAddress(activity.signature)}</span>
                    <span>Fee: {activity.fee.toFixed(6)} SOL</span>
                    <Badge
                      variant={activity.status === "Success" ? "default" : "destructive"}
                      className="text-xs bg-gray-900 border-gray-800"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
