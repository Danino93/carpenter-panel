import { createClient } from '@supabase/supabase-js'
import { Job, JobInput, JobResult } from '../calculators/types'
import { PricingConfig } from './storage'

// בדיקה אם יש משתני סביבה
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// יצירת client רק אם יש הגדרות
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true, // שמירת session גם אחרי רענון
        autoRefreshToken: true, // רענון אוטומטי של token
      },
    })
  : null

export const isSupabaseAvailable = () => !!supabase

// ===== Jobs =====
export async function saveJobToSupabase(job: Job): Promise<Job | null> {
  if (!supabase) return null

  try {
    // קבלת המשתמש הנוכחי
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.error('No user logged in')
      return null
    }

    const { data, error } = await supabase
      .from('jobs')
      .upsert({
        id: job.id,
        user_id: user.id,
        project_type: job.projectType,
        title: job.title,
        customer_name: job.customerName || null,
        width_cm: job.widthCm,
        depth_cm: job.depthCm,
        height_cm: job.heightCm,
        material: job.material,
        thickness_mm: job.thicknessMm,
        drawers: job.drawers,
        doors: job.doors,
        include_back_panel: job.includeBackPanel,
        include_edge_banding: job.includeEdgeBanding,
        labor_hours: job.laborHours,
        notes: job.notes || null,
        status: job.status,
        result: job.result || null,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving job to Supabase:', error)
      return null
    }

    return mapSupabaseJobToJob(data)
  } catch (err) {
    console.error('Error saving job:', err)
    return null
  }
}

export async function getAllJobsFromSupabase(): Promise<Job[]> {
  if (!supabase) return []

  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching jobs from Supabase:', error)
      return []
    }

    return (data || []).map(mapSupabaseJobToJob)
  } catch (err) {
    console.error('Error fetching jobs:', err)
    return []
  }
}

export async function getJobByIdFromSupabase(id: string): Promise<Job | null> {
  if (!supabase) return null

  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching job from Supabase:', error)
      return null
    }

    return mapSupabaseJobToJob(data)
  } catch (err) {
    console.error('Error fetching job:', err)
    return null
  }
}

export async function deleteJobFromSupabase(id: string): Promise<boolean> {
  if (!supabase) return false

  try {
    const { error } = await supabase.from('jobs').delete().eq('id', id)

    if (error) {
      console.error('Error deleting job from Supabase:', error)
      return false
    }

    return true
  } catch (err) {
    console.error('Error deleting job:', err)
    return false
  }
}

function mapSupabaseJobToJob(data: any): Job {
  return {
    id: data.id,
    projectType: data.project_type,
    title: data.title,
    customerName: data.customer_name,
    widthCm: data.width_cm,
    depthCm: data.depth_cm,
    heightCm: data.height_cm,
    material: data.material,
    thicknessMm: data.thickness_mm,
    drawers: data.drawers,
    doors: data.doors,
    includeBackPanel: data.include_back_panel,
    includeEdgeBanding: data.include_edge_banding,
    laborHours: data.labor_hours,
    notes: data.notes,
    status: data.status,
    createdAt: new Date(data.created_at).getTime(),
    updatedAt: new Date(data.updated_at).getTime(),
    result: data.result as JobResult | undefined,
  }
}

// ===== Pricing =====
export async function savePricingToSupabase(pricing: PricingConfig): Promise<boolean> {
  if (!supabase) return false

  try {
    const { error } = await supabase
      .from('pricing_configs')
      .upsert({
        panel_prices: pricing.panelPrices,
        edge_band_price: pricing.edgeBandPrice,
        drawer_slides_price: pricing.drawerSlidesPrice,
        handle_price: pricing.handlePrice,
        hinge_price: pricing.hingePrice,
        screw_box_price: pricing.screwBoxPrice,
        labor_price_per_hour: pricing.laborPricePerHour,
        default_profit_multiplier: pricing.defaultProfitMultiplier,
        updated_at: new Date().toISOString(),
      })

    if (error) {
      console.error('Error saving pricing to Supabase:', error)
      return false
    }

    return true
  } catch (err) {
    console.error('Error saving pricing:', err)
    return false
  }
}

export async function getPricingFromSupabase(): Promise<PricingConfig | null> {
  if (!supabase) return null

  try {
    const { data, error } = await supabase
      .from('pricing_configs')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error('Error fetching pricing from Supabase:', error)
      return null
    }

    return {
      panelPrices: data.panel_prices,
      edgeBandPrice: data.edge_band_price,
      drawerSlidesPrice: data.drawer_slides_price,
      handlePrice: data.handle_price,
      hingePrice: data.hinge_price,
      screwBoxPrice: data.screw_box_price,
      laborPricePerHour: data.labor_price_per_hour,
      defaultProfitMultiplier: data.default_profit_multiplier,
    }
  } catch (err) {
    console.error('Error fetching pricing:', err)
    return null
  }
}

