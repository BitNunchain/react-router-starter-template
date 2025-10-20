import { NextAuthOptions } from 'next-auth'

// Simplified auth configuration - no authentication required
export const authOptions: NextAuthOptions = {
  providers: [
    // No OAuth providers - dashboard works without authentication
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn() {
      // Always allow access (no authentication required)
      return true
    },
    async session({ session }) {
      // Return demo session for unauthenticated users
      if (!session.user) {
        session.user = {
          id: 'demo-user',
          email: 'demo@unifiednun.com',
          name: 'Demo User',
          image: null,
        }
      }
      
      // Add demo user properties
      session.user.id = session.user.id || 'demo-user'
      session.user.stripeCustomerId = 'demo-customer'
      session.user.subscriptionStatus = 'demo'
      session.user.totalSpent = 0
      
      return session
    },
  },
}