import { UIPatternShowcase } from "@/components/ui-pattern-showcase"

export const metadata = {
  title: "UI Pattern Library",
  description: "Browse our collection of modern UI patterns for web development",
}

export default function UIPatternPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950 pt-10">
      <UIPatternShowcase />
    </main>
  )
}
