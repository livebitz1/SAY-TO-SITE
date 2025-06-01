import type { WebsiteTemplate } from "./types"
import { websiteTemplates } from "./templates-data"
import { detectRequiredFeatures } from "./feature-generator"
import { enhanceJavaScriptPrompt } from "./javascript-enhancer"
import { generateCodeRequirementsPrompt } from "./code-requirements"
import { generateFeatureListPrompt } from "./feature-generator"
import { enhanceHeroSectionPrompt } from "./hero-section-enhancer"

// Function to enhance prompts based on templates
export function enhancePromptWithTemplate(userPrompt: string, templateId?: string): string {
  // Detect required features from the user prompt
  const detectedFeatures = detectRequiredFeatures(userPrompt)

  // Start with the base prompt
  let enhancedPrompt = userPrompt

  // Add code requirements
  enhancedPrompt = generateCodeRequirementsPrompt() + "\n\n" + enhancedPrompt

  // Add JavaScript enhancements
  enhancedPrompt = enhanceJavaScriptPrompt(enhancedPrompt, detectedFeatures, templateId)

  // Add hero section requirements
  enhancedPrompt = enhanceHeroSectionPrompt(enhancedPrompt)

  // Find matching template based on keywords or specified ID
  let template: WebsiteTemplate | undefined

  if (templateId) {
    template = websiteTemplates.find((t) => t.id === templateId)
  } else {
    // Auto-detect template based on keywords
    const promptLower = userPrompt.toLowerCase()
    if (promptLower.includes("portfolio") || promptLower.includes("personal")) {
      template = websiteTemplates.find((t) => t.id === "modern-portfolio")
    } else if (promptLower.includes("saas") || promptLower.includes("landing")) {
      template = websiteTemplates.find((t) => t.id === "saas-landing")
    } else if (promptLower.includes("shop") || promptLower.includes("store") || promptLower.includes("ecommerce")) {
      template = websiteTemplates.find((t) => t.id === "ecommerce-store")
    } else if (promptLower.includes("restaurant") || promptLower.includes("cafe") || promptLower.includes("food")) {
      template = websiteTemplates.find((t) => t.id === "restaurant-website")
    } else if (
      promptLower.includes("corporate") ||
      promptLower.includes("business") ||
      promptLower.includes("company")
    ) {
      template = websiteTemplates.find((t) => t.id === "corporate-business")
    }
  }

  if (!template) {
    // Return generic enhancement if no template matches
    return (
      enhanceGenericPrompt(userPrompt) +
      generateCodeRequirementsPrompt() +
      generateFeatureListPrompt("generic") +
      enhanceJavaScriptPrompt(userPrompt, detectedFeatures)
    )
  }

  // Build enhanced prompt with template guidance
  enhancedPrompt += `
## Website Type: ${template.name}
${template.description}

## Required Sections:
${template.structure.sections.map((s) => `- ${s}`).join("\n")}

## Key Features to Implement:
${template.structure.features.map((f) => `- ${f}`).join("\n")}

## Design Principles:
${template.structure.designPrinciples.map((d) => `- ${d}`).join("\n")}

## Code Quality Requirements:

### HTML Structure:
${template.codePatterns.html.map((h) => `- ${h}`).join("\n")}

### CSS Patterns:
${template.codePatterns.css.map((c) => `- ${c}`).join("\n")}

### JavaScript Functionality:
${template.codePatterns.javascript.map((j) => `- ${j}`).join("\n")}

## Best Practices to Follow:
${template.bestPractices.map((b) => `- ${b}`).join("\n")}

## Additional Requirements:
1. Use semantic HTML5 elements throughout
2. Implement responsive design with mobile-first approach
3. Ensure WCAG 2.1 AA accessibility compliance
4. Optimize for Core Web Vitals (LCP, FID, CLS)
5. Include proper meta tags for SEO
6. Use modern CSS features (Grid, Flexbox, Custom Properties)
7. Implement smooth animations and transitions
8. Ensure cross-browser compatibility
9. Add loading states and error handling
10. Include comments explaining complex code sections

## Visual Design Guidelines:
1. Use a cohesive color palette with proper contrast ratios
2. Implement a clear typography hierarchy
3. Add subtle shadows and depth for modern look
4. Use consistent spacing (8px grid system)
5. Include hover states for all interactive elements
6. Ensure touch-friendly tap targets (min 44x44px)
7. Add focus states for keyboard navigation
8. Use appropriate imagery and icons
9. Implement smooth transitions (200-300ms)
10. Create a polished, professional appearance`

  // Add comprehensive feature list
  enhancedPrompt += generateFeatureListPrompt(template.id)

  enhancedPrompt += `

## FINAL CRITICAL REQUIREMENTS:

1. **MINIMUM CODE SIZE**: Generate AT LEAST 1000 lines of functional code
2. **COMPLETE IMPLEMENTATION**: Every feature must be fully functional, not just visual
3. **NO PLACEHOLDERS**: Use real content, real functionality, real interactions
4. **PRODUCTION READY**: The code should be ready for deployment without modifications
5. **COMPREHENSIVE TESTING**: Ensure all features work correctly on all devices

Generate a complete, production-ready website following these guidelines with FULLY FUNCTIONAL JavaScript for all interactive features.

DO NOT create a minimal or skeleton website. Create a FULL, FEATURE-RICH, PROFESSIONAL website with ALL functionality implemented.`

  return enhancedPrompt
}

// Generic prompt enhancement for unmatched templates
export function enhanceGenericPrompt(userPrompt: string): string {
  const detectedFeatures = detectRequiredFeatures(userPrompt)

  return `
${userPrompt}

## General Website Requirements:

### Structure:
- Clean, semantic HTML5 structure
- Minimum 10-12 major sections
- Proper heading hierarchy
- Accessible navigation with multiple menu items
- Responsive layout with multiple breakpoints

### Design:
- Modern, professional appearance
- Consistent color scheme with CSS variables
- Clear typography hierarchy with multiple font sizes
- Appropriate whitespace and padding
- Mobile-first approach with tablet and desktop layouts
- Animations and transitions throughout

### Functionality:
- Smooth interactions with visual feedback
- Form validation with multiple fields
- Responsive navigation with mobile menu
- Loading states for all async operations
- Error handling for all user inputs
- Search functionality
- Filter/sort capabilities
- Modal/popup functionality
- Accordion/tab interfaces
- Image galleries or carousels
${detectedFeatures.length > 0 ? `- Implement these features: ${detectedFeatures.join(", ")}` : ""}

### Interactive Elements Required:
- Navigation with dropdowns and mobile menu
- Hero section with animations
- Feature cards with hover effects
- Contact form with validation
- Image gallery with lightbox
- Testimonial carousel
- FAQ accordion
- Newsletter signup
- Social media integration
- Back to top button
- Loading animations
- Search functionality

### Best Practices:
- SEO optimization with meta tags and structured data
- Performance optimization with lazy loading
- Accessibility compliance with ARIA labels
- Cross-browser compatibility
- Security considerations for forms
- Analytics integration ready
- Social sharing capabilities

### Code Quality:
- Clean, well-commented code
- Consistent naming conventions
- Modular CSS organization
- Efficient JavaScript with ES6+
- Progressive enhancement
- Error boundaries and fallbacks

Generate a high-quality, production-ready website following modern web development best practices.`
}
