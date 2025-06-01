// Enhanced code requirements for superior website generation

export interface CodeRequirement {
  category: string
  minLines: number
  requiredElements: string[]
  requiredFunctionality: string[]
}

export const codeRequirements: CodeRequirement[] = [
  {
    category: "HTML Structure",
    minLines: 300,
    requiredElements: [
      "Complete semantic HTML5 structure with proper document outline",
      "Comprehensive meta tags for SEO and social sharing",
      "Proper use of landmark elements (header, nav, main, footer, etc.)",
      "Structured data markup using JSON-LD",
      "Proper heading hierarchy (h1-h6) with logical structure",
      "Multiple sections with appropriate ARIA roles",
      "Responsive navigation with mobile menu",
      "Hero section with compelling call-to-action",
      "Feature sections with cards/grids",
      "Testimonials or social proof section",
      "Pricing or product showcase section",
      "Team or about section with profiles",
      "FAQ or accordion section with proper ARIA attributes",
      "Contact form with proper validation and accessibility",
      "Footer with multiple columns and site map",
      "Modal/popup structures with proper focus management",
      "Loading states and skeleton screens",
      "Error states and feedback messages",
      "Success confirmation messages",
      "Proper image handling with srcset and sizes",
      "SVG icons with proper accessibility",
    ],
    requiredFunctionality: [
      "Proper document structure with semantic elements",
      "Comprehensive ARIA labels and roles for accessibility",
      "Complete meta tags for SEO and social sharing",
      "Structured data markup for rich snippets",
      "Multiple form elements with proper validation",
      "Image galleries or carousels with proper controls",
      "Tables or data displays with proper accessibility",
      "Social media integration with sharing capabilities",
      "Newsletter signup with validation",
      "Search functionality with proper ARIA roles",
      "Proper focus management for interactive elements",
      "Skip links for keyboard navigation",
      "Proper alt text for all images",
      "Proper form labels and error messages",
      "Proper use of buttons vs. links",
      "Proper use of lists for navigation",
    ],
  },
  {
    category: "CSS Styling",
    minLines: 500,
    requiredElements: [
      "Comprehensive CSS custom properties (variables) system",
      "Complete responsive design with mobile-first approach",
      "Multiple breakpoints (mobile, tablet, desktop, large desktop)",
      "Advanced Grid and Flexbox layouts",
      "Complex animations and transitions",
      "Hover, focus, and active states for all interactive elements",
      "Focus visible states for keyboard navigation",
      "Loading animations and skeleton screens",
      "Custom form styling with validation states",
      "Modal/overlay styling with proper z-index management",
      "Print styles for better printing experience",
      "Dark mode support with prefers-color-scheme",
      "Reduced motion support with prefers-reduced-motion",
      "High contrast mode support",
      "Custom scrollbar styling",
      "Advanced typography system with responsive sizing",
      "Custom button and input styles",
      "Card hover effects and animations",
      "Hero section with advanced layout",
      "Feature grid with responsive behavior",
      "Testimonial carousel styling",
      "Pricing table with highlight effects",
      "Team grid with hover effects",
      "FAQ accordion styling",
      "Contact form with validation styling",
      "Footer with responsive columns",
      "Navigation with dropdown styling",
      "Mobile menu with animations",
      "Toast/notification styling",
      "Progress indicators",
    ],
    requiredFunctionality: [
      "Dark mode toggle with localStorage persistence",
      "Smooth scrolling with scroll-behavior",
      "Advanced gradient backgrounds and overlays",
      "Box shadows and depth effects",
      "Custom scrollbar styling for WebKit browsers",
      "Animated buttons and interactive elements",
      "Card hover effects with transforms",
      "Image filters and effects",
      "Comprehensive typography system with modular scale",
      "Utility classes for common patterns",
      "Component-based styling with BEM methodology",
      "CSS Grid for complex layouts",
      "Flexbox for component layouts",
      "CSS animations and transitions",
      "Media queries for responsive design",
      "CSS custom properties for theming",
      "CSS counters for numbered lists",
      "CSS shapes for creative layouts",
      "CSS masks and clip-paths",
      "Advanced selectors for targeting elements",
    ],
  },
  {
    category: "JavaScript Functionality",
    minLines: 500,
    requiredElements: [
      "Comprehensive event listeners with proper delegation",
      "Form validation with detailed error messages",
      "Dynamic content loading and manipulation",
      "Local storage for user preferences and data",
      "Session storage for temporary data",
      "API simulation or fetch calls with error handling",
      "Comprehensive error handling with try-catch blocks",
      "Multiple utility functions and modules",
      "Animation control with requestAnimationFrame",
      "Scroll-based interactions with IntersectionObserver",
      "Resize handling with debouncing",
      "Mobile menu functionality with proper focus management",
      "Dropdown menus with keyboard navigation",
      "Modal/dialog management with focus trapping",
      "Carousel/slider implementation with touch support",
      "Accordion/tab functionality with ARIA support",
      "Search/filter functionality with highlighting",
      "Form submission with validation and feedback",
      "Toast/notification system",
      "Lazy loading implementation for images and content",
      "Theme switching with localStorage persistence",
      "Countdown timers or animations",
      "Progress indicators for multi-step processes",
      "Copy to clipboard functionality",
      "Share functionality for social media",
      "Form auto-save functionality",
      "Input masking for formatted inputs",
      "Drag and drop functionality",
      "Infinite scroll or pagination",
      "Data visualization with charts or graphs",
    ],
    requiredFunctionality: [
      "Smooth scroll navigation with offset handling",
      "Form validation and submission with feedback",
      "Modal/popup management with focus trapping",
      "Image gallery or carousel with touch support",
      "Accordion/tab functionality with ARIA support",
      "Search/filter functionality with highlighting",
      "Shopping cart functionality (if e-commerce)",
      "Dark mode toggle with system preference detection",
      "Lazy loading with IntersectionObserver",
      "Animation triggers with IntersectionObserver",
      "Debouncing for performance-intensive operations",
      "Throttling for scroll events",
      "Cookie consent management",
      "Analytics event tracking",
      "Social sharing functionality",
      "Copy to clipboard with feedback",
      "Form auto-save with localStorage",
      "Input validation with detailed error messages",
      "Password strength meter",
      "Character/word counter for inputs",
      "Countdown timer functionality",
      "Progress bar for multi-step processes",
      "Drag and drop functionality",
      "Infinite scroll or load more functionality",
      "Sortable lists or tables",
      "Filterable content with multiple criteria",
      "Responsive image loading based on viewport",
      "Video player with custom controls",
      "Audio player with custom controls",
      "Interactive maps or location functionality",
    ],
  },
]

export function generateCodeRequirementsPrompt(): string {
  return `
## MANDATORY CODE REQUIREMENTS:

Your generated website MUST contain AT LEAST 1300 lines of well-structured, functional code with the following distribution:

### HTML Requirements (Minimum 300 lines):
${codeRequirements[0].requiredElements.map((elem) => `- ${elem}`).join("\n")}

### CSS Requirements (Minimum 500 lines):
${codeRequirements[1].requiredElements.map((elem) => `- ${elem}`).join("\n")}

### JavaScript Requirements (Minimum 500 lines):
${codeRequirements[2].requiredElements.map((elem) => `- ${elem}`).join("\n")}

## CRITICAL: DO NOT GENERATE MINIMAL OR SKELETON CODE

1. Every section must be fully implemented with real content and functionality
2. All interactive features must have complete JavaScript implementation
3. CSS must include comprehensive styling for all elements and states
4. Include detailed comments explaining complex logic and functionality
5. Implement proper error handling for all user interactions
6. Add loading states and animations for better user experience
7. Include comprehensive accessibility features throughout

## MANDATORY FEATURES TO IMPLEMENT:

1. **Advanced Navigation System**
   - Sticky header with scroll detection
   - Mobile hamburger menu with animations
   - Dropdown menus with keyboard navigation
   - Mega menu for desktop (if applicable)
   - Active state indicators
   - Smooth scroll to sections
   - Search functionality in navigation

2. **Hero Section**
   - Animated headline with typing effect
   - Multiple CTAs with hover effects
   - Background image/video with overlay
   - Parallax scrolling effects
   - Animated statistics or key points
   - Scroll indicator animation
   - Responsive layout for all devices

3. **Content Sections**
   - Feature cards with hover animations
   - Image galleries with lightbox functionality
   - Testimonial carousel with pagination
   - Team member profiles with social links
   - Service/product showcases with filtering
   - Pricing tables with toggle functionality
   - FAQ accordion with smooth animations
   - Blog section with card layout
   - Portfolio grid with filtering options

4. **Interactive Elements**
   - Contact form with real-time validation
   - Newsletter signup with success feedback
   - Advanced search functionality with filters
   - Filter/sort options for content
   - Tab interfaces with smooth transitions
   - Modal popups with focus management
   - Tooltips with positioning logic
   - Progress indicators for multi-step processes
   - Notification system for user feedback
   - Countdown timers for urgency

5. **Footer**
   - Multi-column layout with responsive design
   - Newsletter signup with validation
   - Social media links with hover effects
   - Quick links organized by category
   - Contact information with microdata
   - Copyright and legal links
   - Back to top button with smooth scroll
   - Language/region selector (if applicable)
   - Site map with comprehensive links

## CODE QUALITY REQUIREMENTS:

1. Use meaningful variable and function names following conventions
2. Implement comprehensive error handling for all operations
3. Add detailed comments explaining complex logic
4. Use modern JavaScript (ES6+) with proper patterns
5. Implement responsive design for all screen sizes (mobile, tablet, desktop)
6. Ensure cross-browser compatibility with feature detection
7. Optimize for performance with efficient code
8. Follow accessibility best practices (WCAG 2.1 AA)
9. Implement proper SEO practices with meta tags and structured data
10. Use proper semantic HTML5 elements throughout

Remember: Generate a COMPLETE, PRODUCTION-READY website with ALL features fully implemented. Do not create placeholder or minimal implementations.`
}

export function enforceMinimumCodeSize(code: string): boolean {
  const lines = code.split("\n").length
  return lines >= 1300
}

export function analyzeCodeCompleteness(code: string): {
  totalLines: number
  htmlLines: number
  cssLines: number
  jsLines: number
  isComplete: boolean
  missingFeatures: string[]
} {
  const lines = code.split("\n")
  const totalLines = lines.length

  // Count lines for each language
  let htmlLines = 0
  let cssLines = 0
  let jsLines = 0
  let inStyle = false
  let inScript = false

  lines.forEach((line) => {
    if (line.includes("<style")) inStyle = true
    if (line.includes("</style>")) inStyle = false
    if (line.includes("<script")) inScript = true
    if (line.includes("</script>")) inScript = false

    if (inStyle) {
      cssLines++
    } else if (inScript) {
      jsLines++
    } else {
      htmlLines++
    }
  })

  // Check for missing features
  const missingFeatures: string[] = []

  // Check HTML features
  if (!code.includes("<nav") && !code.includes("<header")) {
    missingFeatures.push("Navigation menu")
  }
  if (!code.includes("<form")) {
    missingFeatures.push("Contact form")
  }
  if (!code.includes("<footer")) {
    missingFeatures.push("Footer section")
  }
  if (!code.includes("aria-")) {
    missingFeatures.push("ARIA attributes for accessibility")
  }

  // Check CSS features
  if (!code.includes("@media")) {
    missingFeatures.push("Responsive design media queries")
  }
  if (!code.includes(":hover") || !code.includes(":focus")) {
    missingFeatures.push("Interactive states (hover, focus)")
  }
  if (!code.includes("animation") && !code.includes("transition")) {
    missingFeatures.push("Animations or transitions")
  }
  if (!code.includes("grid") && !code.includes("flex")) {
    missingFeatures.push("Modern layout techniques (Grid or Flexbox)")
  }

  // Check JavaScript features
  if (!code.includes("addEventListener")) {
    missingFeatures.push("Event listeners")
  }
  if (!code.includes("function")) {
    missingFeatures.push("JavaScript functions")
  }
  if (!code.includes("querySelector") && !code.includes("getElementById")) {
    missingFeatures.push("DOM manipulation")
  }
  if (!code.includes("try") && !code.includes("catch")) {
    missingFeatures.push("Error handling")
  }
  if (!code.includes("localStorage") && !code.includes("sessionStorage")) {
    missingFeatures.push("Client-side storage")
  }

  const isComplete =
    totalLines >= 1300 && missingFeatures.length === 0 && htmlLines >= 300 && cssLines >= 500 && jsLines >= 500

  return {
    totalLines,
    htmlLines,
    cssLines,
    jsLines,
    isComplete,
    missingFeatures,
  }
}
