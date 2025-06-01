// Comprehensive JavaScript patterns for interactive websites

export interface JavaScriptPattern {
  name: string
  description: string
  keywords: string[]
  implementation: string
  bestPractices: string[]
}

export const javascriptPatterns: JavaScriptPattern[] = [
  {
    name: "Smooth Scroll Navigation",
    description: "Smooth scrolling to page sections with active state tracking",
    keywords: ["navigation", "scroll", "menu", "navbar"],
    implementation: `
// Smooth scroll navigation with active state
document.addEventListener('DOMContentLoaded', function() {
  // Smooth scroll for navigation links
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update active state
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });
  
  // Update active state on scroll
  const sections = document.querySelectorAll('section[id]');
  
  function updateActiveLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  
  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink(); // Initial call
});`,
    bestPractices: [
      "Use debouncing for scroll events",
      "Add keyboard navigation support",
      "Ensure accessibility with ARIA attributes",
      "Handle edge cases for mobile devices",
    ],
  },
  {
    name: "Form Validation",
    description: "Comprehensive form validation with real-time feedback",
    keywords: ["form", "validation", "input", "submit", "contact"],
    implementation: `
// Advanced form validation
class FormValidator {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    this.fields = {};
    this.errors = {};
    
    if (this.form) {
      this.init();
    }
  }
  
  init() {
    // Define validation rules
    this.rules = {
      email: {
        required: true,
        pattern: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
        message: 'Please enter a valid email address'
      },
      name: {
        required: true,
        minLength: 2,
        message: 'Name must be at least 2 characters'
      },
      phone: {
        pattern: /^[\\d\\s\\-\\+\$$\$$]+$/,
        message: 'Please enter a valid phone number'
      },
      message: {
        required: true,
        minLength: 10,
        message: 'Message must be at least 10 characters'
      }
    };
    
    // Get all form fields
    this.fields = {
      email: this.form.querySelector('[name="email"]'),
      name: this.form.querySelector('[name="name"]'),
      phone: this.form.querySelector('[name="phone"]'),
      message: this.form.querySelector('[name="message"]')
    };
    
    // Add event listeners
    Object.keys(this.fields).forEach(fieldName => {
      const field = this.fields[fieldName];
      if (field) {
        // Real-time validation
        field.addEventListener('blur', () => this.validateField(fieldName));
        field.addEventListener('input', () => {
          if (this.errors[fieldName]) {
            this.validateField(fieldName);
          }
        });
      }
    });
    
    // Form submission
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }
  
  validateField(fieldName) {
    const field = this.fields[fieldName];
    const rules = this.rules[fieldName];
    
    if (!field || !rules) return true;
    
    const value = field.value.trim();
    let isValid = true;
    
    // Required validation
    if (rules.required && !value) {
      this.showError(fieldName, rules.message || 'This field is required');
      isValid = false;
    }
    // Pattern validation
    else if (rules.pattern && value && !rules.pattern.test(value)) {
      this.showError(fieldName, rules.message);
      isValid = false;
    }
    // Min length validation
    else if (rules.minLength && value.length < rules.minLength) {
      this.showError(fieldName, rules.message);
      isValid = false;
    }
    else {
      this.clearError(fieldName);
    }
    
    return isValid;
  }
  
  showError(fieldName, message) {
    const field = this.fields[fieldName];
    const errorElement = this.form.querySelector(\`[data-error="\${fieldName}"]\`);
    
    this.errors[fieldName] = message;
    field.classList.add('error');
    
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  }
  
  clearError(fieldName) {
    const field = this.fields[fieldName];
    const errorElement = this.form.querySelector(\`[data-error="\${fieldName}"]\`);
    
    delete this.errors[fieldName];
    field.classList.remove('error');
    
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
  }
  
  validateAll() {
    let isValid = true;
    
    Object.keys(this.fields).forEach(fieldName => {
      if (!this.validateField(fieldName)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  handleSubmit(e) {
    e.preventDefault();
    
    if (this.validateAll()) {
      // Show loading state
      const submitBtn = this.form.querySelector('[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      
      // Simulate form submission
      setTimeout(() => {
        // Show success message
        this.form.innerHTML = \`
          <div class="success-message">
            <svg class="success-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
            <h3>Thank you!</h3>
            <p>Your message has been sent successfully.</p>
          </div>
        \`;
      }, 1500);
    }
  }
}

// Initialize form validation
new FormValidator('#contact-form');`,
    bestPractices: [
      "Provide immediate visual feedback",
      "Use appropriate input types",
      "Add loading states during submission",
      "Implement proper error handling",
      "Ensure accessibility with ARIA labels",
    ],
  },
  {
    name: "Interactive Image Gallery",
    description: "Responsive image gallery with lightbox and filtering",
    keywords: ["gallery", "images", "photos", "portfolio", "showcase", "filter"],
    implementation: `
// Interactive image gallery with lightbox
class ImageGallery {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.images = [];
    this.currentIndex = 0;
    this.filters = new Set(['all']);
    
    if (this.container) {
      this.init();
    }
  }
  
  init() {
    // Get all gallery items
    this.images = Array.from(this.container.querySelectorAll('.gallery-item'));
    
    // Create lightbox
    this.createLightbox();
    
    // Add click handlers to images
    this.images.forEach((item, index) => {
      item.addEventListener('click', () => this.openLightbox(index));
    });
    
    // Initialize filters
    this.initFilters();
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }
  
  createLightbox() {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = \`
      <div class="lightbox-content">
        <button class="lightbox-close">&times;</button>
        <button class="lightbox-prev">&#8249;</button>
        <button class="lightbox-next">&#8250;</button>
        <img class="lightbox-image" src="/placeholder.svg" alt="">
        <div class="lightbox-caption"></div>
      </div>
    \`;
    
    document.body.appendChild(lightbox);
    this.lightbox = lightbox;
    
    // Event listeners
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => this.closeLightbox());
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => this.prevImage());
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => this.nextImage());
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) this.closeLightbox();
    });
  }
  
  openLightbox(index) {
    this.currentIndex = index;
    this.updateLightboxImage();
    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  closeLightbox() {
    this.lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  updateLightboxImage() {
    const item = this.images[this.currentIndex];
    const img = item.querySelector('img');
    const lightboxImg = this.lightbox.querySelector('.lightbox-image');
    const caption = this.lightbox.querySelector('.lightbox-caption');
    
    lightboxImg.src = img.dataset.fullsize || img.src;
    lightboxImg.alt = img.alt;
    caption.textContent = img.alt || '';
    
    // Update navigation buttons
    const prevBtn = this.lightbox.querySelector('.lightbox-prev');
    const nextBtn = this.lightbox.querySelector('.lightbox-next');
    
    prevBtn.style.display = this.currentIndex === 0 ? 'none' : 'block';
    nextBtn.style.display = this.currentIndex === this.images.length - 1 ? 'none' : 'block';
  }
  
  prevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateLightboxImage();
    }
  }
  
  nextImage() {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
      this.updateLightboxImage();
    }
  }
  
  handleKeyboard(e) {
    if (!this.lightbox.classList.contains('active')) return;
    
    switch(e.key) {
      case 'Escape':
        this.closeLightbox();
        break;
      case 'ArrowLeft':
        this.prevImage();
        break;
      case 'ArrowRight':
        this.nextImage();
        break;
    }
  }
  
  initFilters() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        
        // Update active state
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter images
        this.filterImages(filter);
      });
    });
  }
  
  filterImages(filter) {
    this.images.forEach(item => {
      const categories = item.dataset.category?.split(' ') || [];
      
      if (filter === 'all' || categories.includes(filter)) {
        item.style.display = '';
        setTimeout(() => item.classList.add('show'), 10);
      } else {
        item.classList.remove('show');
        setTimeout(() => item.style.display = 'none', 300);
      }
    });
  }
}

// Initialize gallery
new ImageGallery('.image-gallery');`,
    bestPractices: [
      "Lazy load images for performance",
      "Add touch gestures for mobile",
      "Implement proper keyboard navigation",
      "Ensure images are optimized",
      "Add loading indicators",
    ],
  },
  {
    name: "Dynamic Shopping Cart",
    description: "Full-featured shopping cart with localStorage persistence",
    keywords: ["cart", "shopping", "ecommerce", "store", "products"],
    implementation: `
// Shopping cart functionality
class ShoppingCart {
  constructor() {
    this.items = [];
    this.total = 0;
    this.cartElement = document.querySelector('.cart');
    this.cartCount = document.querySelector('.cart-count');
    this.cartItems = document.querySelector('.cart-items');
    this.cartTotal = document.querySelector('.cart-total');
    
    this.init();
  }
  
  init() {
    // Load cart from localStorage
    this.loadCart();
    
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', (e) => this.handleAddToCart(e));
    });
    
    // Cart toggle
    document.querySelector('.cart-toggle')?.addEventListener('click', () => {
      this.cartElement.classList.toggle('open');
    });
    
    // Close cart
    document.querySelector('.cart-close')?.addEventListener('click', () => {
      this.cartElement.classList.remove('open');
    });
    
    // Update UI
    this.updateCart();
  }
  
  handleAddToCart(e) {
    const button = e.target;
    const product = button.closest('.product');
    
    const item = {
      id: product.dataset.id,
      name: product.querySelector('.product-name').textContent,
      price: parseFloat(product.dataset.price),
      image: product.querySelector('img').src,
      quantity: 1
    };
    
    this.addItem(item);
    
    // Show feedback
    this.showAddedFeedback(button);
  }
  
  addItem(item) {
    const existingItem = this.items.find(i => i.id === item.id);
    
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.items.push(item);
    }
    
    this.saveCart();
    this.updateCart();
    
    // Open cart
    this.cartElement.classList.add('open');
  }
  
  removeItem(id) {
    this.items = this.items.filter(item => item.id !== id);
    this.saveCart();
    this.updateCart();
  }
  
  updateQuantity(id, quantity) {
    const item = this.items.find(i => i.id === id);
    
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.saveCart();
      this.updateCart();
    }
  }
  
  updateCart() {
    // Update cart count
    const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.cartCount.textContent = totalItems;
    
    // Update cart items
    this.cartItems.innerHTML = this.items.map(item => \`
      <div class="cart-item" data-id="\${item.id}">
        <img src="\${item.image}" alt="\${item.name}">
        <div class="cart-item-details">
          <h4>\${item.name}</h4>
          <p class="cart-item-price">$\${item.price.toFixed(2)}</p>
        </div>
        <div class="cart-item-quantity">
          <button class="quantity-btn minus" data-id="\${item.id}">-</button>
          <input type="number" value="\${item.quantity}" min="1" data-id="\${item.id}">
          <button class="quantity-btn plus" data-id="\${item.id}">+</button>
        </div>
        <button class="cart-item-remove" data-id="\${item.id}">&times;</button>
      </div>
    \`).join('');
    
    // Calculate total
    this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.cartTotal.textContent = \`$\${this.total.toFixed(2)}\`;
    
    // Add event listeners to new elements
    this.cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', (e) => this.removeItem(e.target.dataset.id));
    });
    
    this.cartItems.querySelectorAll('.quantity-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const input = this.cartItems.querySelector(\`input[data-id="\${id}"]\`);
        const currentValue = parseInt(input.value);
        
        if (btn.classList.contains('plus')) {
          this.updateQuantity(id, currentValue + 1);
        } else {
          this.updateQuantity(id, currentValue - 1);
        }
      });
    });
    
    this.cartItems.querySelectorAll('input[type="number"]').forEach(input => {
      input.addEventListener('change', (e) => {
        this.updateQuantity(e.target.dataset.id, parseInt(e.target.value));
      });
    });
  }
  
  showAddedFeedback(button) {
    const originalText = button.textContent;
    button.textContent = 'Added!';
    button.classList.add('added');
    
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('added');
    }, 2000);
  }
  
  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }
  
  loadCart() {
    const saved = localStorage.getItem('cart');
    if (saved) {
      this.items = JSON.parse(saved);
    }
  }
}

// Initialize cart
new ShoppingCart();`,
    bestPractices: [
      "Persist cart data in localStorage",
      "Add quantity validation",
      "Implement proper price formatting",
      "Add loading states for async operations",
      "Handle edge cases (empty cart, etc.)",
    ],
  },
  {
    name: "Animated Counters",
    description: "Number counters that animate when scrolled into view",
    keywords: ["counter", "statistics", "numbers", "animation", "stats"],
    implementation: `
// Animated counter functionality
class AnimatedCounter {
  constructor(element) {
    this.element = element;
    this.target = parseInt(element.dataset.target) || 0;
    this.duration = parseInt(element.dataset.duration) || 2000;
    this.prefix = element.dataset.prefix || '';
    this.suffix = element.dataset.suffix || '';
    this.hasAnimated = false;
    
    this.init();
  }
  
  init() {
    // Set initial value
    this.element.textContent = this.prefix + '0' + this.suffix;
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.animate();
          this.hasAnimated = true;
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(this.element);
  }
  
  animate() {
    const start = 0;
    const increment = this.target / (this.duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      
      if (current >= this.target) {
        current = this.target;
        clearInterval(timer);
      }
      
      // Format number with commas
      const formatted = Math.floor(current).toLocaleString();
      this.element.textContent = this.prefix + formatted + this.suffix;
    }, 16);
  }
}

// Initialize all counters
document.querySelectorAll('[data-counter]').forEach(counter => {
  new AnimatedCounter(counter);
});`,
    bestPractices: [
      "Use Intersection Observer for performance",
      "Add easing functions for smooth animation",
      "Format numbers appropriately",
      "Consider reduced motion preferences",
    ],
  },
  {
    name: "Tab Component",
    description: "Accessible tab component with keyboard navigation",
    keywords: ["tabs", "tabbed", "content", "sections"],
    implementation: `
// Tab component with accessibility
class TabComponent {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;
    
    this.tabs = this.container.querySelectorAll('[role="tab"]');
    this.panels = this.container.querySelectorAll('[role="tabpanel"]');
    this.activeIndex = 0;
    
    this.init();
  }
  
  init() {
    // Set initial ARIA attributes
    this.tabs.forEach((tab, index) => {
      tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      tab.setAttribute('tabindex', index === 0 ? '0' : '-1');
      tab.addEventListener('click', () => this.selectTab(index));
    });
    
    // Keyboard navigation
    this.container.addEventListener('keydown', (e) => this.handleKeyboard(e));
    
    // Show first panel
    this.showPanel(0);
  }
  
  selectTab(index) {
    // Update tabs
    this.tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', i === index ? 'true' : 'false');
      tab.setAttribute('tabindex', i === index ? '0' : '-1');
    });
    
    // Update panels
    this.showPanel(index);
    
    // Focus the selected tab
    this.tabs[index].focus();
    
    this.activeIndex = index;
  }
  
  showPanel(index) {
    this.panels.forEach((panel, i) => {
      panel.hidden = i !== index;
    });
  }
  
  handleKeyboard(e) {
    if (!e.target.matches('[role="tab"]')) return;
    
    let newIndex = this.activeIndex;
    
    switch(e.key) {
      case 'ArrowLeft':
        newIndex = this.activeIndex - 1;
        if (newIndex < 0) newIndex = this.tabs.length - 1;
        break;
      case 'ArrowRight':
        newIndex = this.activeIndex + 1;
        if (newIndex >= this.tabs.length) newIndex = 0;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = this.tabs.length - 1;
        break;
      default:
        return;
    }
    
    e.preventDefault();
    this.selectTab(newIndex);
  }
}

// Initialize tabs
new TabComponent('.tabs-container');`,
    bestPractices: [
      "Follow ARIA authoring practices",
      "Implement full keyboard navigation",
      "Ensure proper focus management",
      "Add transition animations",
    ],
  },
  {
    name: "Modal/Popup",
    description: "Accessible modal with focus trap and animations",
    keywords: ["modal", "popup", "dialog", "overlay"],
    implementation: `
// Modal component with accessibility
class Modal {
  constructor(modalSelector) {
    this.modal = document.querySelector(modalSelector);
    if (!this.modal) return;
    
    this.focusableElements = null;
    this.firstFocusable = null;
    this.lastFocusable = null;
    this.previouslyFocused = null;
    
    this.init();
  }
  
  init() {
    // Get all triggers
    const triggers = document.querySelectorAll(\`[data-modal-trigger="\${this.modal.id}"]\`);
    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => this.open());
    });
    
    // Close buttons
    this.modal.querySelectorAll('[data-modal-close]').forEach(btn => {
      btn.addEventListener('click', () => this.close());
    });
    
    // Click outside to close
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }
  
  open() {
    // Store previously focused element
    this.previouslyFocused = document.activeElement;
    
    // Show modal
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Set up focus trap
    this.setupFocusTrap();
    
    // Focus first focusable element
    if (this.firstFocusable) {
      this.firstFocusable.focus();
    }
    
    // Announce to screen readers
    this.modal.setAttribute('aria-hidden', 'false');
  }
  
  close() {
    // Hide modal
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Remove focus trap
    this.removeFocusTrap();
    
    // Restore focus
    if (this.previouslyFocused) {
      this.previouslyFocused.focus();
    }
    
    // Update ARIA
    this.modal.setAttribute('aria-hidden', 'true');
  }
  
  isOpen() {
    return this.modal.classList.contains('active');
  }
  
  setupFocusTrap() {
    // Get all focusable elements
    this.focusableElements = this.modal.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    
    this.firstFocusable = this.focusableElements[0];
    this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];
    
    // Add tab trap
    this.modal.addEventListener('keydown', this.trapFocus);
  }
  
  removeFocusTrap() {
    this.modal.removeEventListener('keydown', this.trapFocus);
  }
  
  trapFocus = (e) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === this.firstFocusable) {
        this.lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      // Tab
      if (document.activeElement === this.lastFocusable) {
        this.firstFocusable.focus();
        e.preventDefault();
      }
    }
  }
}

// Initialize modals
document.querySelectorAll('[role="dialog"]').forEach(modal => {
  new Modal('#' + modal.id);
});`,
    bestPractices: [
      "Implement focus trap for accessibility",
      "Add smooth animations",
      "Ensure keyboard navigation works",
      "Prevent body scroll when open",
      "Announce state changes to screen readers",
    ],
  },
  {
    name: "Accordion/Collapsible",
    description: "Accessible accordion with smooth animations",
    keywords: ["accordion", "collapsible", "faq", "expandable"],
    implementation: `
// Accordion component
class Accordion {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;
    
    this.items = this.container.querySelectorAll('.accordion-item');
    this.allowMultiple = this.container.dataset.multiple === 'true';
    
    this.init();
  }
  
  init() {
    this.items.forEach((item, index) => {
      const trigger = item.querySelector('.accordion-trigger');
      const content = item.querySelector('.accordion-content');
      
      // Set initial ARIA attributes
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-controls', \`panel-\${index}\`);
      content.setAttribute('id', \`panel-\${index}\`);
      
      // Add click handler
      trigger.addEventListener('click', () => this.toggle(item));
      
      // Keyboard support
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggle(item);
        }
      });
    });
  }
  
  toggle(item) {
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';
    
    if (!this.allowMultiple && !isOpen) {
      // Close all other items
      this.items.forEach(otherItem => {
        if (otherItem !== item) {
          this.close(otherItem);
        }
      });
    }
    
    if (isOpen) {
      this.close(item);
    } else {
      this.open(item);
    }
  }
  
  open(item) {
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');
    
    trigger.setAttribute('aria-expanded', 'true');
    item.classList.add('active');
    
    // Animate open
    content.style.height = content.scrollHeight + 'px';
    
    // Remove height after animation
    content.addEventListener('transitionend', function handler() {
      content.style.height = 'auto';
      content.removeEventListener('transitionend', handler);
    });
  }
  
  close(item) {
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');
    
    trigger.setAttribute('aria-expanded', 'false');
    item.classList.remove('active');
    
    // Animate close
    content.style.height = content.scrollHeight + 'px';
    content.offsetHeight; // Force reflow
    content.style.height = '0';
  }
}

// Initialize accordions
new Accordion('.accordion');`,
    bestPractices: [
      "Use semantic HTML and ARIA",
      "Add smooth height animations",
      "Support keyboard navigation",
      "Allow single or multiple open items",
      "Ensure content is accessible when closed",
    ],
  },
  {
    name: "Infinite Scroll",
    description: "Load more content as user scrolls",
    keywords: ["scroll", "infinite", "pagination", "load more"],
    implementation: `
// Infinite scroll implementation
class InfiniteScroll {
  constructor(options) {
    this.container = document.querySelector(options.container);
    this.loader = document.querySelector(options.loader);
    this.endpoint = options.endpoint;
    this.page = 1;
    this.loading = false;
    this.hasMore = true;
    
    this.init();
  }
  
  init() {
    // Create intersection observer for loader
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.loading && this.hasMore) {
          this.loadMore();
        }
      });
    }, { rootMargin: '100px' });
    
    observer.observe(this.loader);
    
    // Load initial content
    this.loadMore();
  }
  
  async loadMore() {
    this.loading = true;
    this.loader.classList.add('active');
    
    try {
      // Simulate API call
      const response = await this.fetchData();
      
      if (response.items.length > 0) {
        this.renderItems(response.items);
        this.page++;
        this.hasMore = response.hasMore;
        
        if (!this.hasMore) {
          this.loader.textContent = 'No more items to load';
          this.loader.classList.add('finished');
        }
      }
    } catch (error) {
      console.error('Error loading more items:', error);
      this.loader.textContent = 'Error loading items. Please try again.';
    } finally {
      this.loading = false;
      this.loader.classList.remove('active');
    }
  }
  
  async fetchData() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock data
    const itemsPerPage = 10;
    const totalItems = 50;
    const startIndex = (this.page - 1) * itemsPerPage;
    
    const items = [];
    for (let i = 0; i < itemsPerPage && startIndex + i < totalItems; i++) {
      items.push({
        id: startIndex + i + 1,
        title: \`Item \${startIndex + i + 1}\`,
        description: \`Description for item \${startIndex + i + 1}\`
      });
    }
    
    return {
      items,
      hasMore: startIndex + itemsPerPage < totalItems
    };
  }
  
  renderItems(items) {
    const fragment = document.createDocumentFragment();
    
    items.forEach(item => {
      const element = document.createElement('div');
      element.className = 'item fade-in';
      element.innerHTML = \`
        <h3>\${item.title}</h3>
        <p>\${item.description}</p>
      \`;
      fragment.appendChild(element);
    });
    
    this.container.appendChild(fragment);
    
    // Trigger fade-in animation
    requestAnimationFrame(() => {
      this.container.querySelectorAll('.item:not(.visible)').forEach(item => {
        item.classList.add('visible');
      });
    });
  }
}

// Initialize infinite scroll
new InfiniteScroll({
  container: '.items-container',
  loader: '.scroll-loader',
  endpoint: '/api/items'
});`,
    bestPractices: [
      "Use Intersection Observer for performance",
      "Add loading indicators",
      "Handle errors gracefully",
      "Implement proper pagination",
      "Consider accessibility implications",
    ],
  },
  {
    name: "Dark Mode Toggle",
    description: "Theme switcher with system preference detection",
    keywords: ["dark", "theme", "toggle", "mode", "light"],
    implementation: `
// Dark mode toggle with system preference
class ThemeToggle {
  constructor() {
    this.toggle = document.querySelector('.theme-toggle');
    this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.currentTheme = this.getSavedTheme() || this.getSystemTheme();
    
    this.init();
  }
  
  init() {
    // Apply initial theme
    this.applyTheme(this.currentTheme);
    
    // Toggle button click
    this.toggle?.addEventListener('click', () => {
      this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      this.applyTheme(this.currentTheme);
      this.saveTheme(this.currentTheme);
    });
    
    // Listen for system theme changes
    this.prefersDark.addEventListener('change', (e) => {
      if (!this.getSavedTheme()) {
        this.currentTheme = e.matches ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
      }
    });
    
    // Keyboard shortcut (Ctrl/Cmd + Shift + D)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        this.toggle?.click();
      }
    });
  }
  
  applyTheme(theme) {
    // Update document
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update toggle button
    if (this.toggle) {
      this.toggle.setAttribute('aria-label', \`Switch to \${theme === 'dark' ? 'light' : 'dark'} mode\`);
      this.toggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    }
    
    // Smooth transition
    document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    // Update meta theme color
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.content = theme === 'dark' ? '#1a1a1a' : '#ffffff';
    }
  }
  
  getSystemTheme() {
    return this.prefersDark.matches ? 'dark' : 'light';
  }
  
  getSavedTheme() {
    return localStorage.getItem('theme');
  }
  
  saveTheme(theme) {
    localStorage.setItem('theme', theme);
  }
}

// Initialize theme toggle
new ThemeToggle();

// CSS Variables for theming
const themeStyles = \`
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #333333;
  --text-secondary: #666666;
  --border-color: #e0e0e0;
}

[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2a2a2a;
  --text-primary: #ffffff;
  --text-secondary: #cccccc;
  --border-color: #404040;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}
\`;`,
    bestPractices: [
      "Respect system preferences",
      "Save user preference",
      "Add smooth transitions",
      "Update meta theme color",
      "Provide keyboard shortcuts",
    ],
  },
]

// Helper function to detect required JavaScript features
export function detectRequiredFeatures(prompt: string): string[] {
  const promptLower = prompt.toLowerCase()
  const detectedFeatures: string[] = []

  javascriptPatterns.forEach((pattern) => {
    const hasKeyword = pattern.keywords.some((keyword) => promptLower.includes(keyword))
    if (hasKeyword) {
      detectedFeatures.push(pattern.name)
    }
  })

  return detectedFeatures
}

// Get implementation code for specific features
export function getFeatureImplementation(featureName: string): string {
  const pattern = javascriptPatterns.find((p) => p.name === featureName)
  return pattern ? pattern.implementation : ""
}

// Get all feature names
export function getAllFeatureNames(): string[] {
  return javascriptPatterns.map((p) => p.name)
}
