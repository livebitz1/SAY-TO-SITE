import type React from "react"
import { cn } from "@/lib/utils"

interface MinimalistButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

export function MinimalistButton({
  children,
  className,
  variant = "default",
  size = "default",
  ...props
}: MinimalistButtonProps) {
  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-md font-medium transition-all duration-300",
        "bg-gradient-to-r from-amber-400 to-amber-600 text-black", // Changed to gold/amber gradient with black text
        "hover:shadow-[0_0_20px_rgba(251,191,36,0.5)]", // Changed shadow color to match gold/amber
        "active:translate-y-[1px]",
        {
          "px-4 py-2 text-sm": size === "default",
          "px-3 py-1.5 text-xs": size === "sm",
          "px-6 py-3 text-base": size === "lg",
          "bg-transparent border border-gray-300 text-gray-300 hover:bg-gray-800": variant === "outline",
          "bg-transparent text-gray-300 hover:bg-gray-800": variant === "ghost",
        },
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
