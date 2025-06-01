"use client"

import { motion } from "framer-motion"
import type { WebsiteTemplate } from "@/lib/prompt-enhancer/types"
import { Badge } from "@/components/ui/badge"
import { Code2, Palette, Zap, Shield, Search, Smartphone, Globe, Sparkles } from "lucide-react"

interface TemplatePreviewProps {
  template: WebsiteTemplate
}

const featureIcons = {
  code: <Code2 className="h-4 w-4" />,
  design: <Palette className="h-4 w-4" />,
  performance: <Zap className="h-4 w-4" />,
  security: <Shield className="h-4 w-4" />,
  seo: <Search className="h-4 w-4" />,
  mobile: <Smartphone className="h-4 w-4" />,
  features: <Sparkles className="h-4 w-4" />,
}

export function TemplatePreview({ template }: TemplatePreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">{template.name}</h3>
            <Badge className="bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/30">
              <Globe className="h-3 w-3 mr-1" />
              {template.category}
            </Badge>
          </div>
          <p className="text-sm text-gray-400">{template.description}</p>
        </div>

        {/* Sections */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-3">Website Sections</h4>
          <div className="grid grid-cols-2 gap-2">
            {template.structure.sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="text-xs bg-gray-700/30 text-gray-400 px-3 py-2 rounded-lg"
              >
                {section}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-3">Key Features</h4>
          <div className="space-y-2">
            {template.structure.features.slice(0, 5).map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center space-x-2 text-sm text-gray-400"
              >
                {featureIcons.features}
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Best Practices */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-3">Quality Standards</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              {featureIcons.performance}
              <span>Optimized Performance</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              {featureIcons.mobile}
              <span>Mobile Responsive</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              {featureIcons.seo}
              <span>SEO Ready</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              {featureIcons.security}
              <span>Secure & Accessible</span>
            </div>
          </div>
        </div>

        {/* Design Principles */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-3">Design Approach</h4>
          <div className="flex flex-wrap gap-2">
            {template.structure.designPrinciples.slice(0, 4).map((principle, index) => (
              <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-400">
                {principle.split(" ").slice(0, 3).join(" ")}...
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
