import { JobTemplate } from '../types/template'
import { JobInput } from '../calculators/types'

const STORAGE_KEY = 'carpenter_panel_templates'

export function getAllTemplates(): JobTemplate[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveTemplate(template: JobTemplate): void {
  const templates = getAllTemplates()
  const existingIndex = templates.findIndex((t) => t.id === template.id)

  if (existingIndex >= 0) {
    templates[existingIndex] = { ...template, updatedAt: Date.now() }
  } else {
    templates.push({ ...template, updatedAt: Date.now() })
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
}

export function getTemplateById(id: string): JobTemplate | null {
  const templates = getAllTemplates()
  return templates.find((t) => t.id === id) || null
}

export function deleteTemplate(id: string): void {
  const templates = getAllTemplates()
  const filtered = templates.filter((t) => t.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function createTemplateFromJob(
  name: string,
  description: string | undefined,
  jobInput: JobInput
): JobTemplate {
  return {
    id: generateId(),
    name,
    description,
    jobInput,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    usageCount: 0,
  }
}

export function incrementTemplateUsage(id: string): void {
  const template = getTemplateById(id)
  if (template) {
    template.usageCount++
    saveTemplate(template)
  }
}

function generateId(): string {
  return `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

