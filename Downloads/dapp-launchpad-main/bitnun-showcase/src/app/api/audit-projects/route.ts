import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: auditProjects, error } = await supabase
      .from('audit_projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Audit projects fetch error:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch audit projects' 
      }, { status: 500 })
    }

    return NextResponse.json({ auditProjects: auditProjects || [] })
  } catch (error) {
    console.error('Audit projects API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, contract_address, github_url, description, user_id } = body

    const { data: auditProject, error } = await supabase
      .from('audit_projects')
      .insert([
        {
          user_id: user_id || 'demo-user',
          name,
          contract_address,
          github_url,
          description,
          status: 'pending',
          created_at: new Date().toISOString(),
          severity_critical: 0,
          severity_high: 0,
          severity_medium: 0,
          severity_low: 0
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Audit project creation error:', error)
      return NextResponse.json({ 
        error: 'Failed to create audit project' 
      }, { status: 500 })
    }

    return NextResponse.json({ auditProject })
  } catch (error) {
    console.error('Audit projects POST API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}