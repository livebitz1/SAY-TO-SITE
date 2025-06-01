"use client"

import { createContext, useContext, type ReactNode, useState, useEffect, useMemo } from "react"
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
  useWallet as useSolanaWallet,
} from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js"

// Import wallet adapter styles
import "@solana/wallet-adapter-react-ui/styles.css"

// Create a context for wallet state with balance
interface WalletContextState {
  connected: boolean
  connecting: boolean
  publicKey: string | null
  balance: number | null
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  select: (walletName: string) => void
}

const WalletContext = createContext<WalletContextState>({
  connected: false,
  connecting: false,
  publicKey: null,
  balance: null,
  connect: async () => {},
  disconnect: async () => {},
  select: () => {},
})

export const useWallet = () => useContext(WalletContext)

// Inner component that uses the Solana wallet hooks
function WalletContextProvider({ children }: { children: ReactNode }) {
  const { publicKey, connected, connecting, disconnect, select, connect } = useSolanaWallet()
  const [balance, setBalance] = useState<number | null>(null)

  // Helius RPC endpoint
  const connection = useMemo(
    () => new Connection("https://mainnet.helius-rpc.com/?api-key=bc153566-8ac2-4019-9c90-e0ef5b840c07"),
    [],
  )

  // Fetch balance when wallet connects or changes
  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey && connected) {
        try {
          const balance = await connection.getBalance(publicKey)
          setBalance(balance / LAMPORTS_PER_SOL)
        } catch (error) {
          console.error("Error fetching balance:", error)
          setBalance(null)
        }
      } else {
        setBalance(null)
      }
    }

    fetchBalance()

    // Set up subscription for balance changes
    let subscriptionId: number | null = null

    if (publicKey && connected) {
      subscriptionId = connection.onAccountChange(
        publicKey,
        (accountInfo) => {
          setBalance(accountInfo.lamports / LAMPORTS_PER_SOL)
        },
        "confirmed",
      )
    }

    return () => {
      if (subscriptionId !== null) {
        connection.removeAccountChangeListener(subscriptionId)
      }
    }
  }, [publicKey, connected, connection])

  const contextValue: WalletContextState = {
    connected,
    connecting,
    publicKey: publicKey?.toBase58() || null,
    balance,
    connect: async () => {
      if (!connected) {
        try {
          await connect()
        } catch (error) {
          console.error("Error connecting wallet:", error)
        }
      }
    },
    disconnect: async () => {
      await disconnect()
      setBalance(null)
    },
    select: (walletName: string) => {
      select(walletName as any)
    },
  }

  return <WalletContext.Provider value={contextValue}>{children}</WalletContext.Provider>
}

export function WalletProvider({ children }: { children: ReactNode }) {
  // Use mainnet
  const network = WalletAdapterNetwork.Mainnet
  const endpoint = "https://mainnet.helius-rpc.com/?api-key=bc153566-8ac2-4019-9c90-e0ef5b840c07"

  // Initialize wallet adapters
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletContextProvider>{children}</WalletContextProvider>
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  )
}
