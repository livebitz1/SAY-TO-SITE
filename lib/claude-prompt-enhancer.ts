// Claude Prompt Enhancer - Templates and Best Practices for High-Quality Website Generation

export interface WebsiteTemplate {
  id: string
  name: string
  category: string
  description: string
  structure: {
    sections: string[]
    features: string[]
    designPrinciples: string[]
  }
  codePatterns: {
    html: string[]
    css: string[]
    javascript: string[]
  }
  bestPractices: string[]
  examplePrompt: string
}

// Define high-quality website templates
export const websiteTemplates: WebsiteTemplate[] = [
  {
    id: "modern-portfolio",
    name: "Modern Portfolio",
    category: "portfolio",
    description: "A sleek, professional portfolio website with smooth animations and modern design",
    structure: {
      sections: [
        "Hero section with animated text and CTA",
        "About section with skills grid",
        "Projects showcase with filtering",
        "Experience timeline",
        "Contact form with validation",
        "Footer with social links",
      ],
      features: [
        "Smooth scroll navigation",
        "Dark/light mode toggle",
        "Responsive grid layouts",
        "Intersection Observer animations",
        "Form validation",
        "Mobile-first design",
      ],
      designPrinciples: [
        "Minimalist design with focus on content",
        "High contrast for readability",
        "Consistent spacing using 8px grid",
        "Typography hierarchy with 3 font sizes max",
        "Accent color for CTAs and highlights",
        "Subtle animations on scroll",
      ],
    },
    codePatterns: {
      html: [
        "Semantic HTML5 structure",
        "ARIA labels for accessibility",
        "Meta tags for SEO",
        "Structured data markup",
        "Progressive enhancement",
      ],
      css: [
        "CSS Grid for layouts",
        "CSS custom properties for theming",
        "Clamp() for responsive typography",
        "Container queries where applicable",
        "Smooth transitions and transforms",
        "Mobile-first media queries",
      ],
      javascript: [
        "Intersection Observer for animations",
        "Event delegation for performance",
        "Debounced scroll events",
        "Form validation with regex",
        "LocalStorage for theme preference",
        "Lazy loading for images",
      ],
    },
    bestPractices: [
      "Performance: Optimize images, minify code, lazy load",
      "Accessibility: WCAG 2.1 AA compliance",
      "SEO: Meta tags, structured data, semantic HTML",
      "Security: Input sanitization, HTTPS",
      "UX: Fast load times, smooth interactions",
    ],
    examplePrompt:
      "Create a modern portfolio website for a software developer with hero section, projects showcase, skills grid, and contact form",
  },
  {
    id: "saas-landing",
    name: "SaaS Landing Page",
    category: "landing",
    description: "High-converting SaaS landing page with compelling copy and clear CTAs",
    structure: {
      sections: [
        "Navigation with sticky header",
        "Hero with value proposition",
        "Features grid with icons",
        "Benefits section with testimonials",
        "Pricing table with toggle",
        "FAQ accordion",
        "CTA section",
        "Footer with links",
      ],
      features: [
        "Sticky navigation on scroll",
        "Animated statistics counters",
        "Interactive pricing calculator",
        "Testimonial carousel",
        "FAQ accordion",
        "Newsletter signup",
        "Social proof elements",
      ],
      designPrinciples: [
        "Clear visual hierarchy",
        "Consistent brand colors",
        "Whitespace for clarity",
        "F-pattern layout",
        "Contrast for CTAs",
        "Trust signals throughout",
      ],
    },
    codePatterns: {
      html: [
        "Schema markup for business",
        "Microdata for reviews",
        "Form elements with labels",
        "Button hierarchy (primary/secondary)",
        "Loading states for forms",
      ],
      css: [
        "CSS Grid for pricing tables",
        "Flexbox for navigation",
        "Backdrop filters for depth",
        "Gradient overlays",
        "Box shadows for elevation",
        "Hover states for interactivity",
      ],
      javascript: [
        "Smooth scroll to sections",
        "Pricing toggle functionality",
        "Form submission handling",
        "Analytics event tracking",
        "Countdown timers for urgency",
        "Exit intent popups",
      ],
    },
    bestPractices: [
      "Conversion: Clear CTAs, social proof, urgency",
      "Performance: Critical CSS, async scripts",
      "Trust: Security badges, testimonials, guarantees",
      "Mobile: Touch-friendly buttons, readable text",
      "Analytics: Event tracking, conversion goals",
    ],
    examplePrompt:
      "Create a SaaS landing page for a project management tool with hero section, features grid, pricing table, testimonials, and FAQ",
  },
  {
    id: "ecommerce-store",
    name: "E-commerce Store",
    category: "ecommerce",
    description: "Modern e-commerce website with product grid, cart functionality, and checkout flow",
    structure: {
      sections: [
        "Header with search and cart",
        "Hero banner with promotions",
        "Featured products carousel",
        "Product categories grid",
        "Product listing with filters",
        "Product detail pages",
        "Shopping cart sidebar",
        "Checkout process",
        "Footer with policies",
      ],
      features: [
        "Product search with filters",
        "Shopping cart with localStorage",
        "Product image galleries",
        "Size/color selectors",
        "Wishlist functionality",
        "Quick view modals",
        "Related products",
        "Reviews and ratings",
      ],
      designPrinciples: [
        "Product-focused design",
        "Clear pricing display",
        "Trust badges visible",
        "Easy navigation",
        "Mobile shopping optimized",
        "Fast image loading",
      ],
    },
    codePatterns: {
      html: [
        "Product schema markup",
        "Breadcrumb navigation",
        "Image alt texts for SEO",
        "Form validation messages",
        "Loading skeletons",
      ],
      css: [
        "Grid layouts for products",
        "Aspect ratio boxes for images",
        "Custom select dropdowns",
        "Progress indicators",
        "Toast notifications",
        "Modal overlays",
      ],
      javascript: [
        "Cart state management",
        "Product filtering logic",
        "Image zoom functionality",
        "Add to cart animations",
        "Quantity selectors",
        "Price calculations",
      ],
    },
    bestPractices: [
      "UX: Easy checkout, clear CTAs, product info",
      "Performance: Image optimization, lazy loading",
      "Trust: Secure badges, return policy, reviews",
      "Mobile: Touch gestures, mobile payments",
      "SEO: Product schema, meta descriptions",
    ],
    examplePrompt:
      "Create an e-commerce website for a clothing store with product grid, filters, shopping cart, and modern design",
  },
  {
    id: "restaurant-website",
    name: "Restaurant Website",
    category: "hospitality",
    description: "Elegant restaurant website with menu, reservations, and ambiance showcase",
    structure: {
      sections: [
        "Hero with restaurant imagery",
        "About section with story",
        "Menu with categories",
        "Gallery of dishes/ambiance",
        "Reservation form",
        "Location with map",
        "Hours and contact",
        "Reviews section",
      ],
      features: [
        "Interactive menu with prices",
        "Table reservation system",
        "Image gallery with lightbox",
        "Google Maps integration",
        "Social media feeds",
        "Special offers banner",
        "Newsletter signup",
      ],
      designPrinciples: [
        "Appetizing food photography",
        "Elegant typography",
        "Warm color palette",
        "Easy-to-read menus",
        "Mobile-friendly design",
        "Fast loading images",
      ],
    },
    codePatterns: {
      html: [
        "Restaurant schema markup",
        "Menu structured data",
        "Reservation form fields",
        "Address microformat",
        "Image galleries",
      ],
      css: [
        "Parallax scrolling effects",
        "Menu card designs",
        "Image hover effects",
        "Responsive tables",
        "Print styles for menus",
        "Custom fonts for branding",
      ],
      javascript: [
        "Reservation form validation",
        "Gallery lightbox",
        "Smooth scroll navigation",
        "Menu filtering",
        "Map initialization",
        "Opening hours display",
      ],
    },
    bestPractices: [
      "Local SEO: Schema markup, Google My Business",
      "Mobile: Click-to-call, easy navigation",
      "Performance: Optimized images, fast load",
      "Accessibility: Screen reader friendly menus",
      "Conversion: Clear CTAs for reservations",
    ],
    examplePrompt:
      "Create a restaurant website with elegant design, menu display, reservation system, gallery, and location information",
  },
  {
    id: "corporate-business",
    name: "Corporate Business",
    category: "business",
    description: "Professional corporate website with services, team, and company information",
    structure: {
      sections: [
        "Professional header with logo",
        "Hero with company message",
        "Services/solutions grid",
        "About company section",
        "Team members showcase",
        "Client logos/testimonials",
        "Case studies",
        "Contact information",
        "Footer with sitemap",
      ],
      features: [
        "Multi-level navigation",
        "Service detail pages",
        "Team member profiles",
        "Case study layouts",
        "Contact forms",
        "Office locations",
        "Career opportunities",
        "News/blog section",
      ],
      designPrinciples: [
        "Professional color scheme",
        "Clean, corporate design",
        "Trustworthy appearance",
        "Clear information hierarchy",
        "Consistent branding",
        "Accessible design",
      ],
    },
    codePatterns: {
      html: [
        "Organization schema markup",
        "Breadcrumb navigation",
        "Contact information markup",
        "Team member cards",
        "Service descriptions",
      ],
      css: [
        "Corporate color variables",
        "Professional typography",
        "Card-based layouts",
        "Hover effects for links",
        "Responsive tables",
        "Print-friendly styles",
      ],
      javascript: [
        "Multi-level menu navigation",
        "Form validation and submission",
        "Smooth scroll to sections",
        "Tab interfaces",
        "Accordion for FAQs",
        "Cookie consent banner",
      ],
    },
    bestPractices: [
      "Trust: Professional design, client logos, certifications",
      "SEO: Service pages, location pages, schema markup",
      "Accessibility: WCAG compliance, keyboard navigation",
      "Performance: Optimized assets, caching strategies",
      "Security: SSL, secure forms, privacy policy",
    ],
    examplePrompt:
      "Create a corporate website for a consulting firm with services showcase, team section, case studies, and professional design",
  },
]

// Function to enhance prompts based on templates
export function enhancePromptWithTemplate(userPrompt: string, templateId?: string): string {
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
    return enhanceGenericPrompt(userPrompt)
  }

  // Build enhanced prompt with template guidance
  return `
${userPrompt}

IMPORTANT: Follow this high-quality template structure:

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
10. Create a polished, professional appearance

Generate a complete, production-ready website following these guidelines.`
}

// Generic prompt enhancement for unmatched templates
function enhanceGenericPrompt(userPrompt: string): string {
  return `
${userPrompt}

## General Website Requirements:

### Structure:
- Clean, semantic HTML5 structure
- Logical section organization
- Proper heading hierarchy
- Accessible navigation
- Responsive layout

### Design:
- Modern, professional appearance
- Consistent color scheme
- Clear typography hierarchy
- Appropriate whitespace
- Mobile-first approach

### Functionality:
- Smooth interactions
- Form validation where needed
- Responsive navigation
- Loading states
- Error handling

### Best Practices:
- SEO optimization
- Performance optimization
- Accessibility compliance
- Cross-browser compatibility
- Security considerations

### Code Quality:
- Clean, commented code
- Consistent naming conventions
- Modular CSS organization
- Efficient JavaScript
- Progressive enhancement

Generate a high-quality, production-ready website following modern web development best practices.`
}

// Function to generate template-specific CSS variables
export function generateCSSVariables(templateId: string): string {
  const cssVariables: Record<string, string> = {
    "modern-portfolio": `
      --primary-color: #2563eb;
      --secondary-color: #1e40af;
      --accent-color: #3b82f6;
      --text-primary: #1f2937;
      --text-secondary: #6b7280;
      --bg-primary: #ffffff;
      --bg-secondary: #f9fafb;
      --border-color: #e5e7eb;
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      --radius-sm: 0.375rem;
      --radius-md: 0.5rem;
      --radius-lg: 0.75rem;
      --transition-fast: 150ms ease;
      --transition-base: 200ms ease;
      --transition-slow: 300ms ease;
    `,
    "saas-landing": `
      --primary-color: #8b5cf6;
      --secondary-color: #7c3aed;
      --accent-color: #a78bfa;
      --success-color: #10b981;
      --warning-color: #f59e0b;
      --error-color: #ef4444;
      --text-primary: #111827;
      --text-secondary: #6b7280;
      --bg-primary: #ffffff;
      --bg-secondary: #faf5ff;
      --bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      --border-color: #e5e7eb;
      --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    `,
    "ecommerce-store": `
      --primary-color: #059669;
      --secondary-color: #047857;
      --accent-color: #10b981;
      --sale-color: #dc2626;
      --text-primary: #111827;
      --text-secondary: #6b7280;
      --text-muted: #9ca3af;
      --bg-primary: #ffffff;
      --bg-secondary: #f3f4f6;
      --bg-card: #ffffff;
      --border-color: #e5e7eb;
      --shadow-product: 0 2px 8px rgba(0, 0, 0, 0.08);
      --shadow-hover: 0 8px 16px rgba(0, 0, 0, 0.12);
    `,
    "restaurant-website": `
      --primary-color: #b91c1c;
      --secondary-color: #991b1b;
      --accent-color: #fbbf24;
      --text-primary: #1f2937;
      --text-secondary: #4b5563;
      --text-light: #f9fafb;
      --bg-primary: #ffffff;
      --bg-dark: #111827;
      --bg-warm: #fef3c7;
      --border-color: #e5e7eb;
      --shadow-soft: 0 2px 15px rgba(0, 0, 0, 0.08);
      --shadow-strong: 0 10px 40px rgba(0, 0, 0, 0.15);
    `,
    "corporate-business": `
      --primary-color: #1e40af;
      --secondary-color: #1e3a8a;
      --accent-color: #3b82f6;
      --text-primary: #1f2937;
      --text-secondary: #6b7280;
      --text-muted: #9ca3af;
      --bg-primary: #ffffff;
      --bg-secondary: #f9fafb;
      --bg-accent: #eff6ff;
      --border-color: #e5e7eb;
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    `,
  }

  return cssVariables[templateId] || cssVariables["modern-portfolio"]
}

// Function to generate template-specific meta tags
export function generateMetaTags(templateId: string, businessName = "Your Business"): string {
  const metaTags: Record<string, string> = {
    "modern-portfolio": `
    <meta name="description" content="Professional portfolio of ${businessName}. Showcasing projects, skills, and experience in web development and design.">
    <meta name="keywords" content="portfolio, web developer, designer, projects, skills, ${businessName}">
    <meta property="og:title" content="${businessName} - Professional Portfolio">
    <meta property="og:description" content="Explore my projects, skills, and professional experience.">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${businessName} - Professional Portfolio">
    <meta name="twitter:description" content="Explore my projects, skills, and professional experience.">
    `,
    "saas-landing": `
    <meta name="description" content="${businessName} - The ultimate solution for your business needs. Start your free trial today.">
    <meta name="keywords" content="saas, software, business solution, productivity, ${businessName}">
    <meta property="og:title" content="${businessName} - Transform Your Business">
    <meta property="og:description" content="Discover how ${businessName} can streamline your workflow and boost productivity.">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    `,
    "ecommerce-store": `
    <meta name="description" content="Shop the latest products at ${businessName}. Quality items, great prices, fast shipping.">
    <meta name="keywords" content="online store, shopping, ecommerce, products, ${businessName}">
    <meta property="og:title" content="${businessName} - Online Store">
    <meta property="og:description" content="Discover amazing products at great prices. Shop now!">
    <meta property="og:type" content="website">
    <meta property="product:price:currency" content="USD">
    `,
    "restaurant-website": `
    <meta name="description" content="${businessName} - Exceptional dining experience. View our menu, make reservations, and discover our story.">
    <meta name="keywords" content="restaurant, dining, menu, reservations, food, ${businessName}">
    <meta property="og:title" content="${businessName} - Fine Dining Restaurant">
    <meta property="og:description" content="Experience exceptional cuisine in an elegant atmosphere.">
    <meta property="og:type" content="restaurant">
    <meta property="restaurant:menu" content="menu.html">
    `,
    "corporate-business": `
    <meta name="description" content="${businessName} - Leading provider of professional services. Trusted by businesses worldwide.">
    <meta name="keywords" content="business, corporate, services, consulting, ${businessName}">
    <meta property="og:title" content="${businessName} - Professional Business Services">
    <meta property="og:description" content="Empowering businesses with innovative solutions and expert guidance.">
    <meta property="og:type" content="business.business">
    `,
  }

  return metaTags[templateId] || metaTags["corporate-business"]
}

// Export all template IDs for easy access
export const templateIds = websiteTemplates.map((t) => t.id)

// Function to get template by ID
export function getTemplate(templateId: string): WebsiteTemplate | undefined {
  return websiteTemplates.find((t) => t.id === templateId)
}

// Function to get templates by category
export function getTemplatesByCategory(category: string): WebsiteTemplate[] {
  return websiteTemplates.filter((t) => t.category === category)
}

// Function to generate example code snippets for templates
export function generateTemplateSnippet(templateId: string): string {
  const snippets: Record<string, string> = {
    "modern-portfolio": `
<!-- Hero Section Example -->
<section class="hero">
  <div class="container">
    <h1 class="hero-title animate-fade-in">
      Hi, I'm <span class="text-gradient">John Doe</span>
    </h1>
    <p class="hero-subtitle animate-slide-up">
      Full-Stack Developer & UI/UX Designer
    </p>
    <div class="hero-cta animate-scale-in">
      <a href="#projects" class="btn btn-primary">View My Work</a>
      <a href="#contact" class="btn btn-outline">Get In Touch</a>
    </div>
  </div>
</section>

<style>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
}

.text-gradient {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
    `,
    "saas-landing": `
<!-- Pricing Section Example -->
<section class="pricing">
  <div class="container">
    <h2 class="section-title">Choose Your Plan</h2>
    <div class="pricing-toggle">
      <span>Monthly</span>
      <label class="switch">
        <input type="checkbox" id="billing-toggle">
        <span class="slider"></span>
      </label>
      <span>Annual <span class="badge">Save 20%</span></span>
    </div>
    <div class="pricing-grid">
      <div class="pricing-card">
        <h3>Starter</h3>
        <div class="price">
          <span class="currency">$</span>
          <span class="amount" data-monthly="29" data-annual="279">29</span>
          <span class="period">/month</span>
        </div>
        <ul class="features">
          <li><i class="icon-check"></i> 5 Projects</li>
          <li><i class="icon-check"></i> 10GB Storage</li>
          <li><i class="icon-check"></i> Basic Support</li>
        </ul>
        <button class="btn btn-outline">Start Free Trial</button>
      </div>
    </div>
  </div>
</section>

<script>
// Pricing toggle functionality
document.getElementById('billing-toggle').addEventListener('change', function(e) {
  const amounts = document.querySelectorAll('.amount');
  const period = document.querySelector('.period');
  
  amounts.forEach(amount => {
    const monthly = amount.dataset.monthly;
    const annual = amount.dataset.annual;
    amount.textContent = e.target.checked ? annual : monthly;
  });
  
  period.textContent = e.target.checked ? '/year' : '/month';
});
</script>
    `,
  }

  return snippets[templateId] || ""
}
