import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { supabaseAdmin } from './supabase'
import { createStripeCustomer } from './stripe'

// Only add providers that have real credentials
const providers = []

// Add Google OAuth if credentials are configured
if (process.env.GOOGLE_CLIENT_ID && 
    process.env.GOOGLE_CLIENT_SECRET && 
    !process.env.GOOGLE_CLIENT_ID.includes('demo')) {
  providers.push(GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }))
}

// Add GitHub OAuth if credentials are configured
if (process.env.GITHUB_CLIENT_ID && 
    process.env.GITHUB_CLIENT_SECRET && 
    !process.env.GITHUB_CLIENT_ID.includes('demo')) {
  providers.push(GitHubProvider({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  }))
}

export const authOptions: NextAuthOptions = {
  providers,
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Check if we're in demo mode
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        
        if (supabaseUrl?.includes('demo') || supabaseKey?.includes('demo')) {
          // Demo mode - always allow sign in
          console.log('Demo mode: allowing sign in for', user.email)
          return true
        }

        // Check if user exists in Supabase
        const { data: existingUser } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('email', user.email!)
          .single()

        if (!existingUser) {
          // Create Stripe customer
          const stripeCustomer = await createStripeCustomer(
            user.email!,
            user.name || undefined
          )

          // Create user in Supabase
          const { error } = await supabaseAdmin.from('users').insert({
            id: crypto.randomUUID(),
            email: user.email!,
            full_name: user.name,
            avatar_url: user.image,
            stripe_customer_id: stripeCustomer.id,
          })

          if (error) {
            console.error('Error creating user:', error)
            return false
          }
        }

        return true
      } catch (error) {
        console.error('SignIn error:', error)
        // In case of any error, still allow sign in in demo mode
        return true
      }
    },
    async session({ session, token }) {
      if (session.user?.email) {
        try {
          // Only try to get user data if Supabase is properly configured
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
          const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
          
          if (supabaseUrl?.includes('demo') || supabaseKey?.includes('demo')) {
            // Demo mode - create a demo user ID
            session.user.id = `demo-${Buffer.from(session.user.email).toString('base64')}`
            session.user.stripeCustomerId = 'demo-customer'
            session.user.subscriptionStatus = 'demo'
            session.user.totalSpent = 0
          } else {
            // Get user data from Supabase
            const { data: userData } = await supabaseAdmin
              .from('users')
              .select('*')
              .eq('email', session.user.email)
              .single()

            if (userData) {
              session.user.id = userData.id
              session.user.stripeCustomerId = userData.stripe_customer_id
              session.user.subscriptionStatus = userData.subscription_status
              session.user.totalSpent = userData.total_spent
            }
          }
        } catch (error) {
          console.error('Session callback error:', error)
          // Fallback to demo data on any error
          session.user.id = `demo-${Buffer.from(session.user.email).toString('base64')}`
          session.user.stripeCustomerId = 'demo-customer'
          session.user.subscriptionStatus = 'demo'
          session.user.totalSpent = 0
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}