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

    // Get user profile
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', session.user.email)
      .single()

    if (error) {
      console.error('Profile fetch error:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch profile' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      profile: {
        fullName: profile?.full_name || session.user.name || '',
        email: profile?.email || session.user.email,
        walletAddress: profile?.wallet_address || '',
        subscriptionStatus: profile?.subscription_status || 'none',
        totalSpent: profile?.total_spent || 0
      }
    })
  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { fullName, walletAddress } = body

    // Update user profile
    const { data: updatedProfile, error } = await supabase
      .from('users')
      .update({
        full_name: fullName,
        wallet_address: walletAddress,
        updated_at: new Date().toISOString()
      })
      .eq('email', session.user.email)
      .select()
      .single()

    if (error) {
      console.error('Profile update error:', error)
      return NextResponse.json({ 
        error: 'Failed to update profile' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      profile: {
        fullName: updatedProfile.full_name || '',
        email: updatedProfile.email,
        walletAddress: updatedProfile.wallet_address || '',
        subscriptionStatus: updatedProfile.subscription_status || 'none',
        totalSpent: updatedProfile.total_spent || 0
      }
    })
  } catch (error) {
    console.error('Profile update API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}