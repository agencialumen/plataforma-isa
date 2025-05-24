import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Tipos para TypeScript
export interface UserSubscription {
  id: string
  user_id: string
  email: string
  subscription_plan: "basic" | "premium" | "diamond"
  payment_id: string
  payment_status: "pending" | "completed" | "failed" | "cancelled"
  payment_amount: number
  payment_date: string
  subscription_status: "active" | "cancelled" | "expired"
  expires_at: string | null
  created_at: string
  updated_at: string
}

export interface UserAnalytics {
  id: string
  user_id: string
  action: string
  page?: string
  metadata?: any
  created_at: string
}
