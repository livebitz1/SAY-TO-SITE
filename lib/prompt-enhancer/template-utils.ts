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
