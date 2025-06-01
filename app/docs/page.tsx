"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Code, Zap, Users, Sparkles, ArrowRight, Copy, Check, Github, Twitter } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("introduction")
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const scrollToSection = (id: string) => {
    setActiveSection(id)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 backdrop-blur-lg bg-black/80">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/say2site-logo-white.png"
                alt="Say2Site Logo"
                width={36}
                height={36}
                className="rounded-full"
              />
              <span className="font-bold text-xl">Say2Site</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/docs" className="text-sm font-medium text-white hover:text-white/90 transition-colors">
              Documentation
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/" className="hidden md:block">
              <Button variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10 text-white">
                Try Say2Site
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)] md:gap-6 lg:gap-10 py-8">
        {/* Sidebar */}
        <aside className="fixed top-20 z-30 hidden h-[calc(100vh-5rem)] w-full shrink-0 md:sticky md:block">
          <ScrollArea className="h-full py-6 pr-6">
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-sm text-white/50 mb-1">Getting Started</div>
              <button
                onClick={() => scrollToSection("introduction")}
                className={`flex items-center text-sm px-3 py-1.5 rounded-md transition-colors ${activeSection === "introduction" ? "bg-white/10 text-white" : "text-white/70 hover:text-white hover:bg-white/5"}`}
              >
                Introduction
              </button>
              <button
                onClick={() => scrollToSection("key-features")}
                className={`flex items-center text-sm px-3 py-1.5 rounded-md transition-colors ${activeSection === "key-features" ? "bg-white/10 text-white" : "text-white/70 hover:text-white hover:bg-white/5"}`}
              >
                Key Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className={`flex items-center text-sm px-3 py-1.5 rounded-md transition-colors ${activeSection === "how-it-works" ? "bg-white/10 text-white" : "text-white/70 hover:text-white hover:bg-white/5"}`}
              >
                How It Works
              </button>

              <div className="font-semibold text-sm text-white/50 mt-6 mb-1">Platforms</div>
              <button
                onClick={() => scrollToSection("web3-platform")}
                className={`flex items-center text-sm px-3 py-1.5 rounded-md transition-colors ${activeSection === "web3-platform" ? "bg-white/10 text-white" : "text-white/70 hover:text-white hover:bg-white/5"}`}
              >
                Web3 Platform
              </button>
              <button
                onClick={() => scrollToSection("web2-platform")}
                className={`flex items-center text-sm px-3 py-1.5 rounded-md transition-colors ${activeSection === "web2-platform" ? "bg-white/10 text-white" : "text-white/70 hover:text-white hover:bg-white/5"}`}
              >
                Web2 Platform
              </button>

              <div className="font-semibold text-sm text-white/50 mt-6 mb-1">Use Cases</div>
              <button
                onClick={() => scrollToSection("for-developers")}
                className={`flex items-center text-sm px-3 py-1.5 rounded-md transition-colors ${activeSection === "for-developers" ? "bg-white/10 text-white" : "text-white/70 hover:text-white hover:bg-white/5"}`}
              >
                For Developers
              </button>
              <button
                onClick={() => scrollToSection("for-designers")}
                className={`flex items-center text-sm px-3 py-1.5 rounded-md transition-colors ${activeSection === "for-designers" ? "bg-white/10 text-white" : "text-white/70 hover:text-white hover:bg-white/5"}`}
              >
                For Designers
              </button>
              <button
                onClick={() => scrollToSection("for-businesses")}
                className={`flex items-center text-sm px-3 py-1.5 rounded-md transition-colors ${activeSection === "for-businesses" ? "bg-white/10 text-white" : "text-white/70 hover:text-white hover:bg-white/5"}`}
              >
                For Businesses
              </button>

              <div className="font-semibold text-sm text-white/50 mt-6 mb-1">Resources</div>
              <button
                onClick={() => scrollToSection("prompt-guide")}
                className={`flex items-center text-sm px-3 py-1.5 rounded-md transition-colors ${activeSection === "prompt-guide" ? "bg-white/10 text-white" : "text-white/70 hover:text-white hover:bg-white/5"}`}
              >
                Prompt Guide
              </button>
              <button
                onClick={() => scrollToSection("website-enhancement")}
                className={`flex items-center text-sm px-3 py-1.5 rounded-md transition-colors ${activeSection === "website-enhancement" ? "bg-white/10 text-white" : "text-white/70 hover:text-white hover:bg-white/5"}`}
              >
                Website Enhancement
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className={`flex items-center text-sm px-3 py-1.5 rounded-md transition-colors ${activeSection === "faq" ? "bg-white/10 text-white" : "text-white/70 hover:text-white hover:bg-white/5"}`}
              >
                FAQ
              </button>
            </div>
          </ScrollArea>
        </aside>

        {/* Main content */}
        <main className="relative lg:gap-10 pb-20">
          <div className="mx-auto w-full min-w-0">
            {/* Introduction */}
            <section id="introduction" className="mb-16 scroll-mt-16">
              <h1 className="font-bold text-3xl md:text-4xl mb-4">Say2Site Documentation</h1>
              <p className="text-white/70 text-lg mb-6">
                The complete guide to using Say2Site for Web2 and Web3 development
              </p>

              <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 mb-8">
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 rounded-full bg-white/10">
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Transform your ideas into websites with AI</h3>
                    <p className="text-white/70 mb-4">
                      Say2Site is a revolutionary platform that converts natural language prompts into fully functional
                      websites and dApps. Simply describe what you want, use our suggestion buttons, or enhance existing
                      websites, and our AI will generate the code and preview instantly.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link href="/">
                        <Button className="bg-white text-black hover:bg-white/90">
                          Try Say2Site
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
                        onClick={() => scrollToSection("how-it-works")}
                      >
                        Learn how it works
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="font-semibold text-2xl mb-4">What is Say2Site?</h2>
              <p className="text-white/80 mb-4">
                Say2Site is an AI-powered platform that bridges the gap between ideas and implementation. It allows
                users to create websites and decentralized applications (dApps) using simple natural language prompts or
                quick suggestion buttons. Whether you're building for Web2 or Web3, Say2Site provides an intuitive
                interface to transform your concepts into functional code with proper styling and responsive design.
              </p>
              <p className="text-white/80 mb-4">
                Our platform combines the power of large language models with specialized knowledge of web development
                and blockchain technologies to generate high-quality, production-ready code that follows best practices.
                We also provide tools to enhance existing websites with targeted improvements rather than starting from
                scratch.
              </p>
            </section>

            {/* Key Features */}
            <section id="key-features" className="mb-16 scroll-mt-16">
              <h2 className="font-semibold text-2xl mb-6">Key Features</h2>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="p-2 w-fit rounded-lg bg-white/10 mb-4">
                    <Zap className="w-5 h-5 text-yellow-300" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Dual Platform Support</h3>
                  <p className="text-white/70">
                    Seamlessly switch between Web2 and Web3 development environments with a simple toggle. Build
                    traditional websites or blockchain-powered dApps with the same intuitive interface.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="p-2 w-fit rounded-lg bg-white/10 mb-4">
                    <Code className="w-5 h-5 text-yellow-300" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Instant Code Generation</h3>
                  <p className="text-white/70">
                    Get production-ready code in seconds. Say2Site generates clean, well-structured code with proper CSS
                    styling that follows modern development practices and is ready for deployment.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="p-2 w-fit rounded-lg bg-white/10 mb-4">
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Quick Suggestion Buttons</h3>
                  <p className="text-white/70">
                    Not sure where to start? Use our suggestion buttons to instantly generate common website types like
                    e-commerce sites, contact forms, portfolios, and more without typing a single word.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="p-2 w-fit rounded-lg bg-white/10 mb-4">
                    <Users className="w-5 h-5 text-yellow-300" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Website Enhancement</h3>
                  <p className="text-white/70">
                    Already have a website? Our enhancement feature allows you to make targeted improvements to existing
                    websites without starting from scratch, preserving your content while upgrading specific elements.
                  </p>
                </div>
              </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="mb-16 scroll-mt-16">
              <h2 className="font-semibold text-2xl mb-6">How It Works</h2>

              <div className="space-y-8">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-white font-bold text-xl">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Describe Your Vision or Use Suggestions</h3>
                    <p className="text-white/80 mb-3">
                      Start by describing the website or dApp you want to create, or simply click one of our suggestion
                      buttons for common website types. Our AI can work with both detailed specifications and high-level
                      concepts.
                    </p>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-sm text-white/70 font-mono">
                        "Create a dashboard for tracking Solana tokens with a dark theme and responsive design"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-white font-bold text-xl">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Choose Your Platform</h3>
                    <p className="text-white/80 mb-3">
                      Toggle between Web3 and Web2 modes depending on your project needs. Web3 mode is optimized for
                      blockchain applications, while Web2 mode focuses on traditional web development with proper CSS
                      styling.
                    </p>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">Web3</div>
                        <div className="px-3 py-1 rounded-full bg-white/5 text-white/70 text-sm">Web2</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-white font-bold text-xl">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Generate and Preview</h3>
                    <p className="text-white/80 mb-3">
                      Click the generate button and watch as Say2Site transforms your prompt into functional code with
                      proper styling. You'll see a live preview of your website or dApp alongside the generated code.
                    </p>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="px-4 py-2 rounded-md bg-white text-black text-sm font-medium">Generate</div>
                        <span className="text-white/50">→</span>
                        <div className="text-white/70 text-sm">Code + Live Preview</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-white font-bold text-xl">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Customize and Deploy</h3>
                    <p className="text-white/80 mb-3">
                      Copy the generated code, make any desired modifications, and deploy your project. The code is
                      production-ready with proper CSS styling and follows best practices for performance and security.
                    </p>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1 rounded-md bg-white/10 text-white/80 text-sm">Copy Code</div>
                        <span className="text-white/50">→</span>
                        <div className="px-3 py-1 rounded-md bg-white/10 text-white/80 text-sm">Customize</div>
                        <span className="text-white/50">→</span>
                        <div className="px-3 py-1 rounded-md bg-white/10 text-white/80 text-sm">Deploy</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Web3 Platform */}
            <section id="web3-platform" className="mb-16 scroll-mt-16">
              <h2 className="font-semibold text-2xl mb-6">Web3 Platform</h2>

              <p className="text-white/80 mb-6">
                Say2Site's Web3 platform is specifically designed for blockchain development, with a focus on the Solana
                ecosystem. It enables developers to create decentralized applications with minimal effort, handling the
                complexities of blockchain integration automatically.
              </p>

              <div className="space-y-6 mb-8">
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-medium mb-3">Solana Integration</h3>
                  <p className="text-white/70 mb-4">
                    Say2Site provides seamless integration with the Solana blockchain, including:
                  </p>
                  <ul className="space-y-2 text-white/70">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                      <span>Wallet connection and management with Phantom and other popular wallets</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                      <span>Token tracking and management with real-time balance updates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                      <span>NFT display and interaction with metadata viewing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                      <span>Transaction history and analysis with detailed breakdowns</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                      <span>Token burning functionality for managing token supply</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-medium mb-3">Available Components</h3>
                  <p className="text-white/70 mb-4">
                    The Web3 platform includes a variety of pre-built components for common dApp functionalities:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-white/10 text-white/90 text-sm">Wallet Connect</div>
                    <div className="p-3 rounded-lg bg-white/10 text-white/90 text-sm">Token Tracker</div>
                    <div className="p-3 rounded-lg bg-white/10 text-white/90 text-sm">Wallet Analyzer</div>
                    <div className="p-3 rounded-lg bg-white/10 text-white/90 text-sm">PnL Checker</div>
                    <div className="p-3 rounded-lg bg-white/10 text-white/90 text-sm">Token Burner</div>
                    <div className="p-3 rounded-lg bg-white/10 text-white/90 text-sm">Wallet Dashboard</div>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-medium mb-3">Example Prompt</h3>
                  <p className="text-white/70 mb-4">Here's an example of a prompt for creating a Solana dApp:</p>
                  <div className="relative">
                    <pre className="p-4 rounded-lg bg-black/50 border border-white/10 text-white/80 font-mono text-sm overflow-x-auto">
                      {`Create a Solana NFT gallery that connects to a user's wallet, displays their NFTs in a grid layout, and allows them to view details about each NFT including metadata and transaction history. Include a dark theme with purple accents and make it responsive for mobile devices.`}
                    </pre>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `Create a Solana NFT gallery that connects to a user's wallet, displays their NFTs in a grid layout, and allows them to view details about each NFT including metadata and transaction history. Include a dark theme with purple accents and make it responsive for mobile devices.`,
                        )
                      }
                      className="absolute top-2 right-2 p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                      aria-label="Copy code"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4 text-white/70" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Web2 Platform */}
            <section id="web2-platform" className="mb-16 scroll-mt-16">
              <h2 className="font-semibold text-2xl mb-6">Web2 Platform</h2>

              <p className="text-white/80 mb-6">
                Say2Site's Web2 platform focuses on traditional web development, allowing users to create modern,
                responsive websites using the latest technologies and best practices. Our system ensures proper CSS
                styling is applied to all generated websites for a professional appearance.
              </p>

              <div className="space-y-6 mb-8">
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-medium mb-3">Technologies</h3>
                  <p className="text-white/70 mb-4">The Web2 platform generates code using modern web technologies:</p>
                  <ul className="space-y-2 text-white/70">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                      <span>HTML5 with semantic markup and proper structure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                      <span>CSS3 with modern styling techniques and responsive design</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                      <span>JavaScript for interactive elements and dynamic functionality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                      <span>Consistent color themes that match your website's design</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-medium mb-3">Features</h3>
                  <p className="text-white/70 mb-4">The Web2 platform includes support for:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-white/10 text-white/90 text-sm">Responsive Design</div>
                    <div className="p-3 rounded-lg bg-white/10 text-white/90 text-sm">Modern UI Components</div>
                    <div className="p-3 rounded-lg bg-white/10 text-white/90 text-sm">Form Handling</div>
                    <div className="p-3 rounded-lg bg-white/10 text-white/90 text-sm">E-commerce Functionality</div>
                    <div className="p-3 rounded-lg bg-white/10 text-white/90 text-sm">Portfolio Layouts</div>
                    <div className="p-3 rounded-lg bg-white/10 text-white/90 text-sm">Quick Suggestion Buttons</div>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-medium mb-3">Example Prompt</h3>
                  <p className="text-white/70 mb-4">Here's an example of a prompt for creating a Web2 website:</p>
                  <div className="relative">
                    <pre className="p-4 rounded-lg bg-black/50 border border-white/10 text-white/80 font-mono text-sm overflow-x-auto">
                      {`Create a modern e-commerce website with a product listing page, individual product details, shopping cart functionality, and checkout form. Include a dark theme with gold accents, responsive design for mobile devices, and proper CSS styling for all elements.`}
                    </pre>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `Create a modern e-commerce website with a product listing page, individual product details, shopping cart functionality, and checkout form. Include a dark theme with gold accents, responsive design for mobile devices, and proper CSS styling for all elements.`,
                        )
                      }
                      className="absolute top-2 right-2 p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                      aria-label="Copy code"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4 text-white/70" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* For Developers */}
            <section id="for-developers" className="mb-16 scroll-mt-16">
              <h2 className="font-semibold text-2xl mb-6">For Developers</h2>

              <p className="text-white/80 mb-6">
                Say2Site empowers developers by streamlining the development process, reducing boilerplate code, and
                providing a foundation for both Web2 and Web3 projects with properly styled components.
              </p>

              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-medium mb-3">Accelerate Development</h3>
                  <p className="text-white/70 mb-4">Say2Site helps developers:</p>
                  <ul className="space-y-3 text-white/70">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                      <span>Rapidly prototype ideas without writing boilerplate code or CSS</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                      <span>Learn best practices for Web3 development through generated code examples</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                      <span>Make targeted enhancements to existing websites without starting over</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                      <span>Generate common website types instantly with suggestion buttons</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* For Designers */}
            <section id="for-designers" className="mb-16 scroll-mt-16">
              <h2 className="font-semibold text-2xl mb-6">For Designers</h2>

              <p className="text-white/80 mb-6">
                Say2Site bridges the gap between design and implementation, allowing designers to quickly transform
                their concepts into functional prototypes with proper styling and responsive design.
              </p>

              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-medium mb-3">Design to Code</h3>
                  <p className="text-white/70 mb-4">Say2Site helps designers:</p>
                  <ul className="space-y-3 text-white/70">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                      <span>Convert design concepts into working prototypes with proper CSS styling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                      <span>Experiment with different UI implementations quickly using suggestion buttons</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                      <span>Create interactive demos for client presentations with consistent theming</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                      <span>Make targeted enhancements to existing designs without starting over</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* For Businesses */}
            <section id="for-businesses" className="mb-16 scroll-mt-16">
              <h2 className="font-semibold text-2xl mb-6">For Businesses</h2>

              <p className="text-white/80 mb-6">
                Say2Site helps businesses accelerate their digital transformation and blockchain adoption by reducing
                development time and costs while ensuring professional, properly styled results.
              </p>

              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-medium mb-3">Business Benefits</h3>
                  <p className="text-white/70 mb-4">Say2Site offers businesses:</p>
                  <ul className="space-y-3 text-white/70">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                      <span>Faster time-to-market with instant website generation and suggestion buttons</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                      <span>Reduced development costs through AI-assisted code generation with proper styling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                      <span>Easier entry into Web3 and blockchain technologies with Solana integration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                      <span>Ability to enhance existing websites with targeted improvements</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Prompt Guide */}
            <section id="prompt-guide" className="mb-16 scroll-mt-16">
              <h2 className="font-semibold text-2xl mb-6">Prompt Guide</h2>

              <p className="text-white/80 mb-6">
                Crafting effective prompts is key to getting the best results from Say2Site. Here are some tips and
                examples to help you create prompts that generate exactly what you need, or you can use our suggestion
                buttons for instant results.
              </p>

              <div className="space-y-6 mb-8">
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-medium mb-3">Prompt Structure</h3>
                  <p className="text-white/70 mb-4">Effective prompts typically include:</p>
                  <ul className="space-y-3 text-white/70">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-white">What to build:</span> The type of website or
                        application (e.g., landing page, dashboard, portfolio, e-commerce)
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-white">Purpose/functionality:</span> What the site should do
                        or what problem it solves
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-white">Design preferences:</span> Colors, themes, styles, or
                        references to existing designs
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-white">Specific features:</span> Any particular components or
                        functionality you need
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-medium mb-3">Suggestion Buttons</h3>
                  <p className="text-white/70 mb-4">
                    For quick results, use our suggestion buttons below the prompt input to instantly generate:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-white/10 text-white/90 text-sm">E-commerce Website</div>
                    <div className="p-3 rounded-lg bg-white/10 text-white/90 text-sm">Contact Form</div>
                    <div className="p-3 rounded-lg bg-white/10 text-white/90 text-sm">Portfolio Website</div>
                    <div className="p-3 rounded-lg bg-white/10 text-white/90 text-sm">Educational Platform</div>
                    <div className="p-3 rounded-lg bg-white/10 text-white/90 text-sm">Healthcare Website</div>
                    <div className="p-3 rounded-lg bg-white/10 text-white/90 text-sm">Photography Portfolio</div>
                    <div className="p-3 rounded-lg bg-white/10 text-white/90 text-sm">Blog Website</div>
                    <div className="p-3 rounded-lg bg-white/10 text-white/90 text-sm">Event Booking</div>
                  </div>
                </div>

                <Tabs defaultValue="web3" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-white/5 p-1 rounded-lg">
                    <TabsTrigger value="web3" className="data-[state=active]:bg-white/10">
                      Web3 Examples
                    </TabsTrigger>
                    <TabsTrigger value="web2" className="data-[state=active]:bg-white/10">
                      Web2 Examples
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="web3" className="mt-4 space-y-4">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <h4 className="font-medium mb-2">Basic dApp</h4>
                      <p className="text-white/70 text-sm mb-3">
                        "Create a simple Solana wallet connector that shows the user's SOL balance and token holdings
                        with proper styling."
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <h4 className="font-medium mb-2">Detailed NFT Gallery</h4>
                      <p className="text-white/70 text-sm mb-3">
                        "Build an NFT gallery for Solana with a masonry layout, filtering by collection, search
                        functionality, and a detailed view for each NFT showing metadata and attributes. Use a dark
                        theme with purple accents and make it responsive for mobile devices."
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <h4 className="font-medium mb-2">Token Dashboard</h4>
                      <p className="text-white/70 text-sm mb-3">
                        "Create a Solana token dashboard that shows price charts, market cap, volume, and recent
                        transactions. Include a dark mode toggle and responsive design for mobile devices with proper
                        CSS styling."
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="web2" className="mt-4 space-y-4">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <h4 className="font-medium mb-2">E-commerce Website</h4>
                      <p className="text-white/70 text-sm mb-3">
                        "Create an e-commerce website with product listings, shopping cart, and checkout functionality.
                        Include proper CSS styling, responsive design, and a dark theme with gold accents."
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <h4 className="font-medium mb-2">Portfolio Website</h4>
                      <p className="text-white/70 text-sm mb-3">
                        "Build a portfolio website with a hero section, project gallery with filtering, about me
                        section, and contact form. Use a minimalist design with proper CSS styling and subtle
                        animations."
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <h4 className="font-medium mb-2">Educational Platform</h4>
                      <p className="text-white/70 text-sm mb-3">
                        "Design an educational platform with course listings, lesson pages, progress tracking, and a
                        user dashboard. Include proper CSS styling with a professional color scheme and responsive
                        design."
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </section>

            {/* Website Enhancement */}
            <section id="website-enhancement" className="mb-16 scroll-mt-16">
              <h2 className="font-semibold text-2xl mb-6">Website Enhancement</h2>

              <p className="text-white/80 mb-6">
                Our website enhancement feature allows you to make targeted improvements to existing websites without
                starting from scratch. This is perfect for updating designs, adding new features, or fixing styling
                issues.
              </p>

              <div className="space-y-6 mb-8">
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-medium mb-3">How Enhancement Works</h3>
                  <p className="text-white/70 mb-4">The enhancement process follows these steps:</p>
                  <ol className="space-y-3 text-white/70 list-decimal pl-5">
                    <li className="pl-2">
                      <span>Upload your existing website HTML or use a previously generated website</span>
                    </li>
                    <li className="pl-2">
                      <span>
                        Specify what aspects you want to enhance (e.g., "improve the styling", "add a contact form")
                      </span>
                    </li>
                    <li className="pl-2">
                      <span>
                        Our AI analyzes your website and makes targeted improvements while preserving your content
                      </span>
                    </li>
                    <li className="pl-2">
                      <span>Review the changes with a before/after comparison and download the enhanced website</span>
                    </li>
                  </ol>
                </div>

                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-medium mb-3">Enhancement Examples</h3>
                  <p className="text-white/70 mb-4">Here are some common enhancement requests:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-white/10 text-white/90 text-sm">
                      "Make the design more modern"
                    </div>
                    <div className="p-3 rounded-lg bg-white/10 text-white/90 text-sm">
                      "Improve the mobile responsiveness"
                    </div>
                    <div className="p-3 rounded-lg bg-white/10 text-white/90 text-sm">"Add a sticky header"</div>
                    <div className="p-3 rounded-lg bg-white/10 text-white/90 text-sm">
                      "Update the color scheme to match our brand"
                    </div>
                    <div className="p-3 rounded-lg bg-white/10 text-white/90 text-sm">
                      "Add a newsletter signup form"
                    </div>
                    <div className="p-3 rounded-lg bg-white/10 text-white/90 text-sm">"Fix the CSS styling issues"</div>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="mb-16 scroll-mt-16">
              <h2 className="font-semibold text-2xl mb-6">Frequently Asked Questions</h2>

              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-medium mb-2">Is Say2Site free to use?</h3>
                  <p className="text-white/70">
                    Yes, Say2Site is currently free to use during our beta period. We may introduce premium features in
                    the future, but we're committed to maintaining a generous free tier.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-medium mb-2">Do I own the code generated by Say2Site?</h3>
                  <p className="text-white/70">
                    Yes, you own all the code generated by Say2Site. You're free to use it for personal or commercial
                    projects without attribution.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-medium mb-2">How do the suggestion buttons work?</h3>
                  <p className="text-white/70">
                    Our suggestion buttons provide pre-written prompts for common website types. Simply click a button,
                    and the AI will automatically generate a complete website of that type with proper styling and
                    functionality.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-medium mb-2">Can I modify the generated code?</h3>
                  <p className="text-white/70">
                    The code is generated as a starting point. You can copy it and make any modifications you need for
                    your specific project requirements, or use our enhancement feature to make targeted improvements.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-medium mb-2">Does Say2Site support blockchains other than Solana?</h3>
                  <p className="text-white/70">
                    Currently, Say2Site focuses on Solana for Web3 development. Support for additional blockchains may
                    be added in future updates based on user demand.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-medium mb-2">How can I deploy the generated websites?</h3>
                  <p className="text-white/70">
                    The generated code can be deployed to any hosting platform that supports HTML, CSS, and JavaScript,
                    such as Vercel, Netlify, or your own servers. We provide the complete source code that you can use
                    with your preferred deployment method.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black py-10">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Image
              src="/images/say2site-logo-white.png"
              alt="Say2Site Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="font-bold">Say2Site</span>
          </div>
          <div className="text-center md:text-left text-white/50 text-sm">
            © {new Date().getFullYear()} Say2Site. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="https://twitter.com"
              target="_blank"
              className="text-white/70 hover:text-white transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </Link>
            <Link
              href="https://github.com"
              target="_blank"
              className="text-white/70 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
