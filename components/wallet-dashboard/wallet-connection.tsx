"use client"
import { Wallet, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface WalletConnectionProps {
  wallet: any
  isLoading: boolean
  error: string
  connectWallet: () => Promise<void>
}

export function WalletConnection({ wallet, isLoading, error, connectWallet }: WalletConnectionProps) {
  if (!wallet) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <Card className="max-w-md w-full bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl">
          <CardContent className="text-center py-16">
            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Wallet className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Phantom Wallet Required</h3>
            <p className="text-gray-400 mb-6">Please install Phantom wallet to access your Solana dashboard</p>
            <Button
              onClick={() => window.open("https://phantom.app/", "_blank")}
              className="bg-white/10 hover:bg-white/20 text-white shadow-lg border border-white/20"
            >
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
                className="w-4 h-4 mr-2"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Install Phantom
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <Card className="max-w-lg w-full bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl">
        <CardContent className="text-center py-16">
          <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Wallet className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
            Connect your Phantom wallet to access your complete Solana portfolio dashboard with real-time data
          </p>
          <Button
            onClick={connectWallet}
            disabled={isLoading}
            className="h-14 px-10 bg-white/10 hover:bg-white/20 text-white font-semibold text-lg shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5 mr-3" />
                Connect Phantom Wallet
              </>
            )}
          </Button>
          {error && (
            <Alert className="mt-6 bg-red-950/50 border-red-500/30 backdrop-blur-sm">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-200">{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
