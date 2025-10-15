import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo_key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'demo_key'

// Check if we have valid Supabase configuration
const isValidSupabaseUrl = supabaseUrl && supabaseUrl.startsWith('https://') && !supabaseUrl.includes('demo')
const isValidKeys = supabaseAnonKey && !supabaseAnonKey.includes('demo') && supabaseServiceKey && !supabaseServiceKey.includes('demo')

// Create clients with fallback handling
export const supabase = createClient(
  isValidSupabaseUrl ? supabaseUrl : 'https://placeholder.supabase.co', 
  isValidKeys ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
)

// Service role client for admin operations
export const supabaseAdmin = createClient(
  isValidSupabaseUrl ? supabaseUrl : 'https://placeholder.supabase.co',
  isValidKeys ? supabaseServiceKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

)

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => isValidSupabaseUrl && isValidKeys

// Database types
export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  stripe_customer_id?: string
  wallet_address?: string
  subscription_status: string
  subscription_plan?: string
  subscription_end_date?: string
  total_spent: number
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  name: string
  description?: string
  category: string
  price_type: 'one_time' | 'subscription' | 'custom'
  base_price?: number
  currency: string
  features?: any
  is_active: boolean
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  service_id: string
  status: 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled'
  amount: number
  currency: string
  payment_method?: 'stripe' | 'crypto'
  stripe_payment_intent_id?: string
  transaction_hash?: string
  metadata?: any
  created_at: string
  completed_at?: string
}

export interface AuditProject {
  id: string
  order_id: string
  user_id: string
  project_name: string
  contract_address?: string
  github_repo?: string
  audit_type: 'basic' | 'professional' | 'enterprise'
  status: 'submitted' | 'in_progress' | 'completed' | 'delivered'
  findings?: any
  report_url?: string
  created_at: string
  completed_at?: string
}

export interface AcademyEnrollment {
  id: string
  user_id: string
  course_id: string
  order_id?: string
  progress: number
  status: 'enrolled' | 'completed' | 'certificate_issued'
  certificate_url?: string
  enrolled_at: string
  completed_at?: string
}