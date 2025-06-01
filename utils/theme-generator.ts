// Theme types
export type ColorScheme = "vibrant" | "monochrome" | "pastel" | "dark" | "custom"
export type DesignStyle = "modern" | "minimalist" | "bold" | "elegant" | "playful"

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  backgroundAlt: string
  text: string
  textSecondary: string
  border: string
  success: string
  warning: string
  error: string
  info: string
}

// Generate a color palette based on style and scheme
export function generateThemeColors(style: DesignStyle, scheme: ColorScheme): ThemeColors {
  // Base themes for different color schemes
  const baseThemes: Record<ColorScheme, ThemeColors> = {
    vibrant: {
      primary: "#4F46E5", // Indigo
      secondary: "#7C3AED", // Purple
      accent: "#EC4899", // Pink
      background: "#FFFFFF",
      backgroundAlt: "#F9FAFB",
      text: "#111827",
      textSecondary: "#6B7280",
      border: "#E5E7EB",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#3B82F6",
    },
    monochrome: {
      primary: "#2D3748",
      secondary: "#4A5568",
      accent: "#718096",
      background: "#FFFFFF",
      backgroundAlt: "#F7FAFC",
      text: "#1A202C",
      textSecondary: "#718096",
      border: "#E2E8F0",
      success: "#38A169",
      warning: "#D69E2E",
      error: "#E53E3E",
      info: "#3182CE",
    },
    pastel: {
      primary: "#8B5CF6",
      secondary: "#EC4899",
      accent: "#06B6D4",
      background: "#FFFAF0",
      backgroundAlt: "#FFF5EB",
      text: "#4B5563",
      textSecondary: "#9CA3AF",
      border: "#FDE68A",
      success: "#34D399",
      warning: "#FBBF24",
      error: "#F87171",
      info: "#60A5FA",
    },
    dark: {
      primary: "#8B5CF6",
      secondary: "#EC4899",
      accent: "#10B981",
      background: "#111827",
      backgroundAlt: "#1F2937",
      text: "#F9FAFB",
      textSecondary: "#D1D5DB",
      border: "#374151",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#3B82F6",
    },
    custom: {
      primary: "#4F46E5",
      secondary: "#7C3AED",
      accent: "#EC4899",
      background: "#FFFFFF",
      backgroundAlt: "#F9FAFB",
      text: "#111827",
      textSecondary: "#6B7280",
      border: "#E5E7EB",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#3B82F6",
    },
  }

  // Get the base theme
  const theme = { ...baseThemes[scheme] }

  // Modify based on style
  switch (style) {
    case "modern":
      // Modern style has more vibrant colors and subtle gradients
      if (scheme !== "dark") {
        theme.backgroundAlt = "#F5F7FA"
      }
      break

    case "minimalist":
      // Minimalist style has more muted colors and less contrast
      if (scheme === "vibrant") {
        theme.primary = "#6366F1"
        theme.secondary = "#8B5CF6"
        theme.accent = "#F472B6"
      }
      // Reduce color intensity for minimalist style
      if (scheme !== "dark") {
        theme.background = "#FFFFFF"
        theme.backgroundAlt = "#FAFAFA"
      }
      break

    case "bold":
      // Bold style has high contrast and strong colors
      if (scheme === "vibrant") {
        theme.primary = "#4338CA"
        theme.secondary = "#6D28D9"
        theme.accent = "#DB2777"
      } else if (scheme === "dark") {
        theme.primary = "#6D28D9"
        theme.secondary = "#DB2777"
        theme.accent = "#059669"
        theme.background = "#09090B"
        theme.backgroundAlt = "#18181B"
      }
      break

    case "elegant":
      // Elegant style has sophisticated, muted colors
      if (scheme === "vibrant") {
        theme.primary = "#5B21B6"
        theme.secondary = "#9D174D"
        theme.accent = "#0E7490"
      } else if (scheme === "monochrome") {
        theme.primary = "#1E293B"
        theme.secondary = "#334155"
        theme.accent = "#475569"
      } else if (scheme === "pastel") {
        theme.primary = "#7C3AED"
        theme.secondary = "#EC4899"
        theme.accent = "#0EA5E9"
        theme.background = "#FFF8F0"
      }
      break

    case "playful":
      // Playful style has bright, fun colors
      if (scheme === "vibrant") {
        theme.primary = "#6366F1"
        theme.secondary = "#EC4899"
        theme.accent = "#F59E0B"
      } else if (scheme === "pastel") {
        theme.primary = "#8B5CF6"
        theme.secondary = "#F472B6"
        theme.accent = "#FBBF24"
        theme.background = "#FDFCF7"
      } else if (scheme === "dark") {
        theme.primary = "#8B5CF6"
        theme.secondary = "#EC4899"
        theme.accent = "#FBBF24"
      }
      break
  }

  return theme
}

// Generate CSS variables from theme colors
export function generateCssVariables(theme: ThemeColors): string {
  return `
    :root {
      --color-primary: ${theme.primary};
      --color-primary-hover: ${adjustColor(theme.primary, -10)};
      --color-primary-light: ${adjustColor(theme.primary, 40)};
      
      --color-secondary: ${theme.secondary};
      --color-secondary-hover: ${adjustColor(theme.secondary, -10)};
      --color-secondary-light: ${adjustColor(theme.secondary, 40)};
      
      --color-accent: ${theme.accent};
      --color-accent-hover: ${adjustColor(theme.accent, -10)};
      --color-accent-light: ${adjustColor(theme.accent, 40)};
      
      --color-background: ${theme.background};
      --color-background-alt: ${theme.backgroundAlt};
      
      --color-text: ${theme.text};
      --color-text-secondary: ${theme.textSecondary};
      
      --color-border: ${theme.border};
      --color-border-hover: ${adjustColor(theme.border, -10)};
      
      --color-success: ${theme.success};
      --color-warning: ${theme.warning};
      --color-error: ${theme.error};
      --color-info: ${theme.info};
      
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      
      --radius-sm: 0.125rem;
      --radius-md: 0.375rem;
      --radius-lg: 0.5rem;
      --radius-xl: 1rem;
      --radius-full: 9999px;
    }
  `
}

// Generate common CSS classes for the theme
export function generateThemeClasses(): string {
  return `
    .bg-primary {
      background-color: var(--color-primary);
    }
    
    .bg-secondary {
      background-color: var(--color-secondary);
    }
    
    .bg-accent {
      background-color: var(--color-accent);
    }
    
    .bg-background {
      background-color: var(--color-background);
    }
    
    .bg-background-alt {
      background-color: var(--color-background-alt);
    }
    
    .text-primary {
      color: var(--color-primary);
    }
    
    .text-secondary {
      color: var(--color-secondary);
    }
    
    .text-accent {
      color: var(--color-accent);
    }
    
    .text-default {
      color: var(--color-text);
    }
    
    .text-muted {
      color: var(--color-text-secondary);
    }
    
    .border-default {
      border-color: var(--color-border);
    }
    
    .btn-primary {
      background-color: var(--color-primary);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: var(--radius-md);
      font-weight: 500;
      transition: background-color 0.2s;
    }
    
    .btn-primary:hover {
      background-color: var(--color-primary-hover);
    }
    
    .btn-secondary {
      background-color: var(--color-secondary);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: var(--radius-md);
      font-weight: 500;
      transition: background-color 0.2s;
    }
    
    .btn-secondary:hover {
      background-color: var(--color-secondary-hover);
    }
    
    .btn-outline {
      background-color: transparent;
      color: var(--color-primary);
      border: 1px solid var(--color-primary);
      padding: 0.5rem 1rem;
      border-radius: var(--radius-md);
      font-weight: 500;
      transition: all 0.2s;
    }
    
    .btn-outline:hover {
      background-color: var(--color-primary);
      color: white;
    }
    
    .card {
      background-color: var(--color-background);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      padding: 1.5rem;
      border: 1px solid var(--color-border);
    }
    
    .gradient-primary {
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    }
    
    .gradient-text {
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  `
}

// Helper function to adjust color brightness
function adjustColor(hex: string, percent: number): string {
  // Convert hex to RGB
  let r = Number.parseInt(hex.substring(1, 3), 16)
  let g = Number.parseInt(hex.substring(3, 5), 16)
  let b = Number.parseInt(hex.substring(5, 7), 16)

  // Adjust brightness
  r = Math.max(0, Math.min(255, r + Math.round(r * (percent / 100))))
  g = Math.max(0, Math.min(255, g + Math.round(g * (percent / 100))))
  b = Math.max(0, Math.min(255, b + Math.round(b * (percent / 100))))

  // Convert back to hex
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

// Generate a complete theme with CSS variables and classes
export function generateCompleteTheme(style: DesignStyle, scheme: ColorScheme): string {
  const themeColors = generateThemeColors(style, scheme)
  const cssVariables = generateCssVariables(themeColors)
  const themeClasses = generateThemeClasses()

  return `
    ${cssVariables}
    ${themeClasses}
    
    /* Base styles */
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: var(--color-background);
      color: var(--color-text);
      line-height: 1.5;
    }
    
    h1, h2, h3, h4, h5, h6 {
      color: var(--color-text);
      font-weight: 700;
      line-height: 1.2;
    }
    
    a {
      color: var(--color-primary);
      text-decoration: none;
      transition: color 0.2s;
    }
    
    a:hover {
      color: var(--color-primary-hover);
    }
    
    /* Layout */
    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    /* Sections */
    section {
      padding: 4rem 0;
    }
    
    /* Header */
    header {
      background-color: var(--color-background);
      border-bottom: 1px solid var(--color-border);
    }
    
    /* Footer */
    footer {
      background-color: var(--color-background-alt);
      border-top: 1px solid var(--color-border);
      padding: 2rem 0;
    }
  `
}
