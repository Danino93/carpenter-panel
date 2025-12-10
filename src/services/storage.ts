import { Job, JobInput, JobResult, MaterialType } from '../calculators/types'
import {
  isSupabaseAvailable,
  saveJobToSupabase,
  getAllJobsFromSupabase,
  getJobByIdFromSupabase,
  deleteJobFromSupabase,
} from './supabase'

const STORAGE_KEYS = {
  JOBS: 'carpenter_panel_jobs',
  PRICING: 'carpenter_panel_pricing',
  SETTINGS: 'carpenter_panel_settings',
} as const

// ===== Jobs Storage =====
// שמירה רק ב-Supabase - לא ב-LocalStorage (יותר טוב למובייל)
export async function saveJob(job: Job): Promise<void> {
  if (!isSupabaseAvailable()) {
    throw new Error('Supabase לא מוגדר. אנא הגדר VITE_SUPABASE_URL ו-VITE_SUPABASE_ANON_KEY')
  }
  
  // שמירה רק ב-Supabase
  const saved = await saveJobToSupabase(job)
  if (!saved) {
    throw new Error('שגיאה בשמירת העבודה. בדוק את החיבור ל-Supabase')
  }
}

function saveJobToLocalStorage(job: Job): void {
  const jobs = getAllJobsFromLocalStorage()
  const existingIndex = jobs.findIndex((j) => j.id === job.id)
  
  if (existingIndex >= 0) {
    jobs[existingIndex] = { ...job, updatedAt: Date.now() }
  } else {
    jobs.push({ ...job, updatedAt: Date.now() })
  }
  
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs))
}

export async function getAllJobs(): Promise<Job[]> {
  if (!isSupabaseAvailable()) {
    throw new Error('Supabase לא מוגדר. אנא הגדר VITE_SUPABASE_URL ו-VITE_SUPABASE_ANON_KEY')
  }
  
  // קריאה רק מ-Supabase
  return await getAllJobsFromSupabase()
}

function getAllJobsFromLocalStorage(): Job[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.JOBS)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export async function getJobById(id: string): Promise<Job | null> {
  if (isSupabaseAvailable()) {
    const job = await getJobByIdFromSupabase(id)
    if (job) return job
  }
  
  // Fallback ל-LocalStorage
  const jobs = getAllJobsFromLocalStorage()
  return jobs.find((j) => j.id === id) || null
}

export async function deleteJob(id: string): Promise<void> {
  if (!isSupabaseAvailable()) {
    throw new Error('Supabase לא מוגדר. אנא הגדר VITE_SUPABASE_URL ו-VITE_SUPABASE_ANON_KEY')
  }
  
  // מחיקה רק מ-Supabase
  await deleteJobFromSupabase(id)
}

export function createJobFromInput(input: JobInput, result?: JobResult): Job {
  return {
    ...input,
    id: generateId(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    status: 'draft',
    result,
  }
}

function generateId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// ===== Pricing Storage =====
export interface PricingConfig {
  panels?: Record<MaterialType, number>
  edgeBand?: number
  drawerSlides?: number
  handle?: number
  hinge?: number
  screws?: number
  labor?: number
  glue?: number
  varnish?: number
  paint?: number
  sandpaper?: number
  // Legacy support
  panelPrices?: Record<string, number>
  edgeBandPrice?: number
  drawerSlidesPrice?: number
  handlePrice?: number
  hingePrice?: number
  screwBoxPrice?: number
  laborPricePerHour?: number
  defaultProfitMultiplier?: number
}

export function savePricing(pricing: PricingConfig): void {
  localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(pricing))
}

export function getPricing(): PricingConfig | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRICING)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

// ===== Settings Storage =====
export interface AppSettings {
  defaultMaterial: MaterialType
  defaultThickness: number
  defaultLaborHours: number
  wastePercentage: number
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
}

export function getSettings(): AppSettings | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

