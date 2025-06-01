import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function DashboardLoadingState() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <Card className="max-w-md w-full bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl">
        <CardContent className="text-center py-16">
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Loading Dashboard</h3>
          <p className="text-gray-400">Fetching your wallet data from the Solana blockchain...</p>
        </CardContent>
      </Card>
    </div>
  )
}
