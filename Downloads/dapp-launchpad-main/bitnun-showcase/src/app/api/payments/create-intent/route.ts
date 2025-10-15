import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createPaymentIntent, SERVICE_PRICES } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json() as { serviceKey: keyof typeof SERVICE_PRICES; metadata?: Record<string, any> }
    const { serviceKey, metadata } = body

    if (typeof serviceKey !== 'string' || !(serviceKey in SERVICE_PRICES)) {
      return NextResponse.json({ error: 'Invalid service' }, { status: 400 })
    }

    const service = SERVICE_PRICES[serviceKey as keyof typeof SERVICE_PRICES]

    // Create payment intent
    const paymentIntent = await createPaymentIntent(
      serviceKey,
      session.user.email,
      metadata
    )

    // Create order record
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: session.user.id,
        service_id: serviceKey,
        amount: service.price,
        currency: service.currency.toUpperCase(),
        payment_method: 'stripe',
        stripe_payment_intent_id: paymentIntent.id,
        status: 'pending',
        metadata,
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order creation error:', orderError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: orderData.id,
      amount: service.price,
      currency: service.currency,
    })
  } catch (error) {
    console.error('Payment intent error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}