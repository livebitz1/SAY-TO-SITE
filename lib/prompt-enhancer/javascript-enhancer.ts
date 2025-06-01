// Enhanced JavaScript patterns and best practices for superior code generation

export function enhanceJavaScriptPrompt(userPrompt: string, detectedFeatures: string[], templateId?: string): string {
  // Create a more sophisticated prompt for JavaScript generation
  return `
## ADVANCED JAVASCRIPT IMPLEMENTATION REQUIREMENTS

Your generated JavaScript code MUST follow these professional standards:

### Architecture & Organization
- Use modern ES6+ syntax and features throughout
- Implement proper module pattern with clear separation of concerns
- Create reusable utility functions for common operations
- Use classes for complex components with proper inheritance
- Implement proper event delegation for performance
- Use the revealing module pattern for encapsulation
- Implement proper error boundaries and fallbacks

### Performance Optimization
- Use efficient DOM manipulation techniques (DocumentFragment, etc.)
- Implement proper debouncing and throttling for scroll/resize events
- Use IntersectionObserver for lazy loading and scroll effects
- Implement proper memory management and garbage collection
- Use requestAnimationFrame for animations
- Implement proper asset loading strategies
- Use Web Workers for CPU-intensive tasks

### Advanced Features
- Implement smooth animations with GSAP or CSS transitions
- Create responsive interactions that work across all devices
- Implement proper form validation with detailed error messages
- Create accessible components following WCAG 2.1 AA standards
- Implement proper keyboard navigation for all interactive elements
- Use proper focus management for modals and dialogs
- Implement proper touch interactions for mobile

### Code Quality
- Add comprehensive error handling with try/catch blocks
- Implement proper logging and debugging capabilities
- Use consistent naming conventions (camelCase for variables/functions)
- Add detailed comments explaining complex logic
- Implement proper type checking and validation
- Use proper async/await patterns with error handling
- Implement proper state management for UI components

### Security
- Implement proper input sanitization for all user inputs
- Use proper CSRF protection for forms
- Implement proper content security policies
- Use secure storage methods for sensitive data
- Implement proper authentication and authorization checks
- Use proper CORS handling for API requests
- Implement proper XSS protection

### Testing & Maintenance
- Make code testable with clear inputs and outputs
- Implement proper feature detection for browser compatibility
- Add proper fallbacks for unsupported features
- Use proper versioning for APIs and components
- Implement proper logging for debugging
- Add comprehensive documentation for all functions
- Use proper error messages for debugging

### Specific Features to Implement
${detectedFeatures
  .map(
    (feature) => `
- ${feature} with full functionality and error handling
  - Implement responsive design for all screen sizes
  - Add proper keyboard accessibility
  - Include loading states and error handling
  - Add proper animations and transitions
  - Implement proper state management
  - Add comprehensive validation and error messages`,
  )
  .join("\n")}

Remember: Your JavaScript code should be PRODUCTION-READY, FULLY FUNCTIONAL, and PROFESSIONAL QUALITY. Do not create minimal implementations or placeholders.
`
}
