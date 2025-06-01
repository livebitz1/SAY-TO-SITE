// Hero section enhancer to ensure rich, engaging hero sections with proper contrast

export function enhanceHeroSectionPrompt(basePrompt: string): string {
  return `${basePrompt}

## CRITICAL HERO SECTION REQUIREMENTS

Your generated website MUST include a rich, visually engaging hero section with NO blank space or minimal content. The hero section MUST include:

1. **Visual Elements (REQUIRED)**:
   - High-quality background image or pattern (NOT a plain background)
   - At least one product image, illustration, or graphic element
   - Visual hierarchy with proper contrast between elements
   - If using a light background, ALWAYS use dark text (black or dark gray)
   - If using a dark background, ALWAYS use light text (white or light gray)
   - NEVER use white or light text on light backgrounds
   - NEVER use dark text on dark backgrounds

2. **Content Elements (REQUIRED)**:
   - Compelling headline with clear value proposition (in proper contrasting color)
   - Descriptive subheading that explains the offering (at least 10-15 words)
   - At least 2 call-to-action buttons with different purposes
   - Additional trust elements (ratings, customer count, testimonial snippet, etc.)
   - ALWAYS ensure text has a minimum contrast ratio of 4.5:1 for accessibility

3. **Layout Requirements (REQUIRED)**:
   - Multi-column layout for desktop (NOT centered text only)
   - Proper spacing between all elements (NO cramped content)
   - Visual balance between text and imagery
   - Clear visual hierarchy guiding the user's attention
   - NEVER leave empty or blank spaces in the hero section
   - Fill the entire hero section with meaningful content and visuals

4. **Interactive Elements (REQUIRED - Choose at least 2)**:
   - Animated elements or transitions
   - Hover effects on buttons and interactive elements
   - Image slider or carousel
   - Video background or embedded video
   - Interactive product showcase
   - Animated text or typing effect
   - Parallax scrolling effect

5. **Technical Requirements**:
   - Fully responsive across all devices
   - Optimized images with proper alt text
   - Accessible text with proper contrast
   - Proper semantic HTML structure
   - Background overlays or gradients to ensure text readability

CRITICAL: The hero section MUST be visually rich and engaging, with NO blank space or minimal content. It should immediately communicate the value proposition and engage the user with both visual and interactive elements.

DO NOT create a hero section with just a headline, subtitle, and button on a plain background. This is insufficient and will be rejected.

CRITICAL TEXT CONTRAST REQUIREMENTS:
- ALWAYS use dark text (black or dark gray) on light backgrounds
- ALWAYS use light text (white or light gray) on dark backgrounds
- If using colored backgrounds, ensure text has sufficient contrast
- When in doubt, add a semi-transparent overlay to improve text readability
- Test all text for a minimum contrast ratio of 4.5:1
- NEVER use white or light-colored text on light backgrounds
- NEVER use black or dark-colored text on dark backgrounds`
}
