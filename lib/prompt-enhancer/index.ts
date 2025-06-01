// Central export file for all prompt enhancer modules

// Export types
export type { WebsiteTemplate } from "./types"

// Export template data
export { websiteTemplates, templateIds } from "./templates-data"

// Export prompt enhancement functions
export { enhancePromptWithTemplate, enhanceGenericPrompt } from "./prompt-enhancer"

// Export template utilities
export { generateCSSVariables, generateMetaTags, generateTemplateSnippet } from "./template-utils"

// Export template selector functions
export { getTemplate, getTemplatesByCategory } from "./template-selector"
export { getAllTemplates } from "./template-selector"

// Export JavaScript patterns
export {
  javascriptPatterns,
  detectRequiredFeatures,
  getFeatureImplementation,
  getAllFeatureNames,
} from "./javascript-patterns"

// Export JavaScript enhancer
export { enhanceJavaScriptPrompt, generateJavaScriptValidation } from "./javascript-enhancer"

// Export code requirements
export {
  codeRequirements,
  generateCodeRequirementsPrompt,
  enforceMinimumCodeSize,
  analyzeCodeCompleteness,
} from "./code-requirements"

// Export feature generator
export { comprehensiveFeatures, generateFeatureListPrompt } from "./feature-generator"
