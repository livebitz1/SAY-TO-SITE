"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getAllTemplates, type WebsiteTemplate } from "@/lib/prompt-enhancer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Layout, ShoppingBag, Briefcase, UtensilsCrossed, User, Sparkles, Check } from "lucide-react"

interface TemplateSelectorProps {
  onSelectTemplate: (template: WebsiteTemplate) => void
  selectedTemplate?: WebsiteTemplate
}

const categoryIcons = {
  portfolio: <User className="h-5 w-5" />,
  landing: <Layout className="h-5 w-5" />,
  ecommerce: <ShoppingBag className="h-5 w-5" />,
  hospitality: <UtensilsCrossed className="h-5 w-5" />,
  business: <Briefcase className="h-5 w-5" />,
}

export function TemplateSelector({ onSelectTemplate, selectedTemplate }: TemplateSelectorProps) {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null)
  const websiteTemplates = getAllTemplates()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-200 mb-2">Choose a Template</h3>
        <p className="text-sm text-gray-400">Select a professional template to ensure high-quality results</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {websiteTemplates.map((template) => {
          const isSelected = selectedTemplate?.id === template.id
          const isHovered = hoveredTemplate === template.id

          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onHoverStart={() => setHoveredTemplate(template.id)}
              onHoverEnd={() => setHoveredTemplate(null)}
            >
              <button
                onClick={() => onSelectTemplate(template)}
                className={`
                  relative w-full text-left p-6 rounded-xl border transition-all duration-300
                  ${
                    isSelected
                      ? "bg-[#d4af37]/10 border-[#d4af37]/50"
                      : "bg-gray-800/50 border-gray-700/50 hover:border-gray-600"
                  }
                `}
              >
                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-[#d4af37] text-black p-1 rounded-full">
                      <Check className="h-4 w-4" />
                    </div>
                  </div>
                )}

                {/* Template content */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`
                      p-2 rounded-lg transition-colors
                      ${isSelected ? "bg-[#d4af37]/20" : "bg-gray-700/50"}
                    `}
                    >
                      {categoryIcons[template.category] || <Layout className="h-5 w-5" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{template.name}</h4>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {template.category}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 line-clamp-2">{template.description}</p>

                  {/* Features preview */}
                  <div className="flex flex-wrap gap-1">
                    {template.structure.features.slice(0, 3).map((feature, index) => (
                      <span key={index} className="text-xs bg-gray-700/30 text-gray-400 px-2 py-1 rounded">
                        {feature.split(" ").slice(0, 2).join(" ")}...
                      </span>
                    ))}
                    {template.structure.features.length > 3 && (
                      <span className="text-xs text-gray-500">+{template.structure.features.length - 3} more</span>
                    )}
                  </div>
                </div>

                {/* Hover effect */}
                <AnimatePresence>
                  {isHovered && !isSelected && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/5 to-[#b8860b]/5 rounded-xl pointer-events-none"
                    />
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          )
        })}
      </div>

      {/* Custom template option */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center">
        <p className="text-sm text-gray-500 mb-2">Don't see what you need?</p>
        <Button
          variant="ghost"
          size="sm"
          className="text-[#d4af37] hover:text-[#b8860b]"
          onClick={() => onSelectTemplate(null)}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Create Custom Website
        </Button>
      </motion.div>
    </div>
  )
}
