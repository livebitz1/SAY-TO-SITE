import { EnhancedGeneratorUI } from "@/components/enhanced-generator-ui"

export const metadata = {
  title: "Enhanced AI Website Generator",
  description: "Create stunning, production-ready websites with our enhanced AI generator",
}

export default function EnhancedGeneratorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <EnhancedGeneratorUI />
    </main>
  )
}
