import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user data with orders and subscriptions
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(`
        *,
        orders (
          id,
          service_id,
          status,
          amount,
          currency,
          created_at,
          completed_at
        ),
        subscriptions (
          id,
          service_id,
          status,
          current_period_end,
          created_at
        ),
        audit_projects (
          id,
          project_name,
          status,
          created_at,
          completed_at
        ),
        academy_enrollments (
          id,
          course_id,
          progress,
          status,
          enrolled_at,
          completed_at
        )
      `)
      .eq('email', session.user.email)
      .single()

    if (userError) {
      console.error('User fetch error:', userError)
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 })
    }

    // Calculate statistics
    const totalOrders = userData.orders?.length || 0
    const completedOrders = userData.orders?.filter((order: any) => order.status === 'completed').length || 0
    const totalSpent = userData.orders?.reduce((sum: number, order: any) => 
      order.status === 'paid' || order.status === 'completed' ? sum + parseFloat(order.amount) : sum, 0
    ) || 0
    
    const activeSubscriptions = userData.subscriptions?.filter((sub: any) => sub.status === 'active').length || 0
    const auditProjects = userData.audit_projects?.length || 0
    const academyEnrollments = userData.academy_enrollments?.length || 0

    return NextResponse.json({
      user: {
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name,
        avatar_url: userData.avatar_url,
        subscription_status: userData.subscription_status,
        total_spent: totalSpent,
        created_at: userData.created_at,
      },
      stats: {
        totalOrders,
        completedOrders,
        totalSpent,
        activeSubscriptions,
        auditProjects,
        academyEnrollments,
      },
      recentOrders: userData.orders?.slice(-5).reverse() || [],
      activeSubscriptions: userData.subscriptions?.filter((sub: any) => sub.status === 'active') || [],
      auditProjects: userData.audit_projects?.slice(-3).reverse() || [],
      academyProgress: userData.academy_enrollments?.slice(-3).reverse() || [],
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}