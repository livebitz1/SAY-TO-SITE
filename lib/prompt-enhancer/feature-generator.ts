// Comprehensive feature generator to ensure rich functionality

export interface WebsiteFeature {
  name: string
  description: string
  htmlElements: string[]
  cssRequirements: string[]
  jsImplementation: string[]
  estimatedLines: number
}

export const comprehensiveFeatures: WebsiteFeature[] = [
  {
    name: "Advanced Navigation System",
    description: "Multi-level navigation with mobile menu, search, and user account",
    htmlElements: [
      "Navigation bar with logo",
      "Primary menu items",
      "Dropdown submenus",
      "Search bar with autocomplete",
      "User account menu",
      "Mobile hamburger menu",
      "Breadcrumb navigation",
    ],
    cssRequirements: [
      "Sticky header styling",
      "Dropdown animations",
      "Mobile menu transitions",
      "Search bar styling",
      "Hover and focus states",
      "Active page indicators",
    ],
    jsImplementation: [
      "Mobile menu toggle",
      "Dropdown menu handlers",
      "Search functionality",
      "Sticky header on scroll",
      "Active section highlighting",
      "Keyboard navigation",
    ],
    estimatedLines: 150,
  },
  {
    name: "Hero Section with Slider",
    description: "Full-featured hero with carousel, animations, and CTAs",
    htmlElements: [
      "Hero container with slides",
      "Slide navigation dots",
      "Previous/next buttons",
      "Animated headlines",
      "CTA buttons",
      "Background images/videos",
      "Statistics counters",
    ],
    cssRequirements: [
      "Slide transitions",
      "Button animations",
      "Text animations",
      "Responsive sizing",
      "Overlay effects",
      "Parallax scrolling",
    ],
    jsImplementation: [
      "Carousel functionality",
      "Auto-play with pause",
      "Touch/swipe support",
      "Animated counters",
      "Parallax effects",
      "Video control",
    ],
    estimatedLines: 200,
  },
  {
    name: "Feature Showcase Grid",
    description: "Interactive feature cards with animations and modals",
    htmlElements: [
      "Feature grid container",
      "Feature cards with icons",
      "Hover overlays",
      "Read more buttons",
      "Modal popups",
      "Category filters",
    ],
    cssRequirements: [
      "Grid layout system",
      "Card hover effects",
      "Icon animations",
      "Modal styling",
      "Filter transitions",
      "Loading states",
    ],
    jsImplementation: [
      "Filter functionality",
      "Modal management",
      "Lazy loading",
      "Animation on scroll",
      "Category sorting",
      "View toggle (grid/list)",
    ],
    estimatedLines: 180,
  },
  {
    name: "Advanced Contact Form",
    description: "Multi-step form with validation, file upload, and confirmation",
    htmlElements: [
      "Multi-step form container",
      "Progress indicator",
      "Form fields with labels",
      "File upload area",
      "Terms checkbox",
      "Submit button",
      "Success message",
    ],
    cssRequirements: [
      "Form field styling",
      "Progress bar",
      "Error states",
      "File upload styling",
      "Button states",
      "Success animations",
    ],
    jsImplementation: [
      "Multi-step navigation",
      "Field validation",
      "File upload handling",
      "Progress tracking",
      "Form submission",
      "Success/error handling",
    ],
    estimatedLines: 220,
  },
  {
    name: "Interactive Gallery",
    description: "Filterable image gallery with lightbox and zoom",
    htmlElements: [
      "Gallery container",
      "Filter buttons",
      "Image grid",
      "Lightbox overlay",
      "Image navigation",
      "Zoom controls",
      "Image captions",
    ],
    cssRequirements: [
      "Masonry layout",
      "Filter animations",
      "Lightbox styling",
      "Zoom effects",
      "Loading placeholders",
      "Responsive grid",
    ],
    jsImplementation: [
      "Filter logic",
      "Lightbox functionality",
      "Image zoom",
      "Keyboard navigation",
      "Lazy loading",
      "Touch gestures",
    ],
    estimatedLines: 190,
  },
  {
    name: "Testimonial System",
    description: "Carousel with ratings, filters, and video testimonials",
    htmlElements: [
      "Testimonial carousel",
      "Rating stars",
      "Customer info",
      "Video testimonials",
      "Filter options",
      "Navigation controls",
    ],
    cssRequirements: [
      "Carousel styling",
      "Star ratings",
      "Card designs",
      "Video styling",
      "Animation effects",
      "Responsive layout",
    ],
    jsImplementation: [
      "Carousel logic",
      "Video playback",
      "Filter functionality",
      "Auto-rotation",
      "Pause on hover",
      "Touch support",
    ],
    estimatedLines: 160,
  },
  {
    name: "Advanced Footer",
    description: "Multi-column footer with newsletter, social, and sitemap",
    htmlElements: [
      "Footer columns",
      "Newsletter form",
      "Social media links",
      "Sitemap links",
      "Contact info",
      "Legal links",
      "Back to top button",
    ],
    cssRequirements: [
      "Column layout",
      "Newsletter styling",
      "Social icons",
      "Link hover effects",
      "Mobile layout",
      "Back to top animation",
    ],
    jsImplementation: [
      "Newsletter signup",
      "Back to top scroll",
      "Social sharing",
      "Dynamic year",
      "Link tracking",
      "Cookie notice",
    ],
    estimatedLines: 140,
  },
]

export function generateFeatureListPrompt(websiteType: string): string {
  const features = comprehensiveFeatures
    .map(
      (feature) => `
### ${feature.name}
${feature.description}

HTML Elements Required:
${feature.htmlElements.map((elem) => `- ${elem}`).join("\n")}

CSS Styling Required:
${feature.cssRequirements.map((req) => `- ${req}`).join("\n")}

JavaScript Implementation:
${feature.jsImplementation.map((impl) => `- ${impl}`).join("\n")}

Estimated Code Lines: ${feature.estimatedLines}
`,
    )
    .join("\n\n")

  return `
## COMPREHENSIVE FEATURE IMPLEMENTATION GUIDE

For the ${websiteType} website, implement ALL of the following features in detail:

${features}

## ADDITIONAL REQUIREMENTS:

1. Each feature must be FULLY FUNCTIONAL, not just visual
2. Include proper error handling for all interactions
3. Add loading states and feedback for user actions
4. Implement keyboard navigation for accessibility
5. Ensure mobile responsiveness for all features
6. Add smooth animations and transitions
7. Include detailed comments explaining the implementation

Total estimated lines: ${comprehensiveFeatures.reduce((sum, f) => sum + f.estimatedLines, 0)}+ lines

Remember: This is a MINIMUM requirement. Add more features and functionality to create a truly comprehensive website.`
}
