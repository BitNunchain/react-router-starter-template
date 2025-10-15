import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      projectName, 
      contractAddress, 
      githubRepo, 
      auditType, 
      description,
      orderId 
    } = body

    if (!projectName || !auditType) {
      return NextResponse.json({ 
        error: 'Project name and audit type are required' 
      }, { status: 400 })
    }

    // Get user data
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create audit project
    const { data: auditProject, error: auditError } = await supabase
      .from('audit_projects')
      .insert({
        user_id: userData.id,
        order_id: orderId,
        project_name: projectName,
        contract_address: contractAddress,
        github_repo: githubRepo,
        audit_type: auditType,
        status: 'submitted',
        metadata: { description }
      })
      .select()
      .single()

    if (auditError) {
      console.error('Audit project creation error:', auditError)
      return NextResponse.json({ 
        error: 'Failed to create audit project' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      auditProject 
    })
  } catch (error) {
    console.error('Submit audit error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const projectId = url.searchParams.get('id')

    // Get user data
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let data: any, error: any

    if (projectId) {
      const result = await supabase
        .from('audit_projects')
        .select('*')
        .eq('user_id', userData.id)
        .eq('id', projectId)
        .single()
      data = result.data
      error = result.error
    } else {
      const result = await supabase
        .from('audit_projects')
        .select('*')
        .eq('user_id', userData.id)
        .order('created_at', { ascending: false })
      data = result.data
      error = result.error
    }

    if (error) {
      console.error('Audit projects fetch error:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch audit projects' 
      }, { status: 500 })
    }

    return NextResponse.json(projectId ? { project: data } : { projects: data })
  } catch (error) {
    console.error('Audit projects API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}