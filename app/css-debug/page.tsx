import { CSSDebugger } from "@/components/css-debugger"

export default function CSSDebugPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">CSS Debug Tool</h1>
      <CSSDebugger />
    </div>
  )
}
