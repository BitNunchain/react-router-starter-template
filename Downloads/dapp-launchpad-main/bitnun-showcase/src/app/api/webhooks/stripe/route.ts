import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // Update order status to paid
        const { error: orderError } = await supabaseAdmin
          .from('orders')
          .update({ 
            status: 'paid',
            completed_at: new Date().toISOString()
          })
          .eq('stripe_payment_intent_id', paymentIntent.id)

        if (orderError) {
          console.error('Order update error:', orderError)
        }

        // Create revenue tracking record
        const orderData = await supabaseAdmin
          .from('orders')
          .select('*')
          .eq('stripe_payment_intent_id', paymentIntent.id)
          .single()

        if (orderData.data) {
          const grossAmount = orderData.data.amount
          const platformFee = grossAmount * 0.03 // 3% platform fee
          const netAmount = grossAmount - platformFee

          await supabaseAdmin.from('revenue_tracking').insert({
            order_id: orderData.data.id,
            service_category: orderData.data.metadata?.category || 'general',
            gross_amount: grossAmount,
            platform_fee: platformFee,
            net_amount: netAmount,
            payout_status: 'pending',
          })
        }

        // Handle specific service fulfillment
        await handleServiceFulfillment(paymentIntent)
        break

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as any // Stripe Invoice with subscription
        
        // Handle subscription payment
        if (invoice.subscription) {
          await supabaseAdmin
            .from('subscriptions')
            .update({ 
              status: 'active',
              current_period_end: new Date((invoice.period_end || 0) * 1000).toISOString()
            })
            .eq('stripe_subscription_id', invoice.subscription)
        }
        break

      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription
        
        await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('stripe_subscription_id', subscription.id)
        break

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handleServiceFulfillment(paymentIntent: Stripe.PaymentIntent) {
  const serviceKey = paymentIntent.metadata.service_key
  const userEmail = paymentIntent.metadata.user_email

  switch (serviceKey) {
    case 'basic_audit':
    case 'professional_audit':
    case 'enterprise_audit':
      // Create audit project
      const { data: orderData } = await supabaseAdmin
        .from('orders')
        .select('user_id, id')
        .eq('stripe_payment_intent_id', paymentIntent.id)
        .single()

      if (orderData) {
        await supabaseAdmin.from('audit_projects').insert({
          order_id: orderData.id,
          user_id: orderData.user_id,
          project_name: paymentIntent.metadata.project_name || 'New Audit Project',
          contract_address: paymentIntent.metadata.contract_address,
          github_repo: paymentIntent.metadata.github_repo,
          audit_type: serviceKey.replace('_audit', '') as 'basic' | 'professional' | 'enterprise',
          status: 'submitted',
        })

        // Send notification email to business owner
        await sendNotificationEmail({
          to: process.env.BUSINESS_EMAIL!,
          subject: 'New Audit Order Received',
          content: `New ${serviceKey} audit ordered by ${userEmail}. Amount: $${paymentIntent.amount / 100}`,
        })
      }
      break

    case 'blockchain_fundamentals':
    case 'defi_mastery':
    case 'enterprise_program':
      // Enroll user in course
      const { data: courseOrderData } = await supabaseAdmin
        .from('orders')
        .select('user_id, id')
        .eq('stripe_payment_intent_id', paymentIntent.id)
        .single()

      if (courseOrderData) {
        await supabaseAdmin.from('academy_enrollments').insert({
          user_id: courseOrderData.user_id,
          course_id: serviceKey,
          order_id: courseOrderData.id,
          status: 'enrolled',
        })

        // Send welcome email with course access
        await sendNotificationEmail({
          to: userEmail,
          subject: 'Welcome to BITNUN Academy!',
          content: `You've been enrolled in ${paymentIntent.metadata.service_name}. Access your course at https://academy.bitnun.com`,
        })
      }
      break

    default:
      // Send general fulfillment notification
      await sendNotificationEmail({
        to: process.env.BUSINESS_EMAIL!,
        subject: 'New Service Order',
        content: `New ${serviceKey} order from ${userEmail}. Amount: $${paymentIntent.amount / 100}`,
      })
  }
}

async function sendNotificationEmail({ to, subject, content }: { to: string, subject: string, content: string }) {
  // Implement email sending logic here
  // You can use services like SendGrid, Resend, or AWS SES
  console.log(`Sending email to ${to}: ${subject} - ${content}`)
}