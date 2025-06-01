import type { WebsiteTemplate } from "./types"
import { websiteTemplates } from "./templates-data"

// Function to get template by ID
export function getTemplate(templateId: string): WebsiteTemplate | undefined {
  return websiteTemplates.find((t) => t.id === templateId)
}

// Function to get templates by category
export function getTemplatesByCategory(category: string): WebsiteTemplate[] {
  return websiteTemplates.filter((t) => t.category === category)
}

// Function to get all templates
export function getAllTemplates(): WebsiteTemplate[] {
  return websiteTemplates
}

// Function to get template categories
export function getTemplateCategories(): string[] {
  return [...new Set(websiteTemplates.map((t) => t.category))]
}

// Function to search templates by keyword
export function searchTemplates(keyword: string): WebsiteTemplate[] {
  const searchTerm = keyword.toLowerCase()
  return websiteTemplates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm) ||
      t.description.toLowerCase().includes(searchTerm) ||
      t.category.toLowerCase().includes(searchTerm),
  )
}
