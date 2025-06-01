import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { WalletProvider } from "@/components/wallet-provider"
import { Toaster } from "@/components/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Say-to-Site - Build websites with AI",
  description: "Prompt, run, edit, and deploy Web2 and Web3 websites with AI.",
  openGraph: {
    title: "Say-to-Site - Build websites with AI",
    description: "Prompt, run, edit, and deploy Web2 and Web3 websites with AI.",
    images: [
      {
        url: "/images/new-logo.png", // Updated
        width: 800,
        height: 800,
        alt: "Say-to-Site New Logo", // Updated
      },
    ],
    type: "website",
    siteName: "Say-to-Site",
  },
  twitter: {
    card: "summary_large_image",
    title: "Say-to-Site - Build websites with AI",
    description: "Prompt, run, edit, and deploy Web2 and Web3 websites with AI.",
    images: ["/images/new-logo.png"],
    creator: "@say-to-site",
  },
  icons: {
    icon: "/images/new-logo.png",
    shortcut: "/images/new-logo.png",
    apple: "/images/new-logo.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <WalletProvider>
            {children}
            <Toaster />
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
